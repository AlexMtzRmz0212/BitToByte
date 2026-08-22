import {
  Reveal,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  FacebookIcon,
} from '@alex_mtz/bittobyte-ui';
import { ArrowUpRight, Mail } from 'lucide-react';

const ACCENT = '#b5f53c';

const EMAIL = 'alejandro.martinez.rmz97@gmail.com';

// Everything below email is a profile, so each card shows the handle rather than
// repeating the network name in the subtitle. The handle is the useful part: it
// tells you where you are about to land before you click.
const SOCIALS = [
  {
    label: 'GitHub',
    handle: '@AlexMtzRmz0212',
    href: 'https://github.com/AlexMtzRmz0212',
    Icon: GithubIcon,
  },
  {
    label: 'LinkedIn',
    handle: '/in/alejandro-mtz',
    href: 'https://linkedin.com/in/alejandro-mtz',
    Icon: LinkedinIcon,
  },
  {
    label: 'Instagram',
    handle: '@alexmtzrmz',
    href: 'https://www.instagram.com/alexmtzrmz/',
    Icon: InstagramIcon,
  },
  {
    label: 'Facebook',
    handle: 'Alejandro.Martinez',
    href: 'https://www.facebook.com/Alejandro.Martinez.1997',
    Icon: FacebookIcon,
  },
];

// One lime spotlight from the top edge, revealed on hover. Kept as a single hue
// rather than a gradient sweep so it reads as the site's accent lighting up,
// not as decoration for its own sake.
const HoverGlow = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    style={{
      background: `radial-gradient(320px circle at 50% 0%, ${ACCENT}1f, transparent 70%)`,
    }}
  />
);

const cardBase =
  'group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b5f53c]/40 hover:bg-white/[0.07]';

const iconTile =
  'flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 transition-colors duration-300 group-hover:border-[#b5f53c]/40 group-hover:text-[#b5f53c]';

const Contact = () => (
  <section id="contact" className="mx-auto max-w-4xl px-6 py-24">
    <Reveal>
      <h2 className="mb-3 text-center text-3xl font-bold">Contact</h2>
    </Reveal>
    <Reveal delay={80}>
      <p className="mx-auto mb-12 max-w-md text-center text-gray-400">
        Email is the fastest way to reach me. Everything else is where I already am.
      </p>
    </Reveal>

    {/* Email gets its own full-width card: it is the one that matters, and the
        address is worth showing rather than hiding behind the word "Email". */}
    <Reveal>
      <a href={`mailto:${EMAIL}`} className={`${cardBase} flex items-center gap-5 p-6`}>
        <HoverGlow />
        <span className={`${iconTile} relative h-14 w-14 shrink-0`}>
          <Mail className="h-6 w-6" aria-hidden="true" />
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="block text-lg font-semibold text-gray-100">Email me</span>
          <span className="mt-0.5 block break-all font-mono text-sm text-gray-400 transition-colors group-hover:text-gray-300">
            {EMAIL}
          </span>
        </span>
        <ArrowUpRight
          className="relative h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b5f53c]"
          aria-hidden="true"
        />
      </a>
    </Reveal>

    <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {SOCIALS.map(({ label, handle, href, Icon }, i) => (
        <Reveal as="li" key={label} delay={100 + i * 70}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardBase} flex h-full flex-col p-5`}
          >
            <HoverGlow />
            <span className="relative flex items-start justify-between">
              <span className={`${iconTile} h-11 w-11`}>
                <Icon className="h-5 w-5" />
              </span>
              <ArrowUpRight
                className="h-4 w-4 text-gray-400 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b5f53c] group-hover:opacity-100"
                aria-hidden="true"
              />
            </span>
            <span className="relative mt-4 block font-semibold text-gray-100">{label}</span>
            <span className="relative mt-0.5 block truncate font-mono text-xs text-gray-400">
              {handle}
            </span>
          </a>
        </Reveal>
      ))}
    </ul>
  </section>
);

export default Contact;
