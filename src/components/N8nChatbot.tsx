import { type FormEvent, useEffect, useRef, useState } from 'react';
import {
  Loader2,
  MessageCircle,
  MessageSquareText,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppUrl } from '../data/business';
import {
  createChatSessionId,
  isN8nConfigured,
  sendMessageToN8n,
} from '../services/n8nChat';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  'Daftar menu & harga',
  'Rekomendasi varian favorit',
  'Cara pesan untuk acara ulang tahun',
];

function formatTimeNow(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: 'welcome',
      sender: 'bot',
      text: `Halo! Selamat datang di ${BUSINESS_INFO.name} Banda Aceh. Ada yang bisa kami bantu seputar varian menu, harga, atau pemesanan?`,
      timestamp: formatTimeNow(),
    },
  ];
}

export function N8nChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() =>
    createChatSessionId()
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createInitialMessages()
  );
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const n8nReady = isN8nConfigured();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isOpen, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: formatTimeNow(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const result = await sendMessageToN8n(trimmed, sessionId);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.reply,
        timestamp: formatTimeNow(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text:
          error instanceof Error
            ? error.message
            : 'Maaf, terjadi kendala saat menghubungi layanan chat.',
        timestamp: formatTimeNow(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend(input);
  };

  const handleReset = () => {
    setSessionId(createChatSessionId());
    setMessages(createInitialMessages());
    setInput('');
  };

  const whatsappFallbackHref = buildWhatsAppUrl(
    'Halo MARTABAK BROWNIS, saya ingin bertanya tentang pemesanan Martabak Brownis.'
  );

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="Asisten Chat Martabak Brownis"
          className="mb-3 flex h-[min(540px,calc(100vh-7rem))] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#FAF6F0] shadow-[0_24px_50px_-16px_rgba(29,16,10,0.45)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#24150E] px-5 py-4 text-[#FAF6F0]">
            <div className="min-w-0">
              <h2 className="font-display text-base font-semibold leading-tight text-[#FAF6F0]">
                Asisten {BUSINESS_INFO.name}
              </h2>
              <p className="mt-0.5 text-xs text-[#DFCBB5]">
                {n8nReady
                  ? 'Terhubung dengan otomatisasi n8n'
                  : 'Integrasi n8n · Siap dikonfigurasi'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                aria-label="Mulai ulang percakapan"
                title="Mulai ulang percakapan"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#DFCBB5] transition-colors hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup jendela chat"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#DFCBB5] transition-colors hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div
            ref={scrollContainerRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'rounded-br-sm bg-[#24150E] text-[#FAF6F0]'
                        : msg.isError
                          ? 'rounded-bl-sm border border-[#9E6F20]/40 bg-[#F2EAE0] text-[#4F3121]'
                          : 'rounded-bl-sm border border-[#E5D8C7] bg-white text-[#24150E]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-[#6B4631] tabular-nums">
                    {isUser ? 'Anda' : 'Asisten'} · {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-[#E5D8C7] bg-white px-4 py-3 text-xs font-medium text-[#5C4030]">
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin text-[#9E6F20]"
                    aria-hidden="true"
                  />
                  <span>Sedang memproses balasan...</span>
                </div>
              </div>
            )}

            {/* Quick Prompts on Fresh Conversation */}
            {messages.length === 1 && !isSending && (
              <div className="pt-2">
                <p className="mb-2 text-xs font-medium text-[#6B4631]">
                  Pertanyaan cepat
                </p>
                <div className="flex flex-col gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void handleSend(prompt)}
                      className="w-full rounded-xl border border-[#E5D8C7] bg-white px-3.5 py-2.5 text-left text-xs font-medium text-[#24150E] transition-colors hover:border-[#C28E36] hover:bg-[#F2EAE0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Input Area */}
          <div className="border-t border-[#E5D8C7] bg-white p-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="n8n-chat-input" className="sr-only">
                Tulis pesan Anda
              </label>
              <input
                ref={inputRef}
                id="n8n-chat-input"
                type="text"
                maxLength={500}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                placeholder="Tulis pertanyaan Anda..."
                className="min-h-[42px] flex-1 rounded-lg border border-[#E5D8C7] bg-[#FAF6F0] px-3.5 py-2 text-sm text-[#24150E] placeholder:text-[#8B6046] focus:border-[#9E6F20] focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Kirim pesan"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-[#24150E] text-[#DEB05B] transition-colors hover:bg-[#362015] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[#6B4631]">
              <span>Didukung webhook n8n</span>
              <a
                href={whatsappFallbackHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#9E6F20] hover:underline"
              >
                <MessageCircle className="h-3 w-3" aria-hidden="true" />
                <span>Pesan WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? 'Tutup asisten chat Martabak Brownis'
            : 'Buka asisten chat Martabak Brownis'
        }
        className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-[#DEB05B]/45 bg-[#24150E] px-4 py-3 text-sm font-semibold text-[#FAF6F0] shadow-[0_12px_28px_-8px_rgba(29,16,10,0.5)] transition-colors duration-200 hover:bg-[#362015] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
      >
        {isOpen ? (
          <>
            <X className="h-5 w-5 text-[#DEB05B]" aria-hidden="true" />
            <span className="hidden whitespace-nowrap sm:inline">Tutup</span>
          </>
        ) : (
          <>
            <MessageSquareText
              className="h-5 w-5 text-[#DEB05B]"
              aria-hidden="true"
            />
            <span className="hidden whitespace-nowrap sm:inline">
              Tanya Kami
            </span>
          </>
        )}
      </button>
    </div>
  );
}
