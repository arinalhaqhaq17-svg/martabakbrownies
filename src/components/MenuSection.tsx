import { useMemo, useState } from 'react';
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import {
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
  buildWhatsAppUrl,
  formatRupiah,
} from '../data/business';
import { FoodImage } from './FoodImage';
import { Reveal } from './Reveal';

const CATEGORY_TABS: { id: MenuCategory; label: string }[] = [
  { id: 'semua', label: 'Semua Varian' },
  { id: 'klasik', label: 'Varian Klasik' },
  { id: 'spesial', label: 'Varian Spesial' },
];

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('semua');
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>(
    {}
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'semua') return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const cartEntries = useMemo(() => {
    return MENU_ITEMS.filter((item) => (orderQuantities[item.id] ?? 0) > 0).map(
      (item) => ({
        item,
        qty: orderQuantities[item.id] ?? 0,
      })
    );
  }, [orderQuantities]);

  const totalItems = useMemo(
    () => cartEntries.reduce((sum, entry) => sum + entry.qty, 0),
    [cartEntries]
  );

  const totalPrice = useMemo(
    () =>
      cartEntries.reduce(
        (sum, entry) => sum + entry.item.price * entry.qty,
        0
      ),
    [cartEntries]
  );

  const incrementItem = (id: string) => {
    setOrderQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const decrementItem = (id: string) => {
    setOrderQuantities((prev) => {
      const nextQty = (prev[id] ?? 0) - 1;
      if (nextQty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const clearOrder = () => {
    setOrderQuantities({});
  };

  const buildSingleItemOrderHref = (item: MenuItem) => {
    return buildWhatsAppUrl(
      `Halo MARTABAK BROWNIS, saya ingin memesan:\n- ${item.name} (${item.priceFormatted}) x 1\n\nMohon konfirmasi ketersediaannya ya. Terima kasih.`
    );
  };

  const buildMultiOrderHref = () => {
    const lines = cartEntries.map(
      ({ item, qty }) =>
        `- ${item.name} (${item.priceFormatted}) x ${qty} = ${formatRupiah(
          item.price * qty
        )}`
    );
    return buildWhatsAppUrl(
      `Halo MARTABAK BROWNIS, saya ingin memesan:\n${lines.join(
        '\n'
      )}\n\nPerkiraan Total: ${formatRupiah(
        totalPrice
      )}\n\nMohon konfirmasi pesanan saya ya. Terima kasih.`
    );
  };

  return (
    <section
      id="menu"
      className="border-t border-[#E5D8C7] bg-[#FAF6F0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#9E6F20]">
                Menu Produk · Pilihan Rasa
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#24150E] sm:text-4xl [text-wrap:balance]">
                Varian Martabak Brownis untuk Setiap Selera
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#5C4030]">
                Pilih langsung varian favorit Anda untuk pesan cepat via
                WhatsApp, atau kumpulkan beberapa varian sekaligus dalam daftar
                pesanan.
              </p>
            </div>

            {/* Interactive Category Filter + Order Summary Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="tablist"
                aria-label="Filter kategori menu"
                className="inline-flex items-center gap-1 rounded-lg border border-[#E5D8C7] bg-[#F2EAE0] p-1"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`min-h-[38px] rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20] ${
                        active
                          ? 'bg-[#24150E] text-[#FAF6F0]'
                          : 'text-[#5C4030] hover:text-[#24150E]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-[#24150E]/20 bg-white px-4 py-2 text-xs font-semibold text-[#24150E] whitespace-nowrap shrink-0 transition-colors hover:border-[#9E6F20] hover:text-[#9E6F20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20]"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Daftar Pesanan</span>
                <span className="tabular-nums font-bold text-[#9E6F20]">
                  ({totalItems})
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Product Grid */}
        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => {
            const qtyInCart = orderQuantities[item.id] ?? 0;
            return (
              <Reveal key={item.id} delay={idx * 0.05}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5D8C7] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#C28E36]/60 hover:shadow-[0_14px_30px_-14px_rgba(36,21,14,0.18)]">
                  {/* Uniform 4:3 Real Food Photo */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EAE0]">
                    <FoodImage
                      src={item.image}
                      alt={item.imageAlt}
                      fallbackLabel={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Unboxed Metadata Line */}
                    <div className="flex items-center gap-2 text-xs font-medium text-[#6B4631]">
                      <span>{item.categoryLabel}</span>
                      {item.highlight && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#9E6F20]">
                            {item.highlight}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold text-[#24150E]">
                        {item.name}
                      </h3>
                      <p className="text-base font-bold text-[#9E6F20] tabular-nums whitespace-nowrap shrink-0">
                        {item.priceFormatted}
                      </p>
                    </div>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5C4030]">
                      {item.description}
                    </p>

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-2.5 border-t border-[#F2EAE0] pt-5">
                      <a
                        href={buildSingleItemOrderHref(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#24150E] px-4 py-2 text-xs font-semibold text-[#FAF6F0] whitespace-nowrap transition-colors duration-200 hover:bg-[#362015] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20]"
                      >
                        <MessageCircle
                          className="h-3.5 w-3.5 text-[#DEB05B]"
                          aria-hidden="true"
                        />
                        <span>Pesan Sekarang</span>
                      </a>

                      {qtyInCart === 0 ? (
                        <button
                          type="button"
                          onClick={() => incrementItem(item.id)}
                          aria-label={`Tambah ${item.name} ke daftar pesanan`}
                          className="inline-flex min-h-[42px] items-center justify-center gap-1 rounded-lg border border-[#E5D8C7] bg-[#FAF6F0] px-3 py-2 text-xs font-semibold text-[#24150E] whitespace-nowrap shrink-0 transition-colors hover:border-[#9E6F20] hover:text-[#9E6F20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Tambah</span>
                        </button>
                      ) : (
                        <div className="inline-flex min-h-[42px] items-center rounded-lg border border-[#C28E36] bg-[#FAF6F0] px-1">
                          <button
                            type="button"
                            onClick={() => decrementItem(item.id)}
                            aria-label={`Kurangi jumlah ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#24150E] transition-colors hover:bg-[#E5D8C7]/60"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="min-w-[26px] text-center text-xs font-bold text-[#24150E] tabular-nums">
                            {qtyInCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => incrementItem(item.id)}
                            aria-label={`Tambah jumlah ${item.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-[#24150E] transition-colors hover:bg-[#E5D8C7]/60"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Order Drawer for Multi-Item WhatsApp Checkout */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Daftar Pesanan Martabak Brownis"
          className="fixed inset-0 z-50 flex justify-end bg-[#1D100A]/60 backdrop-blur-xs"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-[#FAF6F0] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5D8C7] px-6 py-5">
              <div>
                <h3 className="font-display text-xl font-semibold text-[#24150E]">
                  Daftar Pesanan
                </h3>
                <p className="mt-0.5 text-xs text-[#6B4631]">
                  Kirim rincian pesanan sekaligus ke WhatsApp
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup daftar pesanan"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5D8C7] text-[#24150E] transition-colors hover:bg-[#F2EAE0]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartEntries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2EAE0] text-[#6B4631]">
                    <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-display text-lg font-medium text-[#24150E]">
                    Belum ada menu dipilih
                  </p>
                  <p className="mt-1.5 max-w-xs text-sm text-[#6B4631]">
                    Tekan tombol Tambah pada kartu menu untuk menyusun beberapa
                    varian pesanan sekaligus.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#E5D8C7]">
                  {cartEntries.map(({ item, qty }) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-display text-base font-semibold text-[#24150E]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#6B4631] tabular-nums">
                          {item.priceFormatted} × {qty} ={' '}
                          <span className="font-semibold text-[#24150E]">
                            {formatRupiah(item.price * qty)}
                          </span>
                        </p>
                      </div>

                      <div className="inline-flex items-center rounded-lg border border-[#E5D8C7] bg-white p-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          aria-label={`Kurangi ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[#24150E] hover:bg-[#F2EAE0]"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="min-w-[24px] text-center text-xs font-bold tabular-nums text-[#24150E]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.id)}
                          aria-label={`Tambah ${item.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-[#24150E] hover:bg-[#F2EAE0]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartEntries.length > 0 && (
              <div className="border-t border-[#E5D8C7] bg-white px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5C4030]">
                    Total ({totalItems} porsi)
                  </span>
                  <span className="font-display text-xl font-semibold text-[#24150E] tabular-nums">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={clearOrder}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-[#E5D8C7] px-3.5 py-2 text-xs font-semibold text-[#6B4631] transition-colors hover:bg-[#F2EAE0] hover:text-[#24150E]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span>Hapus</span>
                  </button>
                  <a
                    href={buildMultiOrderHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#24150E] px-4 py-2 text-sm font-semibold text-[#FAF6F0] transition-colors hover:bg-[#362015]"
                  >
                    <MessageCircle
                      className="h-4 w-4 text-[#DEB05B]"
                      aria-hidden="true"
                    />
                    <span>Kirim via WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
