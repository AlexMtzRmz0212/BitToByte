// The one place project copy lives.
//
// Every surface on bittobyte.qzz.io reads from this list: the Nexus index, the
// prerendered HTML crawlers see, the list view, every map's districts and every
// info card. To add a project, append an object. To change copy, edit it here.
// No component needs to change either way.
//
// Field guide
//   slug        URL and storage key (?project=<slug>). Keep it stable once shared.
//   name        Shown exactly as written.
//   oneLiner    The sentence a recruiter reads first. Aim for under 90 characters.
//   summary     One or two short sentences for the card and the list view.
//   stack       Tags, most important first.
//   liveUrl     Where "Launch live project" goes. Confirmed live on 2026-10-15.
//   repoUrl     GitHub link, or null to hide the button.
//   preview     Screenshot under /public/previews, or null until one exists.
//   kind        Which group it sits in on the list view.
//   district    Building concept on the maps (src/districts/archetypes.ts).
//   scene       Arrival mini-scene id (same file).
//   lot         Optional: pin to a specific lot index in a world. By default,
//               projects fill each world's lots in the order of this array, and
//               the first lots sit nearest the spawn point.
//
// Anything marked TODO(alex) is a draft or an open question for Alex.

import type { ArchetypeId, SceneId } from '../districts/archetypes';
import type { WorldId } from './worlds';

export type ProjectKind = 'client' | 'product' | 'tool' | 'data' | 'hackathon';

export interface Project {
  slug: string;
  name: string;
  oneLiner: string;
  summary: string;
  stack: string[];
  liveUrl: string;
  repoUrl: string | null;
  preview: { src: string; alt: string; width: number; height: number } | null;
  kind: ProjectKind;
  district: ArchetypeId;
  scene: SceneId;
  lot?: Partial<Record<WorldId, number>>;
}

export const KINDS: { id: ProjectKind; label: string }[] = [
  { id: 'client', label: 'Client work' },
  { id: 'product', label: 'Live products' },
  { id: 'tool', label: 'Personal tools' },
  { id: 'data', label: 'Data stories' },
  { id: 'hackathon', label: 'Hackathon' },
];

