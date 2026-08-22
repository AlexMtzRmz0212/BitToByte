# portfolio — alex.bittobyte.qzz.io

Alejandro Martínez's personal CV and project site (the founder persona behind BitToByte).
Mechatronics & AI engineering — resume, project catalog, and written case studies.

- **Stack:** React 19 + Vite + Tailwind CSS 4 + React Router, deployed on Vercel.
- **Shared brand:** consumes `@alex_mtz/bittobyte-ui` (Navbar, Footer, brand tokens) via the monorepo
  workspace link.
- **Projects:** rendered from `@bittobyte/content` — the single source of truth shared with the
  company landing page, so the two sites never drift.

## Routes

| Path | Page |
|---|---|
| `/` | Home: hero, About Me, experience strip, project catalog, contact |
| `/work` | Full catalog, including the coursework list |
| `/work/:slug` | One case study. `slug` comes from `@bittobyte/content` |
| `/resume` | Full CV: experience, education, skills, languages, additional experience |
| anything else | 404 |

Deep links need `vercel.json`, which rewrites every path to `index.html`. Without it, loading
`/work/acra-provenance` directly (rather than clicking through) 404s on Vercel.

## Where the content lives

| File | Holds |
|---|---|
| `packages/content/projects.js` | The shared project list: id, slug, group, tags, links. Also feeds the landing page. |
| `src/data/caseStudies.js` | Long-form writeups, keyed by project id. Portfolio-only. |
| `src/data/resume.js` | CV content, plus the coursework list for projects with no published code. |
| `src/components/PipelineDiagram.jsx` | Architecture diagrams, keyed by the `diagram` field on a case study. |

A project's `group` decides its presentation: `product` and `experiment` render as bento tiles,
`archive` renders as list rows leading into the writeup. Only `archive` and `product` entries
currently have case studies; the grid shows a "Case study" button wherever one exists.

## Develop

From the monorepo root:

```bash
pnpm dev --filter portfolio      # this app only
pnpm build --filter portfolio
```

Part of the [bittobyte](../../README.md) monorepo.
