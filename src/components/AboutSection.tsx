import { MapPin } from 'lucide-react';
import { ABOUT_PHOTO, BUSINESS_INFO } from '../data/business';
import { FoodImage } from './FoodImage';
import { Reveal } from './Reveal';

export function AboutSection() {
  return (
    <section id="tentang-kami" className="bg-[#FAF6F0] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Editorial Real Photo */}
            <div className="lg:col-span-5">
              <figure className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-[#E5D8C7] bg-[#F2EAE0]">
                <FoodImage
                  src={ABOUT_PHOTO.src}
                  alt={ABOUT_PHOTO.alt}
                  fallbackLabel="Foto Tekstur Martabak Brownis"
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>

            {/* Brand Story */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <p className="text-sm font-medium text-[#9E6F20]">
                Tentang Kami · Cerita Usaha
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#24150E] sm:text-4xl [text-wrap:balance]">
                Perpaduan Lembut Martabak dan Cokelat Khas Brownis
              </h2>

              <div className="mt-6 space-y-5 text-base leading-relaxed text-[#4F3121] sm:text-[17px]">
                <p>
                  Martabak Brownis merupakan usaha kuliner yang menghadirkan
                  makanan manis dengan perpaduan tekstur martabak yang lembut dan
                  rasa cokelat khas brownis.
                </p>
                <p>
                  Usaha ini hadir untuk memberikan pilihan camilan yang lezat,
                  praktis, memiliki banyak pilihan topping, dan harga terjangkau.
                </p>
              </div>

              {/* Clean Hairline Info Strip */}
              <div className="mt-9 grid grid-cols-1 gap-6 border-t border-[#E5D8C7] pt-7 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-[#6B4631]">
                    Jenis Usaha
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#24150E]">
                    {BUSINESS_INFO.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#6B4631]">
                    Lokasi Usaha
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#24150E]">
                    <MapPin
                      className="h-3.5 w-3.5 text-[#9E6F20]"
                      aria-hidden="true"
                    />
                    <span>{BUSINESS_INFO.location}</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#6B4631]">
                    Rentang Harga
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#24150E] tabular-nums">
                    Rp15.000 – Rp25.000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
