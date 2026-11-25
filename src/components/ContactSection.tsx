import { useState } from 'react';
import { Clock, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import {
  BUSINESS_INFO,
  MENU_ITEMS,
  buildWhatsAppUrl,
  formatRupiah,
} from '../data/business';
import { Reveal } from './Reveal';

export function ContactSection() {
  const [customerName, setCustomerName] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState(MENU_ITEMS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const selectedItem =
    MENU_ITEMS.find((item) => item.id === selectedMenuId) ?? MENU_ITEMS[0];
  const estimatedTotal = selectedItem.price * quantity;

  const customOrderMessage = [
    'Halo MARTABAK BROWNIS, saya ingin memesan:',
    `- Varian: ${selectedItem.name} (${selectedItem.priceFormatted})`,
    `- Jumlah: ${quantity} porsi`,
    `- Perkiraan Total: ${formatRupiah(estimatedTotal)}`,
    customerName.trim() ? `- Nama Pemesan: ${customerName.trim()}` : null,
    notes.trim() ? `- Catatan: ${notes.trim()}` : null,
    '',
    'Mohon informasi ketersediaan dan cara pengambilannya ya. Terima kasih.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  const directWhatsAppHref = buildWhatsAppUrl(
    'Halo MARTABAK BROWNIS, saya ingin bertanya tentang menu dan cara pemesanan di Banda Aceh.'
  );

  const formWhatsAppHref = buildWhatsAppUrl(customOrderMessage);

  return (
    <section
      id="kontak"
      className="border-t border-[#FAF6F0]/10 bg-[#22130C] py-20 text-[#FAF6F0] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Info & CTA */}
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="text-sm font-medium text-[#DEB05B]">
                  Kontak &amp; Pemesanan · Banda Aceh, Aceh
                </p>

                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#FAF6F0] sm:text-4xl [text-wrap:balance]">
                  Nikmati Kelezatan Martabak Brownis Sekarang!
                </h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#DFCBB5]">
                  Ingin camilan manis untuk santai sore, teman belajar, atau
                  pesanan acara ulang tahun? Hubungi kami langsung melalui
                  WhatsApp untuk memesan varian favorit Anda.
                </p>

                <div className="mt-8">
                  <a
                    href={directWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-[#C28E36] px-6 py-3 text-sm font-semibold text-[#1D100A] whitespace-nowrap transition-colors duration-200 hover:bg-[#DEB05B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Hubungi via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Honest Editable Business Details */}
              <div className="mt-10 space-y-5 border-t border-[#FAF6F0]/12 pt-8">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#362015] text-[#DEB05B] shrink-0">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#DFCBB5]/75">
                      Lokasi Usaha
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#FAF6F0]">
                      {BUSINESS_INFO.location}
                    </p>
                    <p className="mt-0.5 text-xs text-[#DFCBB5]/70">
                      {BUSINESS_INFO.addressPlaceholder}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#362015] text-[#DEB05B] shrink-0">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#DFCBB5]/75">
                      Nomor WhatsApp Pemesanan
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#FAF6F0]">
                      {BUSINESS_INFO.whatsappDisplayPlaceholder}
                    </p>
                    <p className="mt-0.5 text-xs text-[#DFCBB5]/70">
                      Ubah konstanta{' '}
                      <code className="text-[#DEB05B]">whatsappNumber</code> di{' '}
                      <code className="text-[#DEB05B]">
                        src/data/business.ts
                      </code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#362015] text-[#DEB05B] shrink-0">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#DFCBB5]/75">
                      Jam Operasional &amp; Media Sosial
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[#FAF6F0]">
                      {BUSINESS_INFO.hoursPlaceholder}
                    </p>
                    <p className="mt-1 text-xs text-[#DFCBB5]/75">
                      Instagram · WhatsApp · TikTok (Siap dihubungkan dengan akun
                      resmi usaha)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick-Order Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#FAF6F0]/12 bg-[#2B180F] p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-[#FAF6F0]">
                  Pesan Cepat via WhatsApp
                </h3>
                <p className="mt-1.5 text-sm text-[#DFCBB5]">
                  Susun pesanan Anda di bawah ini agar pesan WhatsApp otomatis
                  terisi rapi.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="order-name"
                      className="block text-xs font-medium text-[#DFCBB5]"
                    >
                      Nama Pemesan (Opsional)
                    </label>
                    <input
                      id="order-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Nadia"
                      className="mt-2 w-full rounded-lg border border-[#FAF6F0]/15 bg-[#1D100A] px-4 py-2.5 text-sm text-[#FAF6F0] placeholder:text-[#DFCBB5]/40 focus:border-[#DEB05B] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="order-variant"
                        className="block text-xs font-medium text-[#DFCBB5]"
                      >
                        Pilih Varian Menu
                      </label>
                      <select
                        id="order-variant"
                        value={selectedMenuId}
                        onChange={(e) => setSelectedMenuId(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#FAF6F0]/15 bg-[#1D100A] px-4 py-2.5 text-sm text-[#FAF6F0] focus:border-[#DEB05B] focus:outline-none"
                      >
                        {MENU_ITEMS.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — {item.priceFormatted}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="order-qty"
                        className="block text-xs font-medium text-[#DFCBB5]"
                      >
                        Jumlah Porsi
                      </label>
                      <input
                        id="order-qty"
                        type="number"
                        min={1}
                        max={50}
                        value={quantity}
                        onChange={(e) => {
                          const parsed = Number.parseInt(e.target.value, 10);
                          setQuantity(
                            Number.isNaN(parsed)
                              ? 1
                              : Math.min(50, Math.max(1, parsed))
                          );
                        }}
                        className="mt-2 w-full rounded-lg border border-[#FAF6F0]/15 bg-[#1D100A] px-4 py-2.5 text-sm text-[#FAF6F0] tabular-nums focus:border-[#DEB05B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="order-notes"
                      className="block text-xs font-medium text-[#DFCBB5]"
                    >
                      Catatan Pesanan (Opsional)
                    </label>
                    <textarea
                      id="order-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Pesanan untuk acara ulang tahun, potong rapi"
                      className="mt-2 w-full resize-none rounded-lg border border-[#FAF6F0]/15 bg-[#1D100A] px-4 py-2.5 text-sm text-[#FAF6F0] placeholder:text-[#DFCBB5]/40 focus:border-[#DEB05B] focus:outline-none"
                    />
                  </div>

                  {/* Estimated Total */}
                  <div className="flex items-center justify-between border-t border-[#FAF6F0]/12 pt-5">
                    <div>
                      <p className="text-xs text-[#DFCBB5]/75">
                        Perkiraan Total Harga
                      </p>
                      <p className="mt-0.5 text-xs text-[#DFCBB5]/60">
                        {selectedItem.name} × {quantity}
                      </p>
                    </div>
                    <p className="font-display text-2xl font-semibold text-[#DEB05B] tabular-nums">
                      {formatRupiah(estimatedTotal)}
                    </p>
                  </div>

                  <a
                    href={formWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#C28E36] px-6 py-3 text-sm font-semibold text-[#1D100A] transition-colors duration-200 hover:bg-[#DEB05B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Kirim Pesanan ke WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
