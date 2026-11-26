import {
  BUSINESS_INFO,
  MENU_ITEMS,
  PRODUCT_FEATURES,
  TARGET_MARKET,
} from '../data/business';

export interface N8nChatPayload {
  action: 'sendMessage';
  sessionId: string;
  session_id: string;
  chatInput: string;
  message: string;
  metadata: {
    brand: string;
    location: string;
    source: string;
  };
}

export interface N8nChatResult {
  reply: string;
  source: 'n8n' | 'assistant';
}

const REQUEST_TIMEOUT_MS = 25000;
const MAX_MESSAGE_LENGTH = 500;

/**
 * Membaca dan memvalidasi URL webhook n8n dari environment variable Vite.
 * Hanya mengizinkan skema https (atau http khusus localhost untuk pengujian lokal).
 */
export function getValidatedN8nWebhookUrl(): string | null {
  const raw = (import.meta.env.VITE_N8N_WEBHOOK_URL ?? '')
    .trim()
    .replace(/^["']|["']$/g, '');
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    const isHttps = parsed.protocol === 'https:';
    const isLocalHttp =
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');

    if (!isHttps && !isLocalHttp) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function isN8nConfigured(): boolean {
  return getValidatedN8nWebhookUrl() !== null;
}

export function createChatSessionId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `mb-${crypto.randomUUID()}`;
  }
  return `mb-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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
    const candidateKeys = [
      'reply',
      'output',
      'text',
      'message',
      'response',
      'answer',
      'content',
    ];

    for (const key of candidateKeys) {
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

  try {
    const parsed: unknown = JSON.parse(trimmed);
    const extracted = extractTextFromValue(parsed);
    if (extracted) return extracted;
  } catch {
    // Lanjut cek NDJSON atau teks biasa
  }

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
        // Lewati baris non-JSON
      }
    }

    if (parsedAnyJsonLine) {
      const combined = chunks.join('').trim();
      if (combined) return combined;
    }
  }

  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return trimmed;
  }

  return null;
}

function buildBuiltInReply(input: string): string {
  const q = input.toLowerCase();

  if (
    /^(halo|hai|hello|hi|assalamualaikum|permisi|selamat (pagi|siang|sore|malam))\b/.test(
      q
    )
  ) {
    return `Halo! Selamat datang di ${BUSINESS_INFO.name} (${BUSINESS_INFO.location}). Saya siap membantu info daftar menu, harga, rekomendasi topping, atau cara pemesanan via WhatsApp. Ada varian yang ingin ditanyakan?`;
  }

  if (/(terima kasih|makasih|thanks|tq|oke|siap)/.test(q)) {
    return `Sama-sama! Jika ingin langsung memesan, silakan klik tombol Pesan WhatsApp di bawah atau pilih varian favorit Anda di halaman Menu.`;
  }

  const matchedMenu = MENU_ITEMS.find((item) => {
    const lowerName = item.name.toLowerCase();
    return (
      q.includes(lowerName) ||
      (item.id === 'original-cokelat' && q.includes('original')) ||
      (item.id === 'cokelat-keju' && q.includes('keju')) ||
      (item.id === 'cokelat-kacang' && q.includes('kacang')) ||
      (item.id === 'cokelat-oreo' && q.includes('oreo')) ||
      (item.id === 'premium-mix' && (q.includes('premium') || q.includes('mix')))
    );
  });

  if (matchedMenu && !q.includes('semua') && !q.includes('daftar')) {
    return `${matchedMenu.name} (${matchedMenu.priceFormatted})\n${matchedMenu.description}\n\nAnda dapat langsung memesan varian ini melalui tombol Pesan Sekarang di bagian Menu atau via WhatsApp di bawah.`;
  }

  if (/(rekomendasi|favorit|best|terlaris|enak|saran)/.test(q)) {
    return `Untuk pilihan favorit pelanggan ${BUSINESS_INFO.name}:\n• Cokelat Keju (Rp18.000) — perpaduan manis cokelat brownis & gurih keju parut.\n• Cokelat Oreo (Rp20.000) — favorit remaja dengan remahan Oreo renyah.\n• Premium Mix (Rp25.000) — topping lengkap dalam satu loyang untuk dinikmati bersama.`;
  }

  if (/(menu|harga|varian|topping|daftar|berapa|list)/.test(q)) {
    const menuLines = MENU_ITEMS.map(
      (item) => `• ${item.name} — ${item.priceFormatted}`
    ).join('\n');
    return `Berikut daftar lengkap menu ${BUSINESS_INFO.name}:\n${menuLines}\n\nSemua varian dibuat dengan tekstur martabak lembut dan rasa cokelat khas brownis.`;
  }

  if (/(pesan|order|beli|acara|ulang tahun|ultah|wa|whatsapp|kado)/.test(q)) {
    return `Cara pemesanan ${BUSINESS_INFO.name} sangat mudah:\n1. Pilih varian di bagian Menu lalu klik "Pesan Sekarang", atau gunakan "Daftar Pesanan" untuk pesan beberapa loyang sekaligus.\n2. Anda juga bisa mengisi form Pesan Cepat di bagian Kontak.\n\nKami juga menerima pesanan untuk acara ulang tahun dan kumpul keluarga di Banda Aceh.`;
  }

  if (/(keunggulan|tekstur|lembut|bahan|kualitas|rasa|kenapa)/.test(q)) {
    const featureLines = PRODUCT_FEATURES.map((f) => `• ${f.title}`).join('\n');
    return `Keunggulan ${BUSINESS_INFO.name}:\n${featureLines}\n\nCocok untuk pelajar, mahasiswa, pekerja, maupun masyarakat umum.`;
  }

  if (/(lokasi|alamat|dimana|di mana|aceh|banda|buka|jam|outlet|toko)/.test(q)) {
    return `${BUSINESS_INFO.name} berlokasi di ${BUSINESS_INFO.location}. Untuk informasi detail alamat outlet dan jam operasional terbaru, silakan hubungi kami langsung melalui tombol Pesan WhatsApp di bawah.`;
  }

  if (/(target|cocok|siapa|usia|kalangan)/.test(q)) {
    const targetLines = TARGET_MARKET.map(
      (t) => `• ${t.label}: ${t.value}`
    ).join('\n');
    return `${BUSINESS_INFO.name} cocok dinikmati oleh:\n${targetLines}`;
  }

  return `Terima kasih sudah menghubungi ${BUSINESS_INFO.name} (${BUSINESS_INFO.location}). Anda bisa menanyakan seputar daftar menu & harga (mulai Rp15.000), rekomendasi topping favorit, keunggulan produk, atau cara pemesanan untuk acara ulang tahun.`;
}

async function callServerProxy(
  payload: N8nChatPayload
): Promise<
  | { status: 'success'; result: N8nChatResult }
  | { status: 'unconfigured' }
  | { status: 'unavailable' }
  | { status: 'error'; errorMessage: string }
> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch('/api/n8n-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return { status: 'unavailable' };
    }

    const data = (await response.json()) as {
      configured?: boolean;
      reply?: string;
      error?: string;
    };

    if (!response.ok) {
      return {
        status: 'error',
        errorMessage:
          data.error ??
          `Layanan chat n8n merespons dengan status ${response.status}.`,
      };
    }

    if (data.configured === false) {
      return { status: 'unconfigured' };
    }

    return {
      status: 'success',
      result: {
        reply:
          data.reply ??
          'Pesan Anda sudah diterima oleh n8n, namun belum ada teks balasan yang dikembalikan.',
        source: 'n8n',
      },
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        status: 'error',
        errorMessage:
          'Waktu tunggu respons dari n8n habis. Silakan coba kirim ulang pesan Anda.',
      };
    }
    return { status: 'unavailable' };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function callDirectWebhook(
  webhookUrl: string,
  payload: N8nChatPayload
): Promise<N8nChatResult> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    let response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (
      !response.ok &&
      response.status === 404 &&
      webhookUrl.includes('/webhook-test/')
    ) {
      const prodUrl = webhookUrl.replace('/webhook-test/', '/webhook/');
      const prodResponse = await fetch(prodUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (prodResponse.ok) {
        response = prodResponse;
      }
    }

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Server n8n merespons dengan status ${response.status}. Pastikan workflow aktif dan node Respond to Webhook sudah terpasang.`
      );
    }

    const extracted = parseN8nRawResponse(rawText);
    return {
      reply:
        extracted ??
        'Pesan berhasil diterima oleh n8n, namun belum ada teks balasan yang dikirim kembali.',
      source: 'n8n',
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(
        'Waktu tunggu respons dari n8n habis. Silakan coba kirim ulang pesan Anda.'
      );
    }
    if (error instanceof TypeError) {
      throw new Error(
        'Gagal terhubung ke webhook n8n (kendala jaringan atau CORS). Pastikan pengaturan CORS di n8n menyertakan https:// atau gunakan proxy /api/n8n-chat.'
      );
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      'Gagal terhubung ke webhook n8n. Silakan coba beberapa saat lagi.'
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function sendMessageToN8n(
  rawMessage: string,
  sessionId: string
): Promise<N8nChatResult> {
  const cleaned = rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!cleaned) {
    throw new Error('Pesan tidak boleh kosong.');
  }

  const payload: N8nChatPayload = {
    action: 'sendMessage',
    sessionId,
    session_id: sessionId,
    chatInput: cleaned,
    message: cleaned,
    metadata: {
      brand: BUSINESS_INFO.name,
      location: BUSINESS_INFO.location,
      source: 'martabak-brownis-web',
    },
  };

  // Selalu utamakan proxy server /api/n8n-chat terlebih dahulu (aktif di dev server.ts
  // maupun di Vercel Serverless Function) sehingga bebas dari blokir CORS browser.
  const proxyResponse = await callServerProxy(payload);
  if (proxyResponse.status === 'success') {
    return proxyResponse.result;
  }
  if (proxyResponse.status === 'error') {
    throw new Error(proxyResponse.errorMessage);
  }

  // Jika endpoint /api/n8n-chat tidak tersedia (misal static host murni) dan VITE_N8N_WEBHOOK_URL ada
  const clientWebhookUrl = getValidatedN8nWebhookUrl();
  if (proxyResponse.status === 'unavailable' && clientWebhookUrl) {
    return callDirectWebhook(clientWebhookUrl, payload);
  }

  // Fallback asisten lokal bila webhook n8n belum dikonfigurasi
  return {
    reply: buildBuiltInReply(cleaned),
    source: 'assistant',
  };
}
