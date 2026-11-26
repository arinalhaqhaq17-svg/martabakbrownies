/**
 * Proxy server untuk integrasi chatbot n8n.
 * Berjalan otomatis sebagai Vercel Serverless Function (/api/n8n-chat)
 * dan juga di-mount oleh server.ts pada lingkungan development lokal / preview.
 *
 * Meneruskan pesan dari browser ke webhook n8n dari sisi server agar bebas kendala CORS.
 */

interface ServerlessRequest {
  method?: string;
  body?: unknown;
  [Symbol.asyncIterator]?: () => AsyncIterator<Uint8Array | string>;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  setHeader: (name: string, value: string) => void;
  json: (data: unknown) => void;
}

const REQUEST_TIMEOUT_MS = 25000;
const MAX_MESSAGE_LENGTH = 500;
const MAX_BODY_BYTES = 32 * 1024;

function isBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // Block private & link-local IPv4 ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(lower);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (
      a === 127 ||
      a === 10 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 192 && b === 168) ||
      (a === 172 && b >= 16 && b <= 31)
    ) {
      return true;
    }
  }

  return false;
}

function validateHttpsWebhookUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return null;
    if (isBlockedHost(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function getServerWebhookUrl(): string | null {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env;
  const raw = env?.N8N_WEBHOOK_URL || env?.VITE_N8N_WEBHOOK_URL || '';
  return validateHttpsWebhookUrl(raw);
}

async function readRequestBody(req: ServerlessRequest): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    return req.body;
  }

  if (typeof req[Symbol.asyncIterator] !== 'function') {
    return {};
  }

  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = '';

  for await (const chunk of req as AsyncIterable<Uint8Array | string>) {
    const bytes =
      typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;
    totalBytes += bytes.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error('BODY_TOO_LARGE');
    }
    text += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true });
  }
  text += decoder.decode();

  return text ? JSON.parse(text) : {};
}

function extractTextFromValue(data: unknown): string | null {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed || null;
  }

  if (Array.isArray(data) && data.length > 0) {
    for (const item of data) {
      const found = extractTextFromValue(item);
      if (found) return found;
    }
    return null;
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const keys = [
      'reply',
      'output',
      'text',
      'message',
      'response',
      'answer',
      'content',
    ];
    for (const key of keys) {
      const val = record[key];
      if (typeof val === 'string' && val.trim()) {
        return val.trim();
      }
    }
    if (record.json !== undefined) {
      const nested = extractTextFromValue(record.json);
      if (nested) return nested;
    }
    if (record.data !== undefined) {
      const nested = extractTextFromValue(record.data);
      if (nested) return nested;
    }
  }

  return null;
}

function parseN8nRawResponse(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // 1. Standard JSON object or array
  try {
    const parsed: unknown = JSON.parse(trimmed);
    const extracted = extractTextFromValue(parsed);
    if (extracted) return extracted;
  } catch {
    // Continue to NDJSON / streaming / plain text check
  }

  // 2. NDJSON / streaming chunks emitted by n8n Chat Trigger AI Agent
  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.replace(/^data:\s*/, '').trim())
    .filter(Boolean);

  if (lines.length > 1) {
    const chunks: string[] = [];
    let parsedAnyJsonLine = false;

    for (const line of lines) {
      try {
        const parsedLine: unknown = JSON.parse(line);
        parsedAnyJsonLine = true;
        if (parsedLine && typeof parsedLine === 'object') {
          const obj = parsedLine as Record<string, unknown>;
          if (obj.type === 'item' && typeof obj.content === 'string') {
            chunks.push(obj.content);
          } else {
            const text = extractTextFromValue(obj);
            if (text && obj.type !== 'begin' && obj.type !== 'end') {
              chunks.push(text);
            }
          }
        }
      } catch {
        // Ignore malformed streaming line
      }
    }

    if (parsedAnyJsonLine) {
      const combined = chunks.join('').trim();
      if (combined) return combined;
    }
  }

  // 3. Plain text response
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return trimmed;
  }

  return null;
}

