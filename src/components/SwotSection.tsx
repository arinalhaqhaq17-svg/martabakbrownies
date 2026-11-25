import {
  AlertTriangle,
  Compass,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { SWOT_DATA, type SwotCardData } from '../data/business';
import { Reveal } from './Reveal';

const SWOT_STYLE_MAP: Record<
  SwotCardData['tone'],
  {
    icon: typeof TrendingUp;
    iconBoxClass: string;
    labelClass: string;
  }
> = {
  strength: {
    icon: TrendingUp,
    iconBoxClass: 'bg-[#24150E] text-[#DEB05B]',
    labelClass: 'text-[#24150E]',
  },
  weakness: {
    icon: AlertTriangle,
    iconBoxClass: 'bg-[#4F3121] text-[#FAF6F0]',
    labelClass: 'text-[#4F3121]',
  },
  opportunity: {
    icon: Compass,
    iconBoxClass: 'bg-[#9E6F20] text-[#FAF6F0]',
    labelClass: 'text-[#9E6F20]',
  },
  threat: {
    icon: ShieldAlert,
    iconBoxClass: 'bg-[#6B4631] text-[#FAF6F0]',
    labelClass: 'text-[#6B4631]',
  },
};

export function SwotSection() {
  return (
    <section
      id="swot"
      className="border-t border-[#E5D8C7] bg-[#F2EAE0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9E6F20]">
              Strategi Usaha · Analisis SWOT
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#24150E] sm:text-4xl [text-wrap:balance]">
              Pemetaan Kekuatan, Tantangan, dan Peluang Usaha
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#5C4030]">
              Landasan pengembangan MARTABAK BROWNIS dalam menjaga kualitas
              produk, memperluas pemasaran digital, dan menghadapi dinamika
              pasar kuliner.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SWOT_DATA.map((card, idx) => {
            const style = SWOT_STYLE_MAP[card.tone];
            const Icon = style.icon;
            return (
              <Reveal key={card.key} delay={idx * 0.05}>
                <article className="flex h-full flex-col rounded-2xl border border-[#E5D8C7] bg-[#FAF6F0] p-7 sm:p-8">
                  <div className="flex items-center justify-between gap-4 border-b border-[#E5D8C7] pb-5">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${style.iconBoxClass}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-tight text-[#24150E]">
                          {card.title}
                        </h3>
                        <p
                          className={`text-xs font-semibold ${style.labelClass}`}
                        >
                          {card.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="font-display text-2xl font-semibold text-[#C28E36]/60">
                      {card.key}
                    </span>
                  </div>

                  <ul className="mt-6 space-y-3.5">
                    {card.points.map((point, pointIdx) => (
                      <li
                        key={point}
                        className="flex items-baseline gap-3 text-sm leading-relaxed text-[#4F3121] sm:text-[15px]"
                      >
                        <span className="text-xs font-semibold text-[#9E6F20] tabular-nums shrink-0">
                          0{pointIdx + 1}.
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
