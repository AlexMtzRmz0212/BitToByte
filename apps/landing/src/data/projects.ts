// The one place project copy lives.
//
// Every surface on bittobyte.qzz.io reads from this list: the travel panel, the
// prerendered HTML crawlers see, the list view, each world's landmarks and every
// info card. To add a project, append an object. To change copy, edit it here.
// No component needs to change either way.
//
// Field guide
//   slug        URL and storage key (?project=<slug>). Keep it stable once shared.
//   name        Shown exactly as written.
//   oneLiner    The sentence a recruiter reads first. Aim for under 90 characters.
//   summary     One or two short sentences for the card and the list view.
//   stack       Tags, most important first.
//   liveUrl     Where "Launch live project" goes. Confirmed live on 2026-11-04.
//               null for a project with no public site: its card leads with its code.
//   repoUrl     GitHub link, or null to hide the button. Required when liveUrl is null.
//   preview     Screenshot under /public/previews (pnpm previews), or null.
//   world       Which map it lives on (src/data/worlds.ts).
//   kind        A small label: client work, product, tool...
//   district    Its landmark on the map (src/districts/archetypes.ts). If the
//               world has no art for that id, it gets the world's generic hall.
//   scene       Arrival mini-scene id (same file).
//   lot         Optional: pin to a lot index on its world's map. By default a
//               world's projects fill its lots in the order of this array.
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
  liveUrl: string | null;
  repoUrl: string | null;
  preview: { src: string; alt: string; width: number; height: number } | null;
  world: WorldId;
  kind: ProjectKind;
  district: ArchetypeId;
  scene: SceneId;
  lot?: number;
}

