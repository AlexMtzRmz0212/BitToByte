// Single source of truth for every BitToByte / Alex project.
//
// This ONE list feeds both sites:
//   • Portfolio (alex.bittobyte.qzz.io) renders ALL projects  → the complete catalog.
//   • Landing   (bittobyte.qzz.io)      renders featured ones → the studio's "products".
//
// So `featured: true` = "this is a polished, live product a stranger could use" and it
// appears on BOTH sites; everything else lives only on the portfolio. Add a project here
// once and it shows up in the right place automatically; no detail is ever lost, because
// the portfolio always shows the full list.
//
// `icon` is a plain string key; each app maps it to its own icon component so this
// package stays framework-agnostic (no React import here).
//
// `group` decides how the portfolio presents it, and nothing else:
//   'product'    live, maintained, someone else could use it today
//   'experiment' public but small: data toys, one-page visualizations
//   'archive'    finished and not hosted (school, hackathon, personal automation).
//                These exist as written case studies rather than live demos.
//
// `slug` is the case-study URL segment on the portfolio (/work/<slug>). Keep it stable
// once published: it is the part of the link people paste into applications.

export const projects = [
  {
    id: 'fedethics',
    slug: 'fedethics',
    name: 'FedEthics Platform',
    tagline: 'Owning the site an advisory firm runs on, and the pipeline that feeds it',
    description:
      'Technical ownership of an AI-governance firm’s web platform. The founder hand-built the first version as vanilla HTML living in Google Drive; I put it under version control, migrated it to Astro, and wired the repo to production so a push to main builds and ships to Namecheap on its own. On top of that sit the backend subscriber endpoint, a consent-gated GA4 layer, and a Python pipeline that writes and sends the biweekly newsletter without a human touching an edition.',
    liveUrl: 'https://fedethics.ca',
    repoUrl: null,
    tags: ['Astro', 'Python', 'CI/CD', 'Claude API', 'GA4'],
    icon: 'globe',
    accent: '#d4a84b',
    featured: true,
    group: 'product',
  },
  {
    id: 'eastcoast-ev',
    slug: 'eastcoast-ev',
    name: 'East Coast EV',
    tagline: 'E-commerce catalog & reservations for an electric-rides retailer',
    description:
      'Full-stack storefront for an electric-rides retailer (e-bikes, e-scooters, e-dirt-bikes, e-trikes). React 19 + TypeScript SPA with a Supabase-backed product catalog (brands, categories, colors, images), a secure reservation flow, and Vercel serverless functions that email the shop on new reservations and contact requests.',
    liveUrl: 'https://eastcoastev.ca',
    repoUrl: null,
    tags: ['React', 'TypeScript', 'Supabase', 'Client Work'],
    icon: 'zap',
    accent: '#b5f53c',
    featured: true,
    group: 'product',
  },
  {
    id: 'express-entry',
    slug: 'express-entry',
    name: 'Express Entry Draws Intelligence',
    tagline: 'Live analytics for Canadian Express Entry draws',
    description:
      'Full-stack dashboard that pulls official IRCC draw data, stores it in Postgres, and renders trend charts, CRS predictions, and a searchable draws table. Auto-refreshes daily via a change-detecting cron.',
    liveUrl: 'https://EE.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/ExpressEntryDrawsAnalysis',
    tags: ['React', 'FastAPI', 'Supabase', 'Data Viz'],
    icon: 'terminal',
    accent: '#22c55e',
    featured: true,
    group: 'product',
  },
  {
    id: 'daily-checklist',
    slug: 'ai-task-sorter',
    name: 'AI Task Sorter',
    tagline: 'An AI that scores and re-orders your task list',
    description:
      'Full-stack task manager where an LLM evaluates each task and applies an Eisenhower-matrix sort in real time, with animated re-ordering. FastAPI backend, React + Framer Motion frontend, Neon Postgres.',
    liveUrl: 'https://checklist.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Daily-Checklist',
    tags: ['React', 'FastAPI', 'LLM', 'Framer Motion'],
    icon: 'activity',
    accent: '#a855f7',
    featured: true,
    group: 'product',
  },
  {
    id: 'mcu-timeline',
    slug: 'mcu-timeline',
    name: 'MCU Timeline',
    tagline: 'Chronological map of the Marvel Cinematic Universe',
    description:
      'Interactive chronological visualization of Marvel Cinematic Universe releases and in-universe order.',
    liveUrl: 'https://marvel.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/MARVEL',
    tags: ['Interactive', 'Data Viz'],
    icon: 'calendar',
    accent: '#ef4444',
    featured: true,
    group: 'product',
  },
  {
    id: 'plc',
    slug: 'plc',
    name: 'PLC Showcase',
    tagline: 'Four PLC programs running live in the browser',
    description:
      'A scan-cycle PLC engine written from scratch, running four ladder programs against simulated machines: motor control, a pedestrian crossing, a sorting conveyor and a duplex lift station. Each program renders as Allen-Bradley or Siemens ladder, generates matching Structured Text / SCL, and supports fault injection. Covered by 43 automated tests.',
    liveUrl: 'https://plc.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/PLC',
    tags: ['Ladder Logic', 'ST / SCL', 'React', 'TypeScript'],
    icon: 'zap',
    accent: '#f59e0b',
    featured: true,
    group: 'product',
  },
  {
    id: 'banda',
    slug: 'banda',
    name: 'Banda de Guerra Scoring',
    tagline: 'Live, offline-first scoring for bandas de guerra contests',
    description:
      'Judges score on tablets and the administrator watches totals update in real time, replacing score sheets transcribed by hand. Scores save on the device first and sync when the connection returns, so each one lands exactly once. Judges see only the sheets assigned to them. The app is in Spanish, behind a login.',
    liveUrl: 'https://banda.bittobyte.qzz.io/login',
    repoUrl: null,
    tags: ['Next.js', 'Supabase', 'Offline-first', 'Client Work'],
    icon: 'users',
    accent: '#38bdf8',
    featured: true,
    group: 'product',
  },
  {
    id: 'bittobyte-hub',
    slug: 'bittobyte-design-system',
    name: 'BitToByte Design System',
    tagline: 'One brand, one component library, four subdomains',
    description:
      'The shared chrome behind every bittobyte.qzz.io property: a published React component library plus a pnpm/Turborepo monorepo, so a change to the navbar or footer reaches every site at once instead of drifting version by version.',
    liveUrl: 'https://bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/BitToByte',
    tags: ['React', 'Design System', 'Monorepo', 'Turborepo'],
    icon: 'boxes',
    accent: '#3b82f6',
    featured: false,
    group: 'product',
  },
  {
    id: 'sports-hub',
    slug: 'sports',
    name: 'The Locker Room',
    tagline: 'Season calendars, team maps and title history',
    description:
      'Season calendars, team maps and title history for eight leagues and tournaments. A scheduled pipeline refreshes fixtures and results, and the site turns them into calendars, a map of every team and a timeline of who won it all.',
    liveUrl: 'https://sports.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Sports',
    tags: ['React', 'Leaflet', 'Python', 'GitHub Actions'],
    icon: 'map',
    accent: '#f97316',
    featured: false,
    group: 'product',
  },
  {
    id: 'habits-analysis',
    slug: 'habits-analysis',
    name: 'Habits Analysis',
    tagline: 'Finding patterns in personal habits & routines',
    description:
      'Data analysis of personal habits and routines to identify patterns and areas for improvement.',
    liveUrl: 'https://habits.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Habits-Tracking',
    tags: ['Data Analysis', 'Python'],
    icon: 'chart',
    accent: '#eab308',
    featured: false,
    group: 'experiment',
  },
  {
    id: 'hell-o-fame',
    slug: 'hell-o-fame',
    name: 'Hell o’ Fame',
    tagline: 'An album library as a hall of fame, plus the tools that rank it',
    description:
      'Visitors browse a ranked cover wall read straight from Notion. Signed in, the same page runs the real tools against Notion, Spotify and Setlist.fm.',
    liveUrl: 'https://hell-o-fame.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Hell-o-Fame',
    tags: ['React', 'FastAPI', 'Notion API', 'Spotify API'],
    icon: 'chart',
    accent: '#fb7185',
    featured: false,
    group: 'product',
  },
  {
    id: 'cinetech',
    slug: 'cinetech',
    name: 'Cinetech',
    tagline: 'A movie library that keeps Notion as its database',
    description:
      'Letterboxd, IMDb, Trakt and TMDb imports land in one Notion database with no duplicates and full metadata. Then it turns the pile into stats.',
    liveUrl: 'https://cinetech.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/cinetech',
    tags: ['Next.js', 'TypeScript', 'Notion API', 'TMDb API'],
    icon: 'database',
    accent: '#c084fc',
    featured: false,
    group: 'product',
  },
  {
    id: 'projects-tracker',
    slug: 'projects-tracker',
    name: 'ProjectsTracker',
    tagline: 'One-click timers, a calendar of your hours and a year of heatmap',
    description:
      'A time tracker with a drag-and-drop status board, plus to-dos and notes per project. Timers live on the server, so they keep counting with the tab closed.',
    liveUrl: 'https://projects.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/ProjectsTracker',
    tags: ['React', 'FastAPI', 'SQLAlchemy', 'Tailwind'],
    icon: 'activity',
    accent: '#2dd4bf',
    featured: false,
    group: 'product',
  },
  {
    id: 'runtime',
    slug: 'runtime',
    name: 'Runtime',
    tagline: 'A TV tracker with your next episode and the time left',
    description:
      'A personal TV tracker with Notion as its database and TVmaze filling in the episodes. Visitors get a read-only library with search, filters and a Continue watching strip. The owner view ticks off episodes and seasons, and private fields are stripped on the server.',
    liveUrl: 'https://runtime.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Runtime',
    tags: ['Next.js', 'Notion API', 'TVmaze API'],
    icon: 'calendar',
    accent: '#60a5fa',
    featured: false,
    group: 'product',
  },
  {
    id: 'rosary',
    slug: 'rosary',
    name: 'Virtual Rosary',
    tagline: 'A guided rosary that knows today’s mysteries',
    description:
      'A guided rosary in English, Spanish or French. Choose from the four sets of mysteries, with today’s set marked, then begin. It works from the keyboard and runs as a plain static site.',
    liveUrl: 'https://rosary.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Rosary',
    tags: ['HTML', 'CSS', 'JavaScript'],
    icon: 'book',
    accent: '#d4a84b',
    featured: false,
    group: 'product',
  },
  {
    id: 'tono',
    slug: 'tono',
    name: 'Tono',
    tagline: 'A chromatic tuner with four temperaments',
    description:
      'A browser tuner offering equal, just, Pythagorean and meantone tuning, with an adjustable A4. Audio is analyzed on your device and never sent to a server. The interface is in Spanish.',
    liveUrl: 'https://tuner.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Tuner',
    tags: ['JavaScript', 'Canvas', 'Microphone Input'],
    icon: 'activity',
    accent: '#e7dcc3',
    featured: false,
    group: 'product',
  },
  {
    id: 'ghosts',
    slug: 'ghosts',
    name: 'Woodstone After Dark',
    tagline: 'Every Ghosts intro, with no spoilers past where you are',
    description:
      'A fan-made companion to Ghosts on CBS that you scroll down like a house: each floor is a season and each room one intro. Tap a cold spot to see who is there and how long they have been dead. A slide only knows what the show had revealed by that episode.',
    liveUrl: 'https://ghosts.bittobyte.qzz.io',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Ghosts',
    tags: ['React', 'TypeScript', 'Vite'],
    icon: 'map',
    accent: '#818cf8',
    featured: false,
    group: 'experiment',
  },
  {
    id: 'tiktok-archive',
    slug: 'tiktok-archive',
    name: 'TikTok Archive',
    tagline: 'About 5,600 saved TikToks as a searchable notes archive',
    description:
      'A local Python pipeline that transcribes saved videos, classifies them into 32 categories, stores them in Postgres with pgvector and writes Obsidian notes, with semantic search on top. It runs on your own machine and calls no paid API.',
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/Tiktoks',
    tags: ['Python', 'pgvector', 'faster-whisper'],
    icon: 'database',
    accent: '#f472b6',
    featured: false,
    group: 'experiment',
  },
  {
    id: 'loop-habits',
    slug: 'loop-habits',
    name: 'Loop Habits Fork',
    tagline: 'Loop Habit Tracker with sync and a desktop app',
    description:
      'My fork of iSoron’s open-source Android app. It adds time-of-day habits, folder-based sync between devices and a Compose Multiplatform desktop client with charts, file sync and CLI commands.',
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/uhabits/tree/mine',
    tags: ['Kotlin', 'Compose Multiplatform', 'SQLite'],
    icon: 'chart',
    accent: '#4ade80',
    featured: false,
    group: 'experiment',
  },

  // ---------------------------------------------------------------------------
  // Archive: finished work, written up as case studies. Most of it is deliberately
  // NOT hosted: hackathon and school builds that depend on local GPUs, self-hosted
  // LLMs, or a corporate tenant. When one can run on its own (FixTheFlow's demo
  // mode needs no backend), it keeps a liveUrl and the case study links the demo.
  // ---------------------------------------------------------------------------
  {
    id: 'hackthehilliii',
    slug: 'hackthehilliii',
    name: 'Hack the Hill III',
    tagline: 'One queue for a utility’s complaints, from first call to closed ticket',
    description:
      'Hackathon build for the CGI CRM challenge: a role-aware request portal for a fictional energy and water utility whose complaints were split across four systems. Customers file and track requests, employees work one shared queue, and managers see request stats and staffing hot spots, with Supabase Row Level Security deciding what each role can read.',
    liveUrl: 'https://hack-the-hill-iii.bittobyte.qzz.io',
    repoUrl: 'https://github.com/jasonwong7770/CGI-Hack-the-Hill',
    tags: ['React', 'Supabase', 'Hackathon', 'Data Analysis'],
    icon: 'workflow',
    accent: '#80bbcf',
    featured: false,
    group: 'archive',
  },
  {
    id: 'acra-provenance',
    slug: 'acra-provenance',
    name: 'ACRA Provenance Verifier',
    tagline: 'Cryptographic proof behind a "Made in Canada" label',
    description:
      'Hackathon build that turns self-reported supply-chain origin into something a buyer can verify. Suppliers sign what they did with their own key; the backend walks the resulting multi-tier graph, checks every signature, computes Canadian content, and classifies tampering, replay, and mass-balance anomalies.',
    liveUrl: null,
    repoUrl: null,
    tags: ['FastAPI', 'Ed25519', 'React', 'Hackathon'],
    icon: 'shield',
    accent: '#ef4444',
    featured: false,
    group: 'archive',
  },
  {
    id: 'hiretech-genius',
    slug: 'hiretech-genius',
    name: 'HireTechGenius',
    tagline: 'LLM interview scoring wired into Microsoft Teams',
    description:
      'Client capstone that pulls a Teams interview transcript through Microsoft Graph, splits it into question and answer pairs, and scores each answer against a 100-point rubric using three local LLMs, then writes a PDF evaluation report.',
    liveUrl: null,
    repoUrl: null,
    tags: ['Flask', 'React', 'Microsoft Graph', 'LLM'],
    icon: 'users',
    accent: '#0ea5e9',
    featured: false,
    group: 'archive',
  },
  {
    id: 'rag-qa-education',
    slug: 'rag-qa-education',
    name: 'Educational QA with RAG',
    tagline: 'Four chunking strategies, scored against the same questions',
    description:
      'A retrieval-augmented question answering system over grade 6 to 7 Geography and History textbooks, built four times over: sentence, token, paragraph, and hybrid chunking each get their own FAISS index so the strategies can be scored side by side in one interface.',
    liveUrl: null,
    repoUrl: null,
    tags: ['RAG', 'FAISS', 'LLaMA 3.2', 'Streamlit'],
    icon: 'book',
    accent: '#22c55e',
    featured: false,
    group: 'archive',
  },
  {
    id: 'resume-rag-chatbot',
    slug: 'resume-rag-chatbot',
    name: 'Resume-Aware RAG Chatbot',
    tagline: 'Paste a job description, get a grounded resume draft',
    description:
      'Django chatbot that retrieves from a normalized corpus of real resumes and asks a local LLaMA 3.2 to draft a resume for a given job description, with on-demand PDF export.',
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/RAG_Resume_Creator_Chatbot',
    tags: ['Django', 'RAG', 'LangChain', 'Ollama'],
    icon: 'file',
    accent: '#a855f7',
    featured: false,
    group: 'archive',
  },
];

// Convenience selectors
export const featuredProjects = projects.filter((p) => p.featured); // → landing "products"
export const liveProjects = projects.filter((p) => p.liveUrl);
export const projectsByGroup = (group) => projects.filter((p) => p.group === group);
export const projectBySlug = (slug) => projects.find((p) => p.slug === slug);
