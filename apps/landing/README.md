# bittobyte.qzz.io

The BitToByte studio site: a hub (Base Camp) and four explorable map-worlds
(Inkwell, Blockport, Lamplight and Halftone), each re-theming the whole UI. Every
project is also reachable as a plain list (`/?view=list`), and the hub is
prerendered so crawlers and no-JS visitors get the full text and every link.

## Editing content

| What | Where |
|---|---|
| Project copy, links, stack tags, previews, district and scene | `src/data/projects.ts` |
| Studio copy (blurb, availability line, contact, capabilities) | `src/data/site.ts` |
| Worlds: names, theme tokens, map layout | `src/data/worlds.ts` |

Adding a project is one object in `projects.ts`. Pick an existing `district`
and `scene` id from `src/districts/archetypes.ts`; no component changes needed.
`pnpm test` checks the data (slugs, URLs, ids, contrast of every theme).

Strings marked `TODO(alex)` are drafts or open questions.

## How theming works

`src/data/worlds.ts` holds a token set per place (colors, fonts, radii, shadows,
motion timing). `src/theme/tokens.ts` turns them into one stylesheet of
`--w-*` custom properties, one rule per world, keyed on `<html data-world>`.
Tailwind maps the variables to utilities (`bg-surface`, `text-ink`,
`font-display`, `rounded-card`...), so components never mention a world.

## Deep links

`/?world=<id>&project=<slug>&view=list|map`. The back button walks the history.
With reduced motion on, worlds open as the list unless `view=map` is set.

## Scripts

```bash
pnpm dev          # Vite dev server
pnpm build        # client build, SSR build, then prerender into dist/index.html
pnpm preview      # serve dist on :4173
pnpm typecheck    # tsc
pnpm lint         # eslint
pnpm test         # vitest: data, tokens contrast, URLs, storage
pnpm e2e          # playwright against the preview build (run `pnpm build` first)
pnpm shots        # screenshots at 390 and 1440 into .shots/
```
