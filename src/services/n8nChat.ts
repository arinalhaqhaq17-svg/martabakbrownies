import { BUSINESS_INFO, MENU_ITEMS } from '../data/business';

export interface N8nChatPayload {
  action: 'sendMessage';
  sessionId: string;
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
  source: 'n8n' | 'unconfigured';
}

const REQUEST_TIMEOUT_MS = 25000;
const MAX_MESSAGE_LENGTH = 500;

/**
 * Membaca dan memvalidasi URL webhook n8n dari environment variable Vite.
 * Hanya mengizinkan skema https (atau http khusus localhost untuk pengujian lokal).
 */
export function getValidatedN8nWebhookUrl(): string | null {
  const raw = (import.meta.env.VITE_N8N_WEBHOOK_URL ?? '').trim();
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
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `mb-${crypto.randomUUID()}`;
  }
  return `mb-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Mengekstrak teks balasan dari berbagai format respons standar n8n
 * (Chat Trigger node maupun Webhook + Respond to Webhook node).
 */
function extractReplyText(data: unknown): string | null {
  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed || null;
  }

  if (Array.isArray(data) && data.length > 0) {
    return extractReplyText(data[0]);
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const candidateKeys = [
      'output',
      'text',
      'reply',
      'message',
      'response',
      'answer',
    ];

    for (const key of candidateKeys) {
      const val = record[key];
      if (typeof val === 'string' && val.trim()) {
        return val.trim();
      }
    }

    if (record.data !== undefined) {
      return extractReplyText(record.data);
    }
  }

  return null;
}

/**
 * Jawaban informatif berbasis data resmi usaha jika VITE_N8N_WEBHOOK_URL
 * belum diisi pada environment deployment.
 */
function buildUnconfiguredReply(input: string): string {
  const q = input.toLowerCase();

  if (q.includes('menu') || q.includes('harga') || q.includes('varian')) {
    const menuLines = MENU_ITEMS.map(
      (item) => `• ${item.name} — ${item.priceFormatted}`
    ).join('\n');
    return `Berikut daftar menu ${BUSINESS_INFO.name}:\n${menuLines}\n\nCatatan: Integrasi chatbot n8n belum diaktifkan. Tambahkan VITE_N8N_WEBHOOK_URL di Environment Variables untuk mengaktifkan balasan otomatis dari workflow n8n.`;
  }

  if (q.includes('lokasi') || q.includes('alamat') || q.includes('dimana')) {
    return `${BUSINESS_INFO.name} berlokasi di ${BUSINESS_INFO.location}.\n\nCatatan: Tambahkan VITE_N8N_WEBHOOK_URL di Environment Variables untuk menghubungkan chatbot ini ke workflow n8n Anda.`;
  }

  if (q.includes('pesan') || q.includes('order') || q.includes('acara') || q.includes('ulang tahun')) {
    return `Anda dapat memesan langsung melalui tombol WhatsApp pada halaman Menu atau bagian Kontak, termasuk untuk pesanan acara ulang tahun.\n\nCatatan: Untuk balasan otomatis melalui n8n, silakan isi VITE_N8N_WEBHOOK_URL pada pengaturan environment.`;
  }

  return `Webhook n8n belum dikonfigurasi pada situs ini. Atur variabel lingkungan VITE_N8N_WEBHOOK_URL dengan URL Webhook atau Chat Trigger n8n Anda, lalu deploy ulang agar chatbot dapat memproses pesan secara langsung.`;
}

export async function sendMessageToN8n(
  rawMessage: string,
  sessionId: string
): Promise<N8nChatResult> {
  const cleaned = rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!cleaned) {
    throw new Error('Pesan tidak boleh kosong.');
  }

  const webhookUrl = getValidatedN8nWebhookUrl();
  if (!webhookUrl) {
    return {
      reply: buildUnconfiguredReply(cleaned),
      source: 'unconfigured',
    };
  }

  const payload: N8nChatPayload = {
    action: 'sendMessage',
    sessionId,
    chatInput: cleaned,
    message: cleaned,
    metadata: {
      brand: BUSINESS_INFO.name,
      location: BUSINESS_INFO.location,
      source: 'martabak-brownis-web',
    },
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Server n8n merespons dengan status ${response.status}. Pastikan workflow aktif dan CORS diizinkan.`
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    let extracted: string | null = null;

    if (contentType.includes('application/json')) {
      const json: unknown = await response.json();
      extracted = extractReplyText(json);
    } else {
      const text = await response.text();
      try {
        extracted = extractReplyText(JSON.parse(text));
      } catch {
        extracted = extractReplyText(text);
      }
    }

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
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      'Gagal terhubung ke webhook n8n. Periksa koneksi internet atau konfigurasi CORS pada n8n.'
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}
