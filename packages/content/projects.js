// Single source of truth for every BitToByte / Alex project.
//
// This ONE list feeds both sites:
//   • Portfolio (alex.bittobyte.qzz.io) renders ALL projects  → the complete catalog.
//   • Landing   (bittobyte.qzz.io)      renders featured ones → the studio's "products".
//
// So `featured: true` = "this is a polished, live product a stranger could use" and it
// appears on BOTH sites; everything else lives only on the portfolio. Add a project here
// once and it shows up in the right place automatically — no detail is ever lost, because
// the portfolio always shows the full list.
//
// `icon` is a plain string key — each app maps it to its own icon component so this
// package stays framework-agnostic (no React import here).

export const projects = [
  {
    id: 'express-entry',
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
  },
  {
    id: 'daily-checklist',
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
  },
  {
    id: 'sports-hub',
    name: 'Sports Analytics Hub',
    tagline: 'Dashboards across professional sports leagues',
    description:
      'A dynamic dashboard for exploring sports data across leagues — interactive season timeline, quick stats, and a curated list of analytics ideas, powered by Plotly visualizations.',
    liveUrl: 'https://alexmtzrmz0212.github.io/Sports/',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Sports',
    tags: ['Data Viz', 'Analytics', 'Plotly'],
    icon: 'database',
    accent: '#f97316',
    featured: true,
  },
  {
    id: 'sports-maps',
    name: 'Divisions & Leagues Maps',
    tagline: 'Interactive league maps with smart marker separation',
    description:
      'Interactive sports-league maps visualizing every team per league with smart marker separation, division path connections, and team logos — a single interactive page per sport (MLB, NFL, and more).',
    liveUrl: 'https://alexmtzrmz0212.github.io/MLB/',
    repoUrl: 'https://github.com/AlexMtzRmz0212/MLB',
    tags: ['Interactive', 'Maps', 'Data Viz'],
    icon: 'map',
    accent: '#0ea5e9',
    featured: false,
  },
  {
    id: 'mcu-timeline',
    name: 'MCU Timeline',
    tagline: 'Chronological map of the Marvel Cinematic Universe',
    description:
      'Interactive chronological visualization of Marvel Cinematic Universe releases and in-universe order.',
    liveUrl: 'https://alexmtzrmz0212.github.io/MARVEL/',
    repoUrl: 'https://github.com/AlexMtzRmz0212/MARVEL',
    tags: ['Interactive', 'Data Viz'],
    icon: 'calendar',
    accent: '#ef4444',
    featured: false,
  },
  {
    id: 'habits-analysis',
    name: 'Habits Analysis',
    tagline: 'Finding patterns in personal habits & routines',
    description:
      'Data analysis of personal habits and routines to identify patterns and areas for improvement.',
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/Habits-Tracking',
    tags: ['Data Analysis', 'Python'],
    icon: 'chart',
    accent: '#eab308',
    featured: false,
  },
  {
    id: 'tikitaka',
    name: 'Tikitaka',
    tagline: 'Reservation & tournament management for soccer facilities',
    description:
      'Web-based reservation and tournament management system for soccer facilities, with realtime scheduling.',
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/TikiTaka',
    tags: ['Full-Stack', 'SaaS', 'Realtime'],
    icon: 'activity',
    accent: '#3b82f6',
    featured: false,
  },
];

// Convenience selectors
export const featuredProjects = projects.filter((p) => p.featured); // → landing "products"
export const liveProjects = projects.filter((p) => p.liveUrl);
