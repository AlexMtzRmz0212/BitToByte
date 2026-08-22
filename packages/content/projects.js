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
    slug: 'sports-analytics-hub',
    name: 'Sports Analytics Hub',
    tagline: 'Dashboards across professional sports leagues',
    description:
      'A dynamic dashboard for exploring sports data across leagues, with an interactive season timeline, quick stats, and a curated list of analytics ideas, powered by Plotly visualizations.',
    liveUrl: 'https://alexmtzrmz0212.github.io/Sports/',
    repoUrl: 'https://github.com/AlexMtzRmz0212/Sports',
    tags: ['Data Viz', 'Analytics', 'Plotly'],
    icon: 'database',
    accent: '#f97316',
    featured: false,
    group: 'experiment',
  },
  {
    id: 'sports-maps',
    slug: 'league-maps',
    name: 'Divisions & Leagues Maps',
    tagline: 'Interactive league maps with smart marker separation',
    description:
      'Interactive sports-league maps visualizing every team per league with smart marker separation, division path connections, and team logos: a single interactive page per sport (MLB, NFL, and more).',
    liveUrl: 'https://alexmtzrmz0212.github.io/MLB/',
    repoUrl: 'https://github.com/AlexMtzRmz0212/MLB',
    tags: ['Interactive', 'Maps', 'Data Viz'],
    icon: 'map',
    accent: '#0ea5e9',
    featured: false,
    group: 'experiment',
  },
  {
    id: 'habits-analysis',
    slug: 'habits-analysis',
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
    group: 'experiment',
  },

  // ---------------------------------------------------------------------------
  // Archive: finished work that is deliberately NOT hosted. Hackathon and school
  // builds depend on local GPUs, self-hosted LLMs, or a corporate tenant, so they
  // ship as case studies instead of live demos.
  // ---------------------------------------------------------------------------
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
  {
    id: 'notion-automation',
    slug: 'notion-automation',
    name: 'Notion API Automation',
    tagline: 'Two years of turning a workspace into a database',
    description:
      'A family of Python automations against the Notion API: syncing external catalogs into databases, and an AI pass that reads a task tree, assigns each leaf a hierarchy and priority, and writes the numbers back so Notion itself stays the source of truth.',
    liveUrl: null,
    repoUrl: 'https://github.com/AlexMtzRmz0212/Notion_Albums',
    tags: ['Python', 'Notion API', 'Streamlit', 'Automation'],
    icon: 'workflow',
    accent: '#eab308',
    featured: false,
    group: 'archive',
  },
];

// Convenience selectors
export const featuredProjects = projects.filter((p) => p.featured); // → landing "products"
export const liveProjects = projects.filter((p) => p.liveUrl);
export const projectsByGroup = (group) => projects.filter((p) => p.group === group);
export const projectBySlug = (slug) => projects.find((p) => p.slug === slug);