async function postToN8n(
  url: string,
  payload: Record<string, unknown>,
  signal: AbortSignal
): Promise<{ ok: boolean; status: number; rawText: string }> {
  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(payload),
    signal,
  });

  const rawText = await upstream.text();
  return { ok: upstream.ok, status: upstream.status, rawText };
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metode tidak diizinkan.' });
    return;
  }

  const webhookUrl = getServerWebhookUrl();
  if (!webhookUrl) {
    res.status(200).json({ configured: false });
    return;
  }

  let parsedBody: unknown;
  try {
    parsedBody = await readRequestBody(req);
  } catch (err) {
    if (err instanceof Error && err.message === 'BODY_TOO_LARGE') {
      res.status(413).json({ error: 'Ukuran pesan terlalu besar.' });
      return;
    }
    res.status(400).json({ error: 'Format payload tidak valid.' });
    return;
  }

  let bodyObj: Record<string, unknown> = {};
  if (typeof parsedBody === 'string') {
    try {
      bodyObj = JSON.parse(parsedBody) as Record<string, unknown>;
    } catch {
      res.status(400).json({ error: 'Format payload tidak valid.' });
      return;
    }
  } else if (parsedBody && typeof parsedBody === 'object') {
    bodyObj = parsedBody as Record<string, unknown>;
  }

  const rawInput =
    typeof bodyObj.chatInput === 'string'
      ? bodyObj.chatInput
      : typeof bodyObj.message === 'string'
        ? bodyObj.message
        : '';

  const chatInput = rawInput.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!chatInput) {
    res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    return;
  }

  const rawSession =
    typeof bodyObj.session_id === 'string' && bodyObj.session_id.trim()
      ? bodyObj.session_id.trim()
      : typeof bodyObj.sessionId === 'string' && bodyObj.sessionId.trim()
        ? bodyObj.sessionId.trim()
        : `mb-${Date.now()}`;
  const sessionId = rawSession.slice(0, 100);

  const outboundPayload = {
    action: 'sendMessage',
    sessionId,
    session_id: sessionId,
    chatInput,
    message: chatInput,
    metadata: {
      brand: 'MARTABAK BROWNIS',
      location: 'Banda Aceh, Aceh',
      source: 'martabak-brownis-web',
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let result = await postToN8n(webhookUrl, outboundPayload, controller.signal);

    // Jika URL masih memakai /webhook-test/ dan belum di-trigger (404),
    // coba otomatis URL Production (/webhook/) pada host n8n yang sama.
    if (!result.ok && result.status === 404 && webhookUrl.includes('/webhook-test/')) {
      const prodUrl = validateHttpsWebhookUrl(
        webhookUrl.replace('/webhook-test/', '/webhook/')
      );
      if (prodUrl) {
        const prodResult = await postToN8n(prodUrl, outboundPayload, controller.signal);
        if (prodResult.ok) {
          result = prodResult;
        }
      }
    }

    if (!result.ok) {
      const isTestWebhook = webhookUrl.includes('/webhook-test/');
      const detail =
        result.status === 404 && isTestWebhook
          ? 'URL webhook n8n menggunakan /webhook-test/ yang tidak aktif. Aktifkan workflow di n8n dan gunakan URL Production (/webhook/...).'
          : `Webhook n8n merespons dengan status ${result.status}. Pastikan workflow n8n aktif.`;

      res.status(502).json({ error: detail });
      return;
    }

    const reply = parseN8nRawResponse(result.rawText);
    res.status(200).json({
      configured: true,
      reply:
        reply ??
        'Pesan Anda sudah diterima oleh n8n. Pastikan node Respond to Webhook atau AI Agent mengembalikan field reply/output/text.',
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    res.status(504).json({
      error: isTimeout
        ? 'Waktu tunggu respons dari server n8n habis. Silakan coba lagi.'
        : 'Tidak dapat terhubung ke server n8n. Periksa kembali URL webhook pada pengaturan server.',
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
