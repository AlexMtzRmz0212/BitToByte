import { Code2, Cpu } from 'lucide-react';
import { InstagramIcon, FacebookIcon, XIcon } from './BrandIcons';

// The BitToByte family — rendered on every property so all four subdomains
// cross-link to one another. Override via the `familyLinks` prop if needed.
const DEFAULT_FAMILY_LINKS = [
  { label: 'BitToByte', href: 'https://bittobyte.qzz.io' },
  { label: 'Alex — Portfolio', href: 'https://alex.bittobyte.qzz.io' },
  { label: 'Express Entry', href: 'https://EE.bittobyte.qzz.io' },
  { label: 'AI Checklist', href: 'https://checklist.bittobyte.qzz.io' },
];

const Footer = ({
  logoText = 'BitToByte',
  tagline = 'A network of automated systems, AI applications, and data visualizations.',
  instagramUrl = 'https://www.instagram.com/alexmtzrmz/',
  facebookUrl = 'https://www.facebook.com/Alejandro.Martinez.1997',
  xUrl = 'https://x.com/Alex_MtzRmz',
  copyrightName = 'BitToByte Network',
  familyLinks = DEFAULT_FAMILY_LINKS,
}) => (
  <footer className="relative border-t border-white/5">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Code2 className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">{logoText}</span>
          </div>
          <p className="mt-3 max-w-xs text-center text-sm text-gray-500 md:text-left">
            {tagline}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <p className="text-xs uppercase tracking-widest text-gray-600">
            The Network
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
            {familyLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-1 flex items-center justify-center gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-gray-600 transition-colors hover:text-gray-300"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-gray-600 transition-colors hover:text-gray-300"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="text-gray-600 transition-colors hover:text-gray-300"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-gray-500 md:flex-row">
        <p className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-gray-600" />
          &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved.
        </p>
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          All Systems Online
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;