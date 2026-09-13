import { Terminal, Database, Activity, Zap, Boxes, CalendarDays, Globe } from 'lucide-react';
import { featuredProjects } from '@bittobyte/content';

// The landing page is the studio storefront: it shows only FEATURED projects
// (the polished, live "products") from the shared source of truth. The full
// catalog lives on the portfolio. Add/flag projects in @bittobyte/content;
// this file only adds the landing page's bento presentation on top.

const ICONS = {
  terminal: Terminal,
  database: Database,
  activity: Activity,
  zap: Zap,
  boxes: Boxes,
  calendar: CalendarDays,
  globe: Globe,
};

// Landing-only presentation (bento sizing + label), keyed by shared project id.
//
// Spans must sum to a multiple of the column count, or the last card is stranded
// alone on its own row. Five featured products tile flush at 2+1+1+1+1 = 6: one
// double-width card leads, and the remaining four fill the rest. The same card
// also spans both columns at `md`, which is what makes 5 cards divide evenly
// there too (2 + 1×4 = 6 cells = three full rows).
//
// Width is editorial, not a ranking: it goes to the card whose description
// needs the room.
const PRESENTATION = {
  fedethics: { className: 'md:col-span-2 lg:col-span-2', meta: 'Live' },
  'eastcoast-ev': { className: 'lg:col-span-1', meta: 'Client Work' },
  'express-entry': { className: 'lg:col-span-1', meta: 'Live' },
  'daily-checklist': { className: 'lg:col-span-1', meta: 'Live' },
  'mcu-timeline': { className: 'lg:col-span-1', meta: 'Live' },
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
