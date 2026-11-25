import { BUSINESS_INFO, NAV_ITEMS } from '../data/business';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#FAF6F0]/10 bg-[#180D08] text-[#DFCBB5]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <a
              href="#beranda"
              className="font-display text-xl font-semibold tracking-tight text-[#FAF6F0]"
            >
              {BUSINESS_INFO.name}
            </a>
            <p className="mt-1.5 text-sm text-[#DFCBB5]/80">
              {BUSINESS_INFO.tagline} · {BUSINESS_INFO.location}
            </p>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-[#DFCBB5]/80 transition-colors hover:text-[#DEB05B]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-[#FAF6F0]/10 pt-6 text-xs text-[#DFCBB5]/65 sm:flex-row sm:items-center">
          <p>
            © {year} {BUSINESS_INFO.name}. Seluruh hak cipta dilindungi.
          </p>
          <p>
            Usaha Kuliner UMKM · {BUSINESS_INFO.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
