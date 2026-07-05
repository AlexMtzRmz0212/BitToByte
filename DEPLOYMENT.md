# Deployment & migration guide

Steps **you** run (they touch GitHub, Vercel, and NPM — external accounts, not automatable from here).
The monorepo itself is already built and verified locally (`pnpm install`, `pnpm build`, `pnpm lint` all pass).

---

## 1. Create the GitHub repo and push

```bash
cd C:/Users/Alex/GitHub/bittobyte
git init
git add .
git commit -m "Initial monorepo: ui + landing + portfolio (pnpm workspaces + Turborepo)"
gh repo create AlexMtzRmz0212/bittobyte --private --source=. --remote=origin --push
```

> Note: the folder is at `C:/Users/Alex/GitHub/bittobyte` (a sibling of `MyWebsite`), because Windows is
> case-insensitive and `bittobyte` would have collided with the existing `BitToByte` repo folder.

## 2. Archive the old repos (do NOT delete)

Their history stays public; nothing is lost. On GitHub for each of **SharedUI**, **BitToByte**,
**MyPortfolio**: Settings → scroll down → **Archive this repository**.

Locally you can leave `MyWebsite/` as-is or remove the three migrated folders once the new repo is verified
live. Keep `ExpressEntryDrawsAnalysis` and `Daily-Checklist` where they are.

## 3. Vercel — reconnect the two apps to the new repo

For **each** existing project (`bittobyte.qzz.io` → landing, `alex.bittobyte.qzz.io` → portfolio):

1. Project → **Settings → Git** → disconnect the old repo, connect `AlexMtzRmz0212/bittobyte`.
2. **Settings → General → Root Directory** → set to `apps/landing` (or `apps/portfolio`).
3. Build & Output:
   - **Install Command:** `pnpm install` (run at repo root — Vercel detects the workspace automatically).
   - **Build Command:** `cd ../.. && pnpm build --filter=landing` (or `--filter=portfolio`). Turborepo
     builds the `@alex_mtz/bittobyte-ui` dependency first, then the app.
   - **Output Directory:** `dist` (default).
4. **Settings → Git → Ignored Build Step:** `npx turbo-ignore` — this makes each project redeploy **only**
   when its app (or a dependency like `ui`) actually changed. This is what preserves your independent
   per-subdomain deploys inside a monorepo.
5. Ensure the project's environment has `ENABLE_EXPERIMENTAL_COREPACK=1` **or** that the root
   `package.json` `packageManager` field (already set to `pnpm@11.10.0`) is respected — Vercel uses it to
   pick pnpm automatically.

## 4. Publish the shared UI library to NPM

The library now ships a **family cross-link footer** (`familyLinks`) so every property links to the others.
Publish a new version so the two standalone apps can pick it up:

```bash
cd C:/Users/Alex/GitHub/bittobyte/packages/ui
# bump the version first (e.g. 0.1.7 -> 0.2.0), then:
pnpm build
npm publish --access public
```

> Inside the monorepo, `landing` and `portfolio` use the local `workspace:*` link and do **not** need the
> published version. Publishing is only for the external repos in the next step.

## 5. Connect Express Entry + Daily-Checklist to the brand (separate repos)

These stay as their own repos. In **each**:

```bash
npm install @alex_mtz/bittobyte-ui@latest lucide-react
```

Then import the brand styles once and drop in the shared chrome:

```jsx
import '@alex_mtz/bittobyte-ui/styles';
import { Navbar, Footer } from '@alex_mtz/bittobyte-ui';
```

- `ui` peer-deps `react >=18`, so **no React upgrade** is needed (EE is on 18, Checklist on 19).
- The shipped `bittobyte-ui.css` carries the components' styles, so a **Tailwind-3** app renders them without
  a Tailwind upgrade. Verify visually; if any utility is missing, prefer a slim brand bar over the full nav
  (these are dense dashboards — a thin top bar + the family footer is the recommended footprint).
- The `Footer` already cross-links all four subdomains via its default `familyLinks`.

---

## Local development reference

```bash
pnpm install                 # once
pnpm dev                     # all apps + ui watcher in parallel
pnpm dev --filter landing    # one app
pnpm build                   # ui first, then apps (ordered by Turborepo)
pnpm lint
```

Editing any component in `packages/ui` is reflected in both apps immediately (they resolve it through a
local symlink, not an NPM install).
