import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { BUSINESS_INFO, NAV_ITEMS, buildWhatsAppUrl } from '../data/business';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('beranda');

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.3, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const orderHref = buildWhatsAppUrl(
    'Halo MARTABAK BROWNIS, saya ingin memesan Martabak Brownis. Mohon info ketersediaannya ya.'
  );

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#FAF6F0]/10 bg-[#1D100A]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#beranda"
          className="font-display text-lg font-semibold tracking-tight text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors hover:text-[#DEB05B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DEB05B]"
        >
          {BUSINESS_INFO.name}
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DEB05B] ${
                  isActive
                    ? 'text-[#DEB05B]'
                    : 'text-[#DFCBB5] hover:text-[#FAF6F0]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-[#DEB05B] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#C28E36] px-4 py-2 text-sm font-semibold text-[#1D100A] whitespace-nowrap shrink-0 transition-colors duration-200 hover:bg-[#DEB05B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Pesan Sekarang</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#FAF6F0]/15 text-[#FAF6F0] transition-colors hover:bg-[#FAF6F0]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DEB05B] lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Navigasi seluler"
          className="border-t border-[#FAF6F0]/10 bg-[#1D100A] px-5 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={handleNavClick}
                    className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#362015] text-[#DEB05B]'
                        : 'text-[#FAF6F0]/90 hover:bg-[#FAF6F0]/5 hover:text-[#FAF6F0]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-[#FAF6F0]/10 pt-4">
            <a
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#C28E36] px-4 py-2.5 text-sm font-semibold text-[#1D100A] transition-colors hover:bg-[#DEB05B]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Pesan Sekarang via WhatsApp</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
