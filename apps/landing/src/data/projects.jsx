import { Terminal, Database, Activity, Zap, Boxes } from 'lucide-react';
import { featuredProjects } from '@bittobyte/content';

// The landing page is the studio storefront: it shows only FEATURED projects
// (the polished, live "products") from the shared source of truth. The full
// catalog lives on the portfolio. Add/flag projects in @bittobyte/content —
// this file only adds the landing page's bento presentation on top.

const ICONS = {
  terminal: Terminal,
  database: Database,
  activity: Activity,
  zap: Zap,
  boxes: Boxes,
};

// Landing-only presentation (bento sizing + label), keyed by shared project id.
const PRESENTATION = {
  'eastcoast-ev': { className: 'lg:col-span-2 lg:row-span-2', meta: 'Client Work' },
  'express-entry': { className: 'lg:col-span-1', meta: 'Live' },
  'daily-checklist': { className: 'lg:col-span-1', meta: 'Live' },
};

export const projects = featuredProjects.map((p) => {
  const Icon = ICONS[p.icon] ?? Boxes;
  const pres = PRESENTATION[p.id] ?? { className: 'lg:col-span-2', meta: 'Product' };
  return {
    id: p.id,
    title: p.name,
    description: p.description,
    url: p.liveUrl ?? p.repoUrl,
    icon: <Icon className="w-6 h-6" />,
    tags: p.tags,
    accent: p.accent,
    featured: p.featured,
    className: pres.className,
    meta: pres.meta,
  };
});
