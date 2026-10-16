import type { PlaceId } from '../data/worlds';

// Self-hosted fonts, loaded per place. The Nexus face ships with the main bundle
// (imported in main.tsx); each world's faces arrive as their own CSS chunk the
// first time someone heads there. Portal travel awaits loadPlaceFonts() while the
// screen is covered, so the swap never shows a fallback face reflowing.

const loaders: Record<PlaceId, () => Promise<unknown>> = {
  nexus: () => Promise.resolve(),
  manuscript: () =>
    Promise.all([
      import('@fontsource/im-fell-english/latin-400.css'),
      import('@fontsource/im-fell-english/latin-400-italic.css'),
      import('@fontsource-variable/eb-garamond/wght.css'),
    ]),
  voxel: () =>
    Promise.all([
      import('@fontsource-variable/pixelify-sans/wght.css'),
      import('@fontsource/atkinson-hyperlegible/latin-400.css'),
      import('@fontsource/atkinson-hyperlegible/latin-700.css'),
    ]),
  noir: () =>
    Promise.all([
      import('@fontsource-variable/antonio/wght.css'),
      import('@fontsource/courier-prime/latin-400.css'),
      import('@fontsource/courier-prime/latin-700.css'),
    ]),
  pop: () =>
    Promise.all([
      import('@fontsource/bangers/latin-400.css'),
      import('@fontsource/comic-neue/latin-400.css'),
      import('@fontsource/comic-neue/latin-700.css'),
    ]),
};

// One representative face per family, so document.fonts.load() fetches the files.
const FACES: Record<PlaceId, string[]> = {
  nexus: ['600 1em "Bricolage Grotesque Variable"'],
  manuscript: ['400 1em "IM Fell English"', '400 1em "EB Garamond Variable"'],
  voxel: ['600 1em "Pixelify Sans Variable"', '400 1em "Atkinson Hyperlegible"'],
  noir: ['600 1em "Antonio Variable"', '400 1em "Courier Prime"'],
  pop: ['400 1em "Bangers"', '400 1em "Comic Neue"'],
};

const pending = new Map<PlaceId, Promise<void>>();

/**
 * Load a place's font CSS and files, waiting at most `timeoutMs` for both.
 * Never rejects: a slow or failed font falls back to the stack in the tokens.
 */
export function loadPlaceFonts(id: PlaceId, timeoutMs = 1500): Promise<void> {
  const existing = pending.get(id);
  if (existing) return existing;
  const fetched = loaders[id]().then(() => {
    if (typeof document === 'undefined' || !document.fonts) return;
    return Promise.all(FACES[id].map((face) => document.fonts.load(face)));
  });
  // The timeout covers the CSS chunk too: a stalled request must never hold a portal shut.
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  const job = Promise.race([fetched, timeout]).then(
    () => undefined,
    () => undefined
  );
  pending.set(id, job);
  return job;
}
