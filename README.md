# BitToByte

Monorepo for the **BitToByte** web ecosystem — a shared UI library consumed by a company landing page
and a personal portfolio, all deployed independently under `*.bittobyte.qzz.io`.

## Why a monorepo

The shared component library `@alex_mtz/bittobyte-ui` was previously published to NPM and installed
separately in each site, which caused version drift (the landing page and portfolio ended up on
different versions of the same components). Here the apps consume the library through a **pnpm workspace
link**, so a change to the UI is instantly reflected everywhere — no publish/version/reinstall cycle.

The two data products (Express Entry dashboard, Daily-Checklist) live in their **own repositories** —
they are independent applications with Python backends. They still share the BitToByte brand by
installing the *published* build of `@alex_mtz/bittobyte-ui` from NPM, so all four `*.bittobyte.qzz.io`
properties render the same slim brand bar and cross-link to one another.

## Structure

```
bittobyte/
├── apps/
│   ├── landing/          → bittobyte.qzz.io       (company / studio persona)
│   └── portfolio/        → alex.bittobyte.qzz.io  (personal / founder persona)
└── packages/
    ├── ui/               @alex_mtz/bittobyte-ui   (shared components + brand, published to NPM)
    ├── content/          @bittobyte/content       (single source of truth for the projects list)
    └── eslint-config/    @bittobyte/eslint-config (shared lint rules)
```

## Tech stack

React 19 · Vite · Tailwind CSS 4 · pnpm workspaces · Turborepo · deployed on Vercel.

## Getting started

```bash
pnpm install        # install every workspace's deps and link local packages
pnpm dev            # run all apps (and the ui watcher) in parallel
pnpm build          # build ui first, then the apps (Turborepo handles ordering)
pnpm lint           # lint every workspace
```

Run a single app:

```bash
pnpm dev --filter landing
pnpm dev --filter portfolio
```

## Deployment

Each app is a separate Vercel project pointed at its own folder (`apps/landing`, `apps/portfolio`) via
the **Root Directory** setting, with `npx turbo-ignore` as the **Ignored Build Step** — so a change to
one app only redeploys that app. See `DEPLOYMENT.md` for the full setup.