export const KINDS: { id: ProjectKind; label: string }[] = [
  { id: 'client', label: 'Client work' },
  { id: 'product', label: 'Live product' },
  { id: 'tool', label: 'Personal tool' },
  { id: 'data', label: 'Data story' },
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
    preview: {
      src: '/previews/fedethics.webp',
      alt: 'The FedEthics home page: its headline beside two of the firm’s books',
      width: 800,
      height: 500,
    },
    world: 'manuscript',
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
    preview: {
      src: '/previews/eastcoast-ev.webp',
      alt: 'The EastCoastEV home page: “Ride electric. Feel free.” in green on black',
      width: 800,
      height: 500,
    },
    world: 'sunset',
    kind: 'client',
    district: 'showroom',
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
    preview: {
      src: '/previews/express-entry.webp',
      alt: 'The Express Entry Draws dashboard, led by the latest draw’s score and invitations',
      width: 800,
      height: 500,
    },
    world: 'manuscript',
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
    preview: {
      src: '/previews/ai-task-sorter.webp',
      alt: 'The AI Task Sorter home page beside a sample list sorted by priority',
      width: 800,
      height: 500,
    },
    world: 'voxel',
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
    preview: {
      src: '/previews/hell-o-fame.webp',
      alt: 'Hell o’ Fame’s album of the day above the ranked album library',
      width: 800,
      height: 500,
    },
    world: 'pop',
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
    preview: {
      src: '/previews/cinetech.webp',
      alt: 'The Cinetech library: a grid of film posters with search and filters',
      width: 800,
      height: 500,
    },
    world: 'noir',
    kind: 'tool',
    district: 'cinema',
    scene: 'projector',
    lot: 1,
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
    preview: {
      src: '/previews/projects-tracker.webp',
      alt: 'The ProjectsTracker board, with a running timer on each project card',
      width: 800,
      height: 500,
    },
    world: 'voxel',
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
    preview: {
      src: '/previews/habits.webp',
      alt: 'Habits opens on a leather diary cover with a brass clasp',
      width: 800,
      height: 500,
    },
    world: 'frontier',
    kind: 'data',
    district: 'camp',
    scene: 'sundial',
    lot: 1,
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
    preview: {
      src: '/previews/sports.webp',
      alt: 'The Locker Room home page: a chalkboard counting down to the next season',
      width: 800,
      height: 500,
    },
    world: 'sunset',
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
    preview: {
      src: '/previews/marvel.webp',
      alt: 'The Marvel watch-order home page with its timeline map and catalogue stats',
      width: 800,
      height: 500,
    },
    world: 'pop',
    kind: 'data',
    district: 'library',
    scene: 'shelf',
    lot: 2,
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
    preview: {
      src: '/previews/hack-the-hill.webp',
      alt: 'The hackathon portal’s landing page: one place for every energy and water request',
      width: 800,
      height: 500,
    },
    world: 'frontier',
    kind: 'hackathon',
    district: 'telegraph',
    scene: 'queue',
  },
  {
    slug: 'rosary',
    name: 'Virtual Rosary',
    oneLiner: 'A guided rosary in English, Spanish or French that knows today’s mysteries.',
    summary:
      'Choose from the four sets of mysteries, with today’s set marked, then begin. It works from the keyboard and runs as a plain static site.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://rosary.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Rosary',
    preview: {
      src: '/previews/rosary.webp',
      alt: 'The Virtual Rosary start page: the four sets of mysteries, with today’s set selected',
      width: 800,
      height: 500,
    },
    world: 'manuscript',
    kind: 'tool',
    district: 'garden',
    scene: 'sundial',
  },
  {
    slug: 'ghosts',
    name: 'Woodstone After Dark',
    oneLiner: 'Every Ghosts intro on CBS, one episode at a time, with no spoilers past where you are.',
    summary:
      'A fan-made house you scroll down: each floor is a season and each room one intro. Tap a cold spot to see who is there and how long they have been dead.',
    stack: ['React', 'TypeScript', 'Vite'],
    liveUrl: 'https://ghosts.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Ghosts',
    preview: {
      src: '/previews/ghosts.webp',
      alt: '“Who’s haunting Woodstone?” above the dark outline of the mansion under a crescent moon',
      width: 800,
      height: 500,
    },
    world: 'manuscript',
    kind: 'data',
    district: 'hall',
    scene: 'flipboard',
  },
  {
    slug: 'plc',
    name: 'PLC Showcase',
    oneLiner: 'Four PLC programs running live in your browser, in Allen-Bradley and Siemens style.',
    summary:
      'A scan-cycle engine written from scratch drives simulated machines, from a motor starter to a duplex lift station. Press buttons, inject faults and watch the ladder respond.',
    stack: ['React', 'TypeScript', 'Vite', 'Ladder logic'],
    liveUrl: 'https://plc.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/PLC',
    preview: {
      src: '/previews/plc.webp',
      alt: 'The PLC Showcase home page beside a live ladder rung with Start and Stop buttons',
      width: 800,
      height: 500,
    },
    world: 'voxel',
    kind: 'product',
    district: 'arena',
    scene: 'sort',
  },
  {
    slug: 'runtime',
    name: 'Runtime',
    oneLiner: 'A TV tracker that shows your next episode and how much time each show has left.',
    summary:
      'Notion is the database and TVmaze fills in the episodes. Visitors get a read-only library with filters, and the owner view ticks off episodes and seasons.',
    stack: ['Next.js', 'TypeScript', 'Notion API', 'TVmaze API'],
    liveUrl: 'https://runtime.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Runtime',
    preview: {
      src: '/previews/runtime.webp',
      alt: 'The Runtime library: a Continue watching strip above a filterable grid of shows',
      width: 800,
      height: 500,
    },
    world: 'noir',
    kind: 'tool',
    district: 'cinema',
    scene: 'projector',
  },
  {
    slug: 'tono',
    name: 'Tono',
    oneLiner: 'A chromatic tuner in your browser, with four temperaments to tune against.',
    summary:
      'Equal, just, Pythagorean and meantone tuning, with an adjustable A4. Audio is analyzed on your device and never sent to a server. The interface is in Spanish.',
    stack: ['JavaScript', 'Canvas', 'Microphone input'],
    liveUrl: 'https://tuner.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Tuner',
    preview: {
      src: '/previews/tono.webp',
      alt: 'The Tono tuner: a cents dial above the button that turns on the microphone',
      width: 800,
      height: 500,
    },
    world: 'sunset',
    kind: 'tool',
    district: 'hall',
    scene: 'charge',
  },
  {
    slug: 'banda',
    name: 'Banda de Guerra Scoring',
    oneLiner: 'Live scoring for bandas de guerra contests, built to keep working offline.',
    summary:
      'Judges score on tablets and totals reach the administrator in real time. Scores save on the device first and sync when the connection returns. The app is in Spanish, behind a login.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'IndexedDB'],
    liveUrl: 'https://banda.bittobyte.qzz.io/login',
    repoUrl: null,
    preview: {
      src: '/previews/banda.webp',
      alt: 'The Banda de Guerra Scoring login page, in Spanish, with email and password fields',
      width: 800,
      height: 500,
    },
    world: 'pop',
    kind: 'client',
    district: 'stadium',
    scene: 'ranking',
  },
  {
    slug: 'tiktok-archive',
    name: 'TikTok Archive',
    oneLiner: 'About 5,600 saved TikToks, turned into a searchable, categorized notes archive.',
    summary:
      'A local Python pipeline transcribes each video, sorts it into 32 categories and writes Obsidian notes. It runs on your own machine and calls no paid API.',
    stack: ['Python', 'Postgres', 'pgvector', 'faster-whisper'],
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/Tiktoks',
    preview: null,
    world: 'pop',
    kind: 'tool',
    district: 'library',
    scene: 'shelf',
  },
  {
    slug: 'loop-habits',
    name: 'Loop Habits Fork',
    oneLiner: 'My fork of Loop Habit Tracker, with cross-device sync and a desktop app.',
    summary:
      'Adds time-of-day habits, folder-based sync between devices and a Compose Multiplatform desktop client to iSoron’s open-source Android app.',
    stack: ['Kotlin', 'Compose Multiplatform', 'SQLite'],
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/uhabits/tree/mine',
    preview: null,
    world: 'frontier',
    kind: 'tool',
    district: 'camp',
    scene: 'sundial',
  },
];

const bySlug = new Map(projects.map((p) => [p.slug, p]));

export const projectBySlug = (slug: string | null | undefined): Project | undefined =>
  slug ? bySlug.get(slug) : undefined;

export const projectsInWorld = (world: WorldId): Project[] =>
  projects.filter((p) => p.world === world);

export const kindLabel = (kind: ProjectKind): string =>
  KINDS.find((k) => k.id === kind)?.label ?? kind;
