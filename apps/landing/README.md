# bittobyte.qzz.io

The BitToByte studio site: a hub (The Citadel) and six explorable map-worlds
(Hogwarts, Overworld, Gotham, New York, Blackwater and Vice City / Los Santos), each
re-theming the whole UI. Every project is also reachable as a plain list
(`/?view=list`), and the hub is prerendered so crawlers and no-JS visitors get
the full text and every link.

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

## Two themes in one world: Vice City and Los Santos

The `sunset` world (URL slug `los-santos`) has two themes. **Vice City** is the
default; **Los Santos** is the alternate. Both are fan tributes to Rockstar's games
(not affiliated with Rockstar Games), drawn from scratch.

| What | Where |
|---|---|
| Both faces (names, tokens) and both map layouts | `src/data/worlds.ts` (`WORLDS.sunset`, `.themes.santos`, `MAPS.sunset`, `THEME_MAPS`) |
| Vice City art | `src/worlds/vice/` |
| Los Santos art | `src/worlds/sunset/` |
| The state of Leonida (a second map, Vice City only) | `src/worlds/leonida/` |
| The flight animation and the switch button | `src/components/FlightTransition.tsx`, `ThemeSwitch.tsx` |

- `?theme=vice|santos` picks one; without it the visitor's remembered choice (saved in
  `localStorage` under `themes`) or the default applies. `data-world` stays `sunset`;
  `<html data-theme>` carries the variant, and the token CSS has one override rule per
  non-default theme.
- `leonida` is a place that is not a world (like the Citadel): no hub portal, projects or
  secret. Its only gate leads back to Vice City, and Vice City has the highway gate to it.
- Use `resolvePlace(id, theme)` / `usePlace(id)` for a place's name and tokens, `mapFor(place,
  theme)` for its layout and `moduleKeyFor(place, theme)` for its art chunk.
- Switching plays a flight (a plane crosses a stylized US map while the theme swaps under
  the sky); with reduced motion it is a quick fade.
- Region and district names on the Leonida and Vice City maps are limited to what Rockstar
  has announced (Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia, Mount
  Kalaga National Park); the layout is a stylized guess, not a copy of the game's map.

## Deep links

`/?world=<id>&project=<slug>&view=list|map&theme=vice|santos`. The back button walks the
history. With reduced motion on, worlds open as the list unless `view=map` is set.
`?world=leonida` opens the state map.

## The welcome

A first visit to `/` opens a full-screen welcome (`src/components/Welcome.tsx`, copy in
`site.welcome`) with three doors: the Citadel map, the plain project list, and the résumé.
Picking any door sets `introSeen` in localStorage, so it shows once; later visits to `/`
open the Citadel. It is prerendered and hidden before first paint for returning visitors
(`index.html`), is skipped by every deep link, and is absent without JavaScript.
`/?welcome` always shows it, which is the link to share and the way to test it.

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
