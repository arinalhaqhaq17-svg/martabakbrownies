import { Cookie, Flame, Layers, ShieldCheck, Tag } from 'lucide-react';
import { PRODUCT_FEATURES, type ProductFeature } from '../data/business';
import { Reveal } from './Reveal';

const FEATURE_ICONS: Record<ProductFeature['icon'], typeof Layers> = {
  layers: Layers,
  flame: Flame,
  cookie: Cookie,
  tag: Tag,
  shield: ShieldCheck,
};

export function FeaturesSection() {
  return (
    <section
      id="keunggulan"
      className="border-t border-[#E5D8C7] bg-[#F2EAE0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9E6F20]">
              Keunggulan Produk · Standar Kualitas
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#24150E] sm:text-4xl [text-wrap:balance]">
              Mengapa Memilih Martabak Brownis?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#5C4030]">
              Setiap loyang dibuat dengan ketelitian agar tekstur, aroma
              cokelat, dan limpahan topping selalu terasa konsisten di setiap
              gigitan.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <Reveal key={feature.id} delay={index * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-[#E5D8C7] bg-[#FAF6F0] p-7 transition-colors duration-200 hover:border-[#C28E36]/60">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#24150E] text-[#DEB05B]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-semibold text-[#8B6046] tabular-nums">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold text-[#24150E]">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#5C4030]">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
