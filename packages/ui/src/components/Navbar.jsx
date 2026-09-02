import { cloneElement, useEffect, useState } from 'react';
import { Code2, Mail, Menu, X } from 'lucide-react';

const DEFAULT_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Stack', href: '#stack' },
];

// Longest shared leading substring, e.g. ("Alejandro", "Alex") -> "Ale".
const commonPrefix = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
};

const Navbar = ({
  links = DEFAULT_LINKS,
  logoText = 'BitToByte',
  // Optional: when set, the logo shows this at the top of the page and morphs to
  // `logoText` once the user scrolls (e.g. "Alejandro" -> "Alex").
  logoTextTop = null,
  logoHref = '#top',
  contactHref = '#connect',
  contactLabel = 'Get in Touch',
  // Optional custom logo glyph (a React element). Sized + colored by the Navbar so
  // it matches the tile; defaults to the generic Code2 icon.
  logoIcon = null,
  // Logo-mark styling, so each property can match its own brand hue.
  markClassName = 'bg-blue-600 shadow-lg shadow-blue-500/30',
  markIconClassName = 'text-white',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu once the viewport is wide enough to show the inline
  // links, so the panel can't stay stuck open behind them after a rotate/resize.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const close = () => mq.matches && setMenuOpen(false);
    close();
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, [menuOpen]);

  // Escape closes it, matching the expectation set by aria-expanded.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const iconEl = logoIcon ? (
    cloneElement(logoIcon, {
      className: `h-5 w-5 ${markIconClassName} ${logoIcon.props.className ?? ''}`.trim(),
    })
  ) : (
    <Code2 className={`h-5 w-5 ${markIconClassName}`} />
  );

  const renderLogoText = () => {
    // Scroll-driven name morph: keep the shared prefix static and crossfade the
    // diverging suffix ("jandro" <-> "x"), so "Alejandro" becomes "Alex".
    if (logoTextTop && logoTextTop !== logoText) {
      const prefix = commonPrefix(logoTextTop, logoText);
      const topSuffix = logoTextTop.slice(prefix.length);
      const scrolledSuffix = logoText.slice(prefix.length);
      const widest = topSuffix.length >= scrolledSuffix.length ? topSuffix : scrolledSuffix;
      const fade =
        'absolute left-0 top-0 transition-all duration-300 ease-out motion-reduce:transition-none';
      return (
        <>
          {prefix}
          <span className="relative inline-block whitespace-pre">
            {/* reserve width for the wider suffix so the layout never jumps */}
            <span className="invisible">{widest}</span>
            <span
              className={`${fade} ${scrolled ? 'opacity-0 -translate-y-1 blur-[2px]' : 'opacity-100'}`}
              aria-hidden={scrolled}
            >
              {topSuffix}
            </span>
            <span
              className={`${fade} ${scrolled ? 'opacity-100' : 'translate-y-1 opacity-0 blur-[2px]'}`}
              aria-hidden={!scrolled}
            >
              {scrolledSuffix}
            </span>
          </span>
        </>
      );
    }

    if (logoText === 'BitToByte') {
      return (
        <>
          Bit<span className="text-blue-500">To</span>Byte
        </>
      );
    }

    return logoText;
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-white/5 bg-gray-950/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href={logoHref} className="group flex items-center gap-2.5">
          <span
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${markClassName}`}
          >
            {iconEl}
          </span>
          <span className="text-xl font-bold tracking-tight">{renderLogoText()}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-gray-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Label collapses to the icon below sm: at 360px the logo, this pill and the
              burger together overran the viewport and the label wrapped inside the pill.
              aria-label carries the wording through for the icon-only state. */}
          <a
            href={contactHref}
            aria-label={contactLabel}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm whitespace-nowrap text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white sm:px-4"
          >
            <Mail className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden sm:inline">{contactLabel}</span>
          </a>

          {/* Below md the inline links are hidden, so this is the only way to reach them. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile link panel. Animated with grid-template-rows 0fr <-> 1fr rather than
          max-height, because max-height has to guess a number larger than the content:
          the panel is ~220px tall but the cap was 24rem, so on close the first ~40% of
          the transition moved the cap through empty space and nothing appeared to
          happen for over a tenth of a second. A fr row animates the real content
          height, so both directions respond on the first frame. `overflow-hidden` on
          the inner element is what lets the 0fr row collapse (it drops the automatic
          minimum size to zero). Visibility still flips last so the links leave the tab
          order only once the panel has finished closing. */}
      <div
        id="mobile-nav"
        className={`grid border-t border-white/5 bg-gray-950/95 backdrop-blur-xl md:hidden ${
          menuOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
        }`}
        style={{
          transition: `grid-template-rows 260ms ease-out, opacity 200ms ease-out, visibility 0s linear ${
            menuOpen ? '0s' : '260ms'
          }`,
        }}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 px-6 pb-4 pt-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