export const projects: Project[] = [
  {
    slug: 'fedethics',
    name: 'FedEthics',
    oneLiner: 'The platform an AI-governance firm runs on, from the website to the newsletter.',
    summary:
      'I moved the site from loose HTML in a shared drive to an Astro codebase that deploys on every push. A Python pipeline now writes and sends the biweekly newsletter.',
    stack: ['Astro', 'Python', 'GitHub Actions', 'Claude API', 'GA4'],
    liveUrl: 'https://fedethics.ca',
    // TODO(alex): the repo (github.com/FedEthics/fedethics.ca) is public. Show it?
    repoUrl: null,
    preview: null,
    kind: 'client',
    district: 'courthouse',
    scene: 'scales',
  },
  {
    slug: 'eastcoast-ev',
    name: 'EastCoastEV',
    oneLiner: 'Catalog and reservations for an e-bike and scooter shop in New Brunswick.',
    summary:
      'A React and TypeScript storefront on a Supabase catalog. Reservations and contact requests reach the shop through serverless functions.',
    stack: ['React', 'TypeScript', 'Supabase', 'Vercel Functions'],
    liveUrl: 'https://www.eastcoastev.ca',
    // TODO(alex): the repo (github.com/AlexMtzRmz0212/EastCoastEV.ca) is public. Show it?
    repoUrl: null,
    preview: null,
    kind: 'client',
    district: 'lighthouse',
    scene: 'charge',
  },
  {
    slug: 'express-entry',
    // TODO(alex): the live title is "Express Entry Draws Intelligence". Shorter here on purpose.
    name: 'Express Entry Draws',
    oneLiner: 'Every Canadian Express Entry draw, charted, searchable and refreshed daily.',
    summary:
      'Official draw data lands in Postgres and comes back as score trends and draw sizes. A change-detecting cron keeps it current without anyone pressing refresh.',
    stack: ['React', 'FastAPI', 'Supabase', 'Cron'],
    // TODO(alex): expressentry.bittobyte.qzz.io serves the same app and is the GitHub
    // homepage. Which one is canonical?
    liveUrl: 'https://ee.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/ExpressEntryDrawsAnalysis',
    preview: null,
    kind: 'product',
    district: 'gate',
    scene: 'flipboard',
  },
  {
    slug: 'ai-task-sorter',
    name: 'AI Task Sorter',
    oneLiner: 'Drop your tasks in. An LLM scores each one and sorts the list for you.',
    summary:
      'Each task is scored on things like urgency and effort, then lands in an Eisenhower matrix, a tree or a day plan. It syncs both ways with Notion.',
    stack: ['React', 'FastAPI', 'OpenRouter', 'Postgres', 'Notion API'],
    liveUrl: 'https://checklist.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Daily-Checklist',
    preview: null,
    kind: 'product',
    district: 'clocktower',
    scene: 'sort',
  },
  {
    slug: 'hell-o-fame',
    name: 'Hell o’ Fame',
    oneLiner: 'My album library as a hall of fame, plus the tools that rank it.',
    summary:
      'Visitors browse a ranked cover wall read straight from Notion. Signed in, the same page runs the real tools against Notion, Spotify and Setlist.fm.',
    stack: ['React', 'FastAPI', 'Notion API', 'Spotify API'],
    liveUrl: 'https://hell-o-fame.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Hell-o-Fame',
    preview: null,
    kind: 'tool',
    district: 'monument',
    scene: 'ranking',
  },
  {
    slug: 'cinetech',
    name: 'Cinetech',
    oneLiner: 'A movie library that keeps Notion as its database and merges every tracker in.',
    summary:
      'Letterboxd, IMDb, Trakt and TMDb imports land in one Notion database with no duplicates and full metadata. Then it turns the pile into stats.',
    stack: ['Next.js', 'TypeScript', 'Notion API', 'TMDb API'],
    liveUrl: 'https://cinetech.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/cinetech',
    preview: null,
    kind: 'tool',
    district: 'cinema',
    scene: 'projector',
  },
  {
    slug: 'projects-tracker',
    name: 'ProjectsTracker',
    oneLiner: 'One-click timers, a calendar that fills with your hours, and a year of heatmap.',
    summary:
      'A time tracker with a drag-and-drop status board, plus to-dos and notes per project. Timers live on the server, so they keep counting with the tab closed.',
    stack: ['React', 'FastAPI', 'SQLAlchemy', 'Tailwind'],
    liveUrl: 'https://projects.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/ProjectsTracker',
    preview: null,
    kind: 'tool',
    district: 'tower',
    scene: 'timer',
  },
  {
    slug: 'habits',
    // TODO(alex): the live title is "Dear habits…" and GitHub says "Habits Analytics".
    name: 'Habits',
    oneLiner: 'Three years of daily habit logs, turned into a diary you can flip through.',
    summary:
      'Exports from a habit-tracking app run through a Python pipeline into Postgres. The site reads them back as trends, streaks and an interactive journal.',
    stack: ['Next.js', 'Postgres', 'Python', 'pandas'],
    liveUrl: 'https://habits.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Habits-Tracking',
    preview: null,
    kind: 'data',
    district: 'garden',
    scene: 'sundial',
  },
  {
    slug: 'sports',
    // TODO(alex): the repo is "Sports"; the live site calls itself "The Locker Room".
    name: 'The Locker Room',
    oneLiner: 'Season calendars, team maps and title history for eight leagues and tournaments.',
    summary:
      'A scheduled pipeline refreshes fixtures and results. The site turns them into calendars, a map of every team and a timeline of who won it all.',
    stack: ['React', 'TypeScript', 'Leaflet', 'Python', 'GitHub Actions'],
    liveUrl: 'https://sports.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Sports',
    preview: null,
    kind: 'data',
    district: 'stadium',
    scene: 'ball',
  },
  {
    slug: 'marvel',
    // TODO(alex): the live title is "Marvel Watch Order".
    name: 'Marvel',
    oneLiner: 'A watch-order guide for one sprawling shared universe of films and series.',
    summary:
      'Release order or story order, on a timeline you can drag into your own. Titles and artwork come from TMDb through a FastAPI backend.',
    stack: ['React', 'FastAPI', 'TanStack Query', 'TMDb API'],
    liveUrl: 'https://marvel.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/MARVEL',
    preview: null,
    kind: 'data',
    district: 'library',
    scene: 'shelf',
  },
  {
    slug: 'hack-the-hill',
    // TODO(alex): the team shipped it as FixTheFlow and the live title is "Northwind Utilities".
    name: 'Hack the Hill III',
    oneLiner: 'One queue for a utility’s complaints, built over a hackathon weekend.',
    summary:
      'Customers file and track requests, staff work one shared queue, and managers see the hot spots. Row Level Security decides what each role can read.',
    stack: ['React', 'TypeScript', 'Supabase', 'Row Level Security'],
    liveUrl: 'https://hack-the-hill-iii.bittobyte.qzz.io',
    // TODO(alex): this is a teammate's repo (jasonwong7770). Keep the link?
    repoUrl: 'https://github.com/jasonwong7770/CGI-Hack-the-Hill',
    preview: null,
    kind: 'hackathon',
    district: 'arena',
    scene: 'queue',
  },
];

const bySlug = new Map(projects.map((p) => [p.slug, p]));

export const projectBySlug = (slug: string | null | undefined): Project | undefined =>
  slug ? bySlug.get(slug) : undefined;

export const projectsByKind = (kind: ProjectKind): Project[] =>
  projects.filter((p) => p.kind === kind);
