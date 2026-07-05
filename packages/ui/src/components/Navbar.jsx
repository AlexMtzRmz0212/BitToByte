import { useEffect, useState } from 'react';
import { Code2, Mail } from 'lucide-react';

const DEFAULT_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Stack', href: '#stack' },
];

const Navbar = ({
  links = DEFAULT_LINKS,
  logoText = 'BitToByte',
  logoHref = '#top',
  contactHref = '#connect',
  contactLabel = 'Get in Touch',
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
            <Code2 className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            {logoText === 'BitToByte' ? (
              <>
                Bit<span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">To</span>Byte
              </>
            ) : (
              logoText
            )}
          </span>
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