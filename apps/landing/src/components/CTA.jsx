import { GitBranch, Mail } from 'lucide-react';
import Reveal from './Reveal';

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const CONTACT_LINKS = [
  { label: 'GitHub', href: 'https://github.com/AlexMtzRmz0212', Icon: GitBranch },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alejandro-mtz/', Icon: LinkedinIcon },
  { label: 'Email', href: 'mailto:alejandro.martinez.rmz97@gmail.com', Icon: Mail },
];

const CTA = () => (
  <section id="connect" className="relative mx-auto max-w-7xl px-6 py-24">
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 px-8 py-16 text-center md:px-16 md:py-20">
        {/* glow accents */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-80 rounded-full bg-purple-600/20 blur-[100px]" />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            Have an idea worth{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              building
            </span>
            ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400 md:text-lg">
            From automation pipelines to AI-driven products — let's turn the
            concept into a system that ships.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {CONTACT_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-200 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

export default CTA;
