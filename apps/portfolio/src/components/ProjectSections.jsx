import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Boxes,
  CalendarDays,
  Database,
  FileText,
  Map,
  ShieldCheck,
  Terminal,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { hasCaseStudy } from '../data/caseStudies';

// Map the shared icon keys to lucide components.
const ICONS = {
  terminal: Terminal,
  activity: Activity,
  database: Database,
  map: Map,
  calendar: CalendarDays,
  chart: BarChart3,
  zap: Zap,
  boxes: Boxes,
  shield: ShieldCheck,
  users: Users,
  book: BookOpen,
  file: FileText,
  workflow: Workflow,
};

// Bento mosaic: per-project tile spans (lg only; cards stack cleanly below that).
//
// The grid is 3 columns, so a section only tiles flush when its spans sum to a
// multiple of 3. Both sections hold 4 cards, which means the rhythm has to be
// 2+1 / 1+2 — a 2×2 tile would cost 4 of the 6 cells and strand the fourth card
// alone on a row of its own. Width here is editorial, not a size ranking: it
// goes to the cards that need the room (a picker, a longer description).
//
// Archive projects are deliberately absent: they render as list rows, not tiles,
// so adding a case study never has to be paid for in mosaic arithmetic.
const SPANS = {
  // Featured work: 2+1 / 1+2
  'eastcoast-ev': 'lg:col-span-2',
  'express-entry': 'lg:col-span-1',
  'daily-checklist': 'lg:col-span-1',
  'mcu-timeline': 'lg:col-span-2',
  // More projects: 2+1 / 2+1
  'bittobyte-hub': 'lg:col-span-2',
  'sports-hub': 'lg:col-span-1',
  'sports-maps': 'lg:col-span-2',
  'habits-analysis': 'lg:col-span-1',
};

const linkBtn =
  'rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white';

const CardShell = ({ project, children, titleAs: Title = 'h4' }) => {
  const Icon = ICONS[project.icon] ?? Boxes;
  const span = SPANS[project.id] ?? 'lg:col-span-1';
  // A double-width tile gets a slightly larger title so the mosaic has a rhythm.
  // Deliberately a small step: the old 2×2 hero read as "this is the only real
  // project here", which is not what the width is saying.
  const isWide = span.includes('col-span-2');
  return (
    <div
      className={`flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20 ${span}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex items-center justify-center rounded-lg border border-white/10 bg-white/5 ${
            isWide ? 'h-12 w-12' : 'h-10 w-10'
          }`}
          style={{ color: project.accent }}
        >
          <Icon className={isWide ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
        </span>
        {/* Level is the caller's call: on the home page these sit under h3 group
            labels, on /work they sit under h2 ones. */}
        <Title className={`font-semibold ${isWide ? 'text-xl' : 'text-lg'}`}>{project.name}</Title>
      </div>
      <p className={`flex-grow text-gray-400 ${isWide ? 'text-sm md:text-base' : 'text-sm'}`}>
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

// Shown on any card whose project has a writeup, so the deep link is reachable
// from the grid and not only from /work.
const CaseStudyLink = ({ slug }) => (
  <Link
    to={`/work/${slug}`}
    className="rounded-full border border-[#b5f53c]/30 bg-[#b5f53c]/10 px-4 py-1.5 text-sm text-[#b5f53c] transition-colors hover:bg-[#b5f53c]/20"
  >
    Case study
  </Link>
);

const ProjectCard = ({ project, titleAs }) => (
  <CardShell project={project} titleAs={titleAs}>
    <div className="mt-auto flex flex-wrap gap-3">
      {hasCaseStudy(project.id) && <CaseStudyLink slug={project.slug} />}
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
const SportsMapsCard = ({ project, titleAs }) => {
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
    <CardShell project={project} titleAs={titleAs}>
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

const renderCard = (project, titleAs) =>
  project.id === 'sports-maps' ? (
    <SportsMapsCard key={project.id} project={project} titleAs={titleAs} />
  ) : (
    <ProjectCard key={project.id} project={project} titleAs={titleAs} />
  );

export const ProjectGrid = ({ projects: items, titleAs }) => (
  <div className="grid auto-rows-[minmax(200px,1fr)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {items.map((project) => renderCard(project, titleAs))}
  </div>
);

// Archive projects have no live demo to show off, so a tile full of empty space
// would be dishonest furniture. A row that leads straight into the writeup is
// what these actually are.
export const ArchiveList = ({ projects: items, titleAs: Title = 'h4' }) => (
  <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
    {items.map((project) => {
      const Icon = ICONS[project.icon] ?? Boxes;
      return (
        <li key={project.id}>
          <Link
            to={`/work/${project.slug}`}
            className="group flex items-start gap-4 p-5 transition-colors hover:bg-white/[0.04]"
          >
            <span
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
              style={{ color: project.accent }}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <Title className="font-semibold text-gray-100 group-hover:text-white">
                {project.name}
              </Title>
              <p className="mt-1 text-sm text-gray-400">{project.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <ArrowRight
              className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#b5f53c]"
              aria-hidden="true"
            />
          </Link>
        </li>
      );
    })}
  </ul>
);
