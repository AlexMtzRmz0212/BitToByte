# portfolio — alex.bittobyte.qzz.io

Alejandro Martínez's personal developer portfolio (the founder persona behind BitToByte).
Mechatronics & AI engineering — experience, skills, projects, and contact.

- **Stack:** React 19 + Vite + Tailwind CSS 4, deployed on Vercel.
- **Shared brand:** consumes `@alex_mtz/bittobyte-ui` (Navbar, Footer, brand tokens) via the monorepo
  workspace link.
- **Projects:** rendered from `@bittobyte/content` — the single source of truth shared with the
  company landing page, so the two sites never drift.

## Develop

From the monorepo root:

```bash
pnpm dev --filter portfolio      # this app only
pnpm build --filter portfolio
```

Part of the [bittobyte](../../README.md) monorepo.
