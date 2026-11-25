import { ArrowDownRight, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, HERO_PHOTO, buildWhatsAppUrl } from '../data/business';
import { FoodImage } from './FoodImage';

export function HeroSection() {
  const orderHref = buildWhatsAppUrl(
    'Halo MARTABAK BROWNIS, saya tertarik memesan Martabak Brownis. Boleh lihat daftar menu yang tersedia hari ini?'
  );

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-[#22130C] text-[#FAF6F0]"
    >
      {/* Subtle warm cacao ambient highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-[#C28E36]/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <div className="flex flex-col justify-between lg:col-span-6 lg:py-4">
            <div>
              <p className="text-sm font-medium tracking-wide text-[#DFCBB5]">
                <span>{BUSINESS_INFO.location}</span>
                <span aria-hidden="true" className="mx-2 text-[#DEB05B]">
                  ·
                </span>
                <span>{BUSINESS_INFO.category}</span>
              </p>

              <h1 className="mt-5 font-display text-[clamp(2.5rem,4.6vw,4.15rem)] font-semibold leading-[1.06] tracking-tight text-[#FAF6F0] [text-wrap:balance]">
                {BUSINESS_INFO.name}
              </h1>

              <p className="mt-4 font-display text-xl italic text-[#DEB05B] sm:text-2xl [text-wrap:balance]">
                “{BUSINESS_INFO.tagline}.”
              </p>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#DFCBB5] sm:text-[17px]">
                Perpaduan istimewa antara kelembutan martabak manis dan cita rasa
                cokelat khas brownis yang pekat. Tersedia dalam beragam pilihan
                topping melimpah dengan harga terjangkau untuk menemani setiap
                momen santai Anda di Banda Aceh.
              </p>

              {/* Action Controls */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={orderHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-[#C28E36] px-6 py-3 text-sm font-semibold text-[#1D100A] whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-[#DEB05B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Pesan Sekarang</span>
                </a>

                <a
                  href="#menu"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[#FAF6F0]/25 bg-transparent px-6 py-3 text-sm font-medium text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-200 hover:border-[#DEB05B] hover:text-[#DEB05B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
                >
                  <span>Lihat Menu</span>
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Quiet Fact Row */}
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-[#FAF6F0]/12 pt-7">
              <div>
                <dt className="text-xs font-medium text-[#DFCBB5]/75">
                  Harga Mulai
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-[#FAF6F0] tabular-nums sm:text-2xl">
                  Rp15.000
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#DFCBB5]/75">
                  Pilihan Menu
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-[#FAF6F0] tabular-nums sm:text-2xl">
                  5 Varian
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#DFCBB5]/75">
                  Lokasi Usaha
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold text-[#FAF6F0] sm:text-2xl">
                  Banda Aceh
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Large Real Food Photography Column */}
          <div className="lg:col-span-6">
            <figure className="relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-[#FAF6F0]/12 bg-[#1D100A] sm:min-h-[440px]">
              <FoodImage
                src={HERO_PHOTO.src}
                alt={HERO_PHOTO.alt}
                fallbackLabel="Foto Utama Martabak Brownis"
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1D100A]/85 via-[#1D100A]/40 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-medium text-[#DEB05B]">
                    Sajian Unggulan
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#FAF6F0]">
                    {HERO_PHOTO.caption}
                  </p>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
