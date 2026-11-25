import { Briefcase, Calendar, Heart, Users } from 'lucide-react';
import { TARGET_MARKET, type TargetSegment } from '../data/business';
import { Reveal } from './Reveal';

const TARGET_ICONS: Record<TargetSegment['icon'], typeof Users> = {
  calendar: Calendar,
  users: Users,
  briefcase: Briefcase,
  heart: Heart,
};

export function TargetMarketSection() {
  return (
    <section
      id="target-pasar"
      className="border-t border-[#E5D8C7] bg-[#FAF6F0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9E6F20]">
              Target Pasar · Segmentasi Pelanggan
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#24150E] sm:text-4xl [text-wrap:balance]">
              Hadir untuk Berbagai Kalangan Pecinta Camilan Manis
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#5C4030]">
              Dengan pilihan rasa beragam dan harga yang ramah, MARTABAK BROWNIS
              dirancang untuk dinikmati mulai dari pelajar hingga masyarakat
              umum di Banda Aceh.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TARGET_MARKET.map((segment, idx) => {
            const Icon = TARGET_ICONS[segment.icon];
            return (
              <Reveal key={segment.id} delay={idx * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-[#E5D8C7] bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2EAE0] text-[#9E6F20]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <p className="mt-5 text-xs font-semibold text-[#6B4631]">
                    {segment.label}
                  </p>

                  <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-[#24150E]">
                    {segment.value}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#5C4030]">
                    {segment.detail}
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
