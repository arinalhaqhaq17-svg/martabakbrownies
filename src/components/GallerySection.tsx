import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/business';
import { FoodImage } from './FoodImage';
import { Reveal } from './Reveal';

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedItem =
    selectedIndex !== null ? GALLERY_ITEMS[selectedIndex] : null;

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      } else if (event.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_ITEMS.length
        );
      } else if (event.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  const showPrev = () => {
    setSelectedIndex((prev) =>
      prev === null
        ? null
        : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
    );
  };

  const showNext = () => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev + 1) % GALLERY_ITEMS.length
    );
  };

  return (
    <section
      id="galeri"
      className="border-t border-[#E5D8C7] bg-[#FAF6F0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#9E6F20]">
                Galeri Produk · Fotografi Makanan Asli
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#24150E] sm:text-4xl [text-wrap:balance]">
                Tampilan Asli Kelezatan Martabak Brownis
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#5C4030]">
                Klik pada foto mana pun untuk memperbesar detail tekstur lembut,
                lelehan cokelat, dan taburan topping.
              </p>
            </div>
            <p className="text-xs text-[#6B4631] tabular-nums">
              {GALLERY_ITEMS.length} Foto Asli · Klik untuk memperbesar
            </p>
          </div>
        </Reveal>

        {/* Modern Editorial Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {GALLERY_ITEMS.map((item, idx) => (
            <Reveal
              key={item.id}
              delay={idx * 0.04}
              className={item.spanClass ?? ''}
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`Perbesar foto ${item.title}`}
                className="group relative block h-72 w-full overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#24150E] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E6F20] sm:h-80"
              >
                <FoodImage
                  src={item.image}
                  alt={item.alt}
                  fallbackLabel={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />

                {/* Measured scrim for crisp WCAG AA caption contrast */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1D100A]/85 via-[#1D100A]/25 to-transparent opacity-90 transition-opacity duration-200 group-hover:opacity-100"
                />

                {/* Top-right expand icon on hover/focus */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D100A]/75 text-[#FAF6F0] opacity-85 backdrop-blur-xs transition-all duration-200 group-hover:bg-[#C28E36] group-hover:text-[#1D100A] group-hover:opacity-100"
                >
                  <Expand className="h-4 w-4" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-medium text-[#DEB05B]">
                    {item.category}
                  </p>
                  <h3 className="mt-0.5 font-display text-lg font-semibold text-[#FAF6F0]">
                    {item.title}
                  </h3>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#6B4631]">
          Catatan media: Seluruh gambar di atas menggunakan fotografi makanan
          asli (non-AI) berlisensi terbuka dan dapat diganti kapan saja dengan
          foto produk milik sendiri melalui folder{' '}
          <span className="font-medium text-[#24150E]">src/assets/photos/</span>.
        </p>
      </div>

      {/* Lightbox Modal */}
      {selectedItem !== null && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tampilan diperbesar: ${selectedItem.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D100A]/92 p-4 backdrop-blur-xs sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#FAF6F0]/15 bg-[#24150E]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-[#FAF6F0]/10 px-5 py-3.5 text-sm text-[#DFCBB5]">
              <span className="tabular-nums">
                Foto {selectedIndex + 1} / {GALLERY_ITEMS.length} ·{' '}
                {selectedItem.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Tutup tampilan foto"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#FAF6F0] transition-colors hover:bg-[#FAF6F0]/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Image Stage */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#1D100A]">
              <FoodImage
                src={selectedItem.image}
                alt={selectedItem.alt}
                fallbackLabel={selectedItem.title}
                loading="eager"
                className="max-h-[64vh] w-full object-contain"
              />

              <button
                type="button"
                onClick={showPrev}
                aria-label="Foto sebelumnya"
                className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1D100A]/80 text-[#FAF6F0] border border-[#FAF6F0]/15 transition-colors hover:bg-[#C28E36] hover:text-[#1D100A]"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Foto berikutnya"
                className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1D100A]/80 text-[#FAF6F0] border border-[#FAF6F0]/15 transition-colors hover:bg-[#C28E36] hover:text-[#1D100A]"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Caption Bar */}
            <div className="border-t border-[#FAF6F0]/10 px-6 py-4">
              <h3 className="font-display text-lg font-semibold text-[#FAF6F0]">
                {selectedItem.title}
              </h3>
              <p className="mt-1 text-sm text-[#DFCBB5]">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
