import { cloneElement, useEffect, useState } from 'react';
import { Code2, Mail } from 'lucide-react';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const iconEl = logoIcon
    ? cloneElement(logoIcon, {
        className: `h-5 w-5 ${markIconClassName} ${logoIcon.props.className ?? ''}`.trim(),
      })
    : <Code2 className={`h-5 w-5 ${markIconClassName}`} />;

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
        scrolled
          ? 'border-b border-white/5 bg-gray-950/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href={logoHref} className="group flex items-center gap-2.5">
          <span className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${markClassName}`}>
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

        <a
          href={contactHref}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Mail className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          {contactLabel}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
