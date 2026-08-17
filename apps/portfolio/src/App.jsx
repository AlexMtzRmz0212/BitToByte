// src/App.jsx
import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  Background,
  Navbar,
  Footer,
  CookieConsent,
  getStoredConsent,
  Reveal,
  AlexMark,
} from '@alex_mtz/bittobyte-ui';
import {
  Terminal,
  Activity,
  Database,
  Map,
  CalendarDays,
  BarChart3,
  Zap,
  Boxes,
  ChevronDown,
} from 'lucide-react';
import { projects } from '@bittobyte/content';
import ThemeSlider from './components/ThemeSlider';
import { getStoredThemeLevel, storeThemeLevel, levelToStrength, levelToSpread, DEFAULT_LEVEL } from './lib/theme';

const PROFILE_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'BitToByte', href: 'https://bittobyte.qzz.io' },
];

// Map the shared icon keys to lucide components.
const ICONS = {
  terminal: Terminal,
  activity: Activity,
  database: Database,
  map: Map,
  calendar: CalendarDays,
  chart: BarChart3,
  zap: Zap,
};

// Bento mosaic: per-project tile spans (lg only; cards stack cleanly below that).
// Sizes are chosen so each section tiles with no gaps: the featured block fills a
// 3×2 grid (East Coast EV is the 2×2 hero), and "more" fills two 3-wide rows.
const SPANS = {
  // Featured work
  'eastcoast-ev': 'lg:col-span-2 lg:row-span-2',
  'express-entry': 'lg:col-span-1',
  'daily-checklist': 'lg:col-span-1',
  // More projects
  'sports-hub': 'lg:col-span-1',
  'sports-maps': 'lg:col-span-2',
  'mcu-timeline': 'lg:col-span-1',
  'habits-analysis': 'lg:col-span-2',
};

const linkBtn =
  'rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white';

const CardShell = ({ project, children }) => {
  const Icon = ICONS[project.icon] ?? Boxes;
  const span = SPANS[project.id] ?? 'lg:col-span-1';
  const isHero = span.includes('row-span-2');
  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 ${span}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex items-center justify-center rounded-lg border border-white/10 bg-white/5 ${
            isHero ? 'h-12 w-12' : 'h-10 w-10'
          }`}
          style={{ color: project.accent }}
        >
          <Icon className={isHero ? 'h-6 w-6' : 'h-5 w-5'} />
        </span>
        {/* h4: these sit under the "Featured work" / "More projects" h3 group labels */}
        <h4 className={`font-semibold ${isHero ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {project.name}
        </h4>
      </div>
      <p className={`flex-grow text-gray-400 ${isHero ? 'text-base md:max-w-md' : 'text-sm'}`}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
};

const ProjectCard = ({ project }) => (
  <CardShell project={project}>
    <div className="mt-auto flex gap-3">
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={linkBtn}>
          Live Demo
        </a>
      )}
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noreferrer" className={linkBtn}>
          GitHub
        </a>
      )}
    </div>
  </CardShell>
);

// Special interactive card for the "Divisions & Leagues Maps" project: pick a
// sport and jump to that league's live map + repo.
const SportsMapsCard = ({ project }) => {
  const [sport, setSport] = useState('mlb');

  const sports = {
    mlb: {
      icon: 'https://www.mlbstatic.com/team-logos/league-on-dark/1.svg',
      demo: 'https://alexmtzrmz0212.github.io/MLB/',
      github: 'https://github.com/AlexMtzRmz0212/MLB',
      disabled: false,
    },
    nfl: {
      icon: 'https://static.www.nfl.com/image/upload/v1554321393/league/nvfr7ogywskqrfaiu38m.svg',
      demo: 'https://alexmtzrmz0212.github.io/NFL/',
      github: 'https://github.com/AlexMtzRmz0212/NFL',
      disabled: false,
    },
    nba: { icon: 'https://cdn.nba.com/logos/leagues/logo-nba.svg', disabled: true },
    nhl: {
      icon: 'https://media.d3.nhle.com/image/private/t_q-best/prd/assets/nhl/logos/nhl_shield_wm_on_dark_fqkbph',
      disabled: true,
    },
  };

  const current = sports[sport];

  return (
    <CardShell project={project}>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="sports-maps-sport" className="text-sm text-gray-400">
          Sport:
        </label>
        <select
          id="sports-maps-sport"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="rounded-md border border-white/10 bg-gray-900 px-3 py-1.5 text-sm text-gray-300"
        >
          <option value="mlb">MLB</option>
          <option value="nfl">NFL</option>
          <option value="nba">NBA</option>
          <option value="nhl">NHL</option>
        </select>
        <img
          src={current.icon}
          alt={`${sport.toUpperCase()} league logo`}
          className="h-8 w-auto max-w-[7rem] object-contain"
        />
      </div>
      <div className="mt-auto flex gap-3">
        {current.disabled ? (
          <>
            <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-400">
              Demo (Soon)
            </span>
            <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-400">
              GitHub (Soon)
            </span>
          </>
        ) : (
          <>
            <a href={current.demo} target="_blank" rel="noreferrer" className={linkBtn}>
              Live Demo
            </a>
            <a href={current.github} target="_blank" rel="noreferrer" className={linkBtn}>
              GitHub
            </a>
          </>
        )}
      </div>
    </CardShell>
  );
};

