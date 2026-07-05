// src/App.jsx
import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Background, Navbar, Footer } from '@alex_mtz/bittobyte-ui';
import { Terminal, Activity, Database, Map, CalendarDays, BarChart3, Boxes } from 'lucide-react';
import { projects } from '@bittobyte/content';

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
};

const linkBtn =
  'rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white';

const CardShell = ({ project, children }) => {
  const Icon = ICONS[project.icon] ?? Boxes;
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5"
          style={{ color: project.accent }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold">{project.name}</h3>
      </div>
      <p className="flex-grow text-sm text-gray-400">{project.description}</p>
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

// Special interactive card for the "Divisions & Leagues Maps" project — pick a
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
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Sport:</label>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="rounded-md border border-white/10 bg-gray-900 px-3 py-1.5 text-sm text-gray-300"
        >
          <option value="mlb">MLB</option>
          <option value="nfl">NFL</option>
          <option value="nba">NBA</option>
          <option value="nhl">NHL</option>
        </select>
        <img src={current.icon} alt={`${sport} logo`} className="h-8 w-auto" />
      </div>
      <div className="mt-auto flex gap-3">
        {current.disabled ? (
          <>
            <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-500">
              Demo (Soon)
            </span>
            <span className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-gray-500">
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

const Projects = () => {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="mb-3 text-center text-3xl font-bold">Projects</h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-gray-400">
        The full catalog — from live full-stack products to data experiments. The polished ones also
        power the <a href="https://bittobyte.qzz.io" className="text-blue-400 hover:text-blue-300">BitToByte</a> studio.
      </p>

      <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
        Featured work
      </h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {featured.map(renderCard)}
      </div>

      <h3 className="mb-6 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-500">
        More projects
      </h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {more.map(renderCard)}
      </div>
    </section>
  );
};

export default function App() {
  useEffect(() => {
    const handleScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.getBoundingClientRect().top < triggerBottom) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-950 font-sans text-gray-100">
      <Background />
      <Navbar
        links={PROFILE_LINKS}
        logoText="Alex"
        logoHref="#home"
        contactHref="#contact"
        contactLabel="Contact"
      />

      <main className="pt-16">
        <section id="home" className="flex min-h-screen items-center justify-center px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Hola, my name is{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Alejandro.
              </span>
            </h1>
            <p className="text-xl italic text-gray-400">(but you can call me Alex)</p>
            <p className="max-w-xl text-gray-400">
              AI &amp; Automation Engineer | Software Developer | Data-Driven Problem Solver
            </p>
            <a
              href="#projects"
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-105"
            >
              View My Work
            </a>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="mb-10 text-center text-3xl font-bold">About Me</h2>
          <div className="space-y-4 leading-relaxed text-gray-400">
            <p>
              I&apos;m Alex. Engineer, Coder, and Genius (working on the billionaire, playboy,
              philanthropist part). Basically, the guy you call when your automation stops automating. I
              build SCADA systems, train my AIs as they are my pets, and design software tools that turn
              &quot;this takes forever&quot; into &quot;done already?&quot; Python, SQL, TensorFlow, PLCs.
              Yeah, I speak fluent machine, you name it.
            </p>
            <p>
              Human Languages? English and Spanish are a given. French and German are current bonus DLC
              I&apos;m unlocking.
            </p>
            <p>
              When I&apos;m not busy making machines smarter, I&apos;m automating my own life, playing
              baseball, or taking things apart just to prove I can put them back together better than
              before. Efficiency is my superpower, coffee just keeps it running at max RPM.
            </p>
            <p>
              I also run <a href="https://bittobyte.qzz.io" className="text-blue-400 hover:text-blue-300">BitToByte</a>,
              the studio where my products live. Go ahead and check out my projects below — if you like
              what you see or just want to chat about tech, sports, or life, hit me up in the contact
              section!
            </p>
          </div>
        </section>

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
      />

      <Analytics />
    </div>
  );
}
