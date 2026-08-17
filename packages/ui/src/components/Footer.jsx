import { Code2, Cpu } from 'lucide-react';
import { InstagramIcon, FacebookIcon, XIcon } from './BrandIcons';
import { openConsentSettings } from './consent';

// The BitToByte family, rendered on every property so all four subdomains
// cross-link to one another. Override via the `familyLinks` prop if needed.
const DEFAULT_FAMILY_LINKS = [
  { label: 'BitToByte', href: 'https://bittobyte.qzz.io' },
  { label: 'Alex · Portfolio', href: 'https://alex.bittobyte.qzz.io' },
  { label: 'Express Entry', href: 'https://EE.bittobyte.qzz.io' },
  { label: 'AI Checklist', href: 'https://checklist.bittobyte.qzz.io' },
];

// Legal links, canonical to the main domain so every subdomain points at one policy.
const DEFAULT_LEGAL_LINKS = [
  { label: 'Terms of Service', href: 'https://bittobyte.qzz.io/terms.html' },
  { label: 'Privacy Policy', href: 'https://bittobyte.qzz.io/privacy.html' },
];

// Default "personal" socials. Pass a `socials` prop to override, e.g. the landing
// page passes professional profiles (GitHub / LinkedIn). Each item: { label, href, Icon }.
const DEFAULT_SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/alexmtzrmz/', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/Alejandro.Martinez.1997', Icon: FacebookIcon },
  { label: 'X', href: 'https://x.com/Alex_MtzRmz', Icon: XIcon },
];

const Footer = ({
  logoText = 'BitToByte',
  tagline = 'A network of automated systems, AI applications, and data visualizations.',
  socials = DEFAULT_SOCIALS,
  copyrightName = 'BitToByte Network',
  familyLinks = DEFAULT_FAMILY_LINKS,
  legalLinks = DEFAULT_LEGAL_LINKS,
  // Opt-in: only sites that actually render <CookieConsent /> should offer this,
  // otherwise the link would clear a key nothing listens to. Withdrawing consent
  // has to be as easy as giving it, so any site with analytics should set it.
  showCookieSettings = false,
  // Logo-mark styling, so each property can match its own brand hue.
  markClassName = 'bg-blue-600',
  markIconClassName = 'text-white',
}) => (
  <footer className="relative border-t border-white/5">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2.5">
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${markClassName}`}>
              <Code2 className={`h-4 w-4 ${markIconClassName}`} />
            </span>
            <span className="text-lg font-bold tracking-tight">{logoText}</span>
          </div>
          <p className="mt-3 max-w-xs text-center text-sm text-gray-400 md:text-left">
            {tagline}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 md:items-end">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            The Network
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
            {familyLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-1 flex items-center justify-center gap-4">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-gray-400 transition-colors hover:text-gray-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-gray-400 md:flex-row">
        <p className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-gray-400" />
          &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          {showCookieSettings && (
            <button
              type="button"
              onClick={openConsentSettings}
              className="transition-colors hover:text-white"
            >
              Cookie settings
            </button>
          )}
        </nav>
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