const renderCard = (project) =>
  project.id === 'sports-maps' ? (
    <SportsMapsCard key={project.id} project={project} />
  ) : (
    <ProjectCard key={project.id} project={project} />
  );

// ---------- About Me showcase ----------

// Looping ribbon of the stack; duplicated inline for a seamless marquee.
const TECH = [
  'Python', 'SQL', 'TensorFlow', 'PyTorch', 'PLCs', 'SCADA',
  'React', 'Node.js', 'Docker', 'Pandas', 'Git', 'Linux',
];

// Headline capabilities shown as chips.
const SKILLS = [
  'SCADA Systems', 'Machine Learning', 'Industrial Automation',
  'Data Pipelines', 'Full-Stack Apps',
];

// Engineer-flavored "about" card styled like a code editor.
const TerminalCard = () => (
  <div className="overflow-hidden rounded-xl border border-white/10 bg-gray-900/70 shadow-2xl shadow-black/40 backdrop-blur">
    <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-400/80" />
      <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
      <span className="h-3 w-3 rounded-full bg-green-400/80" />
      <span className="ml-3 font-mono text-xs text-gray-400">alex@bittobyte: ~/whoami</span>
    </div>
    <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-gray-300">
<span className="text-purple-400">const</span> <span className="text-[#b5f53c]">alex</span> <span className="text-gray-400">=</span> {'{'}
{'\n'}  <span className="text-sky-300">role</span>: <span className="text-amber-300">&quot;AI &amp; Automation Engineer&quot;</span>,
{'\n'}  <span className="text-sky-300">stack</span>: [<span className="text-amber-300">&quot;Python&quot;</span>, <span className="text-amber-300">&quot;SQL&quot;</span>, <span className="text-amber-300">&quot;TensorFlow&quot;</span>, <span className="text-amber-300">&quot;PLCs&quot;</span>],
{'\n'}  <span className="text-sky-300">languages</span>: [<span className="text-amber-300">&quot;EN&quot;</span>, <span className="text-amber-300">&quot;ES&quot;</span>, <span className="text-amber-300">&quot;FR*&quot;</span>, <span className="text-amber-300">&quot;DE*&quot;</span>], <span className="text-gray-400">// *in progress</span>
{'\n'}  <span className="text-sky-300">superpower</span>: <span className="text-amber-300">&quot;efficiency&quot;</span>,
{'\n'}  <span className="text-sky-300">fuel</span>: <span className="text-amber-300">&quot;coffee&quot;</span>,
{'\n'}{'}'};
{'\n'}<span className="text-gray-400">{'>'}</span> <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-[#b5f53c]" />
    </pre>
  </div>
);

const AboutMe = () => (
  <section id="about" className="mx-auto max-w-6xl px-6 pt-10 pb-24 md:pt-16">
    <Reveal>
      <h2 className="mb-3 text-center text-3xl font-bold">About Me</h2>
    </Reveal>
    <Reveal delay={80}>
      <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
        The short version: an engineer who turns &quot;this takes forever&quot; into &quot;done
        already?&quot;
      </p>
    </Reveal>

    {/* min-w-0 on both columns: a grid item's `min-width: auto` is its content-based
        minimum, and the terminal card's <pre> (white-space: pre) reports its longest
        line as that minimum. Without this the track is forced past the viewport on
        mobile and the whole page scrolls sideways; with it the <pre> scrolls itself. */}
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-4 leading-relaxed text-gray-400">
        <Reveal as="p">
          I&apos;m Alex. Engineer, coder, and genius (still working on the billionaire, playboy,
          philanthropist part). Basically the guy you call when your automation stops automating. I
          build <span className="text-[#b5f53c]">SCADA systems</span>, train my AIs like they&apos;re
          my pets, and design tools that make slow work fast. Python, SQL, TensorFlow, PLCs. Yeah, I
          speak fluent machine.
        </Reveal>
        <Reveal as="p" delay={80}>
          Human languages? English and Spanish are a given. French and German are the bonus DLC
          I&apos;m currently unlocking.
        </Reveal>
        <Reveal as="p" delay={160}>
          When I&apos;m not making machines smarter, I&apos;m automating my own life, playing
          baseball, or taking things apart just to prove I can put them back together better.
          Efficiency is my superpower, coffee just keeps it running at max RPM.
        </Reveal>
        <Reveal as="p" delay={240}>
          I also run{' '}
          <a href="https://bittobyte.qzz.io" className="text-[#b5f53c] hover:text-[#c9fa6b]">
            BitToByte
          </a>
          , the studio where my products live. Check out the projects below, and if you like what you
          see, hit me up in the contact section.
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-wrap gap-3 pt-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b5f53c]/40 hover:text-white"
              >
                {skill}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={120} className="min-w-0">
        <TerminalCard />
      </Reveal>
    </div>

    {/* Seamless stack marquee (content duplicated so -50% loops cleanly) */}
    <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-3">
        {[...TECH, ...TECH].map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-sm text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  </section>
);

const Projects = () => {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-3 text-center text-3xl font-bold">Projects</h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
        The full catalog: from live full-stack products to data experiments. The polished ones also
        power the <a href="https://bittobyte.qzz.io" className="text-[#b5f53c] hover:text-[#c9fa6b]">BitToByte</a> studio.
      </p>

      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
        Featured work
      </h3>
      <div className="grid auto-rows-[minmax(200px,1fr)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map(renderCard)}
      </div>

      <h3 className="mb-6 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-400">
        More projects
      </h3>
      <div className="grid auto-rows-[minmax(200px,1fr)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {more.map(renderCard)}
      </div>
    </section>
  );
};

