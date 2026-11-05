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
  Globe,
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
  globe: Globe,
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

// Bento mosaic: per-project tile spans (md and lg; cards stack cleanly below that).
//
// The grid is 3 columns at lg, so a section only tiles flush when its spans sum
// to a multiple of 3. Featured work holds 7 cards, which tiles as 2+1 / 1+1+1 / 2+1;
// more projects holds 12, which tiles as four rows of 1+1+1 with the default span. A
// 2×2 tile is out, because it costs 4 cells and strands a card alone on its own row.
// Width here is editorial, not a size ranking: it goes to the cards that need the
// room (a longer description).
//
// The md span exists for the same arithmetic one breakpoint down: an odd card count
// in a 2-column grid leaves an orphan unless exactly one card is double-width. Featured
// is odd today, so it has one; more projects is even and needs none.
//
// Archive projects are deliberately absent: they render as list rows, not tiles,
// so adding a case study never has to be paid for in mosaic arithmetic.
const SPANS = {
  // Featured work: 2+1 / 1+1+1 / 2+1
  fedethics: 'md:col-span-2 lg:col-span-2',
  'eastcoast-ev': 'lg:col-span-1',
  'express-entry': 'lg:col-span-1',
  'daily-checklist': 'lg:col-span-1',
  'mcu-timeline': 'lg:col-span-1',
  plc: 'lg:col-span-2',
  banda: 'lg:col-span-1',
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
      {/* Plain text, not a row of rounded chips. A tag cluster under every card body is
          the single most repeated shape on generated sites, and the stack reads fine
          as a line. Structured chip lists (skills, stack-by-group) keep their pills. */}
      <p className="text-xs text-gray-400">{project.tags.slice(0, 3).join(', ')}</p>
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

export const ProjectGrid = ({ projects: items, titleAs }) => (
  <div className="grid auto-rows-[minmax(200px,1fr)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {items.map((project) => (
      <ProjectCard key={project.id} project={project} titleAs={titleAs} />
    ))}
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
              <p className="mt-2 text-xs text-gray-400">{project.tags.slice(0, 3).join(', ')}</p>
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