export default function App() {
  // Vercel Analytics stays off until the visitor opts in via the consent banner.
  const [analyticsAllowed, setAnalyticsAllowed] = useState(
    () => getStoredConsent() === 'accepted',
  );

  // The page stays dark; one 0-100 level controls only the lime pointer glow: it maps
  // to the Background spotlight's strength and size, which grow together until near
  // 100 the glow floods the whole page at a uniform brightness.
  const [level, setLevel] = useState(() => getStoredThemeLevel() ?? DEFAULT_LEVEL);

  useEffect(() => {
    storeThemeLevel(level);
  }, [level]);

  return (
    <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100">
      {/* lime cursor glow to match the portfolio accent (#b5f53c); strength + size
          track the slider, capped lower than landing since lime reads hot */}
      <Background glow="181, 245, 60" strength={levelToStrength(level)} spread={levelToSpread(level)} />
      <Navbar
        links={PROFILE_LINKS}
        logoText="Alex"
        logoTextTop="Alejandro"
        logoIcon={<AlexMark />}
        logoHref="#home"
        contactHref="#contact"
        contactLabel="Contact"
        markClassName="bg-[#b5f53c] shadow-lg shadow-[#b5f53c]/30"
        markIconClassName="text-gray-950"
      />

      <main className="pt-16">
        <section
          id="home"
          className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-6 text-center"
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Hola, my name is{' '}
              <span className="text-[#b5f53c]">
                Alejandro.
              </span>
            </h1>
            <p className="text-xl italic text-gray-400">(but you can call me Alex)</p>
            <p className="max-w-xl text-gray-400">
              AI &amp; Automation Engineer | Software Developer | Data-Driven Problem Solver
            </p>
            <a
              href="#projects"
              className="rounded-full bg-[#b5f53c] px-8 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-[#b5f53c]/25 transition-transform hover:scale-105"
            >
              View My Work
            </a>
          </div>

          <a
            href="#about"
            aria-label="Scroll to About Me"
            className="absolute bottom-8 animate-float text-gray-400 transition-colors hover:text-[#b5f53c]"
          >
            <ChevronDown className="h-6 w-6" />
          </a>
        </section>

        <AboutMe />

        <Projects />

        <section id="contact" className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold">Contact</h2>
          <p className="mb-10 text-gray-400">Let&apos;s connect! You can reach me on:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { href: 'https://github.com/AlexMtzRmz0212', label: 'GitHub' },
              { href: 'https://linkedin.com/in/alejandro-mtz', label: 'LinkedIn' },
              { href: 'mailto:alejandro.martinez.rmz97@gmail.com', label: 'Email' },
              { href: 'https://www.instagram.com/alexmtzrmz/', label: 'Instagram' },
              { href: 'https://www.facebook.com/Alejandro.Martinez.1997', label: 'Facebook' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer
        logoText="Alex"
        tagline="AI &amp; Automation Engineer. Building things that work so you don't have to."
        copyrightName="Alejandro Martinez"
        showCookieSettings
        markClassName="bg-[#b5f53c]"
        markIconClassName="text-gray-950"
      />

      {analyticsAllowed && <Analytics />}
      <CookieConsent
        onConsentChange={(value) => setAnalyticsAllowed(value === 'accepted')}
        privacyHref="https://bittobyte.qzz.io/privacy.html"
        acceptClassName="bg-[#b5f53c] text-gray-950 hover:brightness-105"
      />
      <ThemeSlider level={level} onChange={setLevel} />
    </div>
  );
}
