import { projectBySlug } from '../data/projects';
import { isWorldId, WORLD_IDS, type WorldId } from '../data/worlds';

// Exploration progress, kept in one versioned localStorage key. Storage can be
// missing, blocked or full (private mode, previews, strict settings), so every
// access is wrapped and the site behaves exactly the same without it: progress
// just starts fresh.

export const STORAGE_KEY = 'bittobyte-multiverse-v1';

export interface Progress {
  /** Discovered project slugs, per world. */
  discovered: Partial<Record<WorldId, string[]>>;
  /** Cleared fog cells, per world, as an opaque encoded bitset. */
  fog: Partial<Record<WorldId, string>>;
  /** Easter-egg ids found anywhere. */
  secrets: string[];
  /** The last world visited. */
  lastWorld: WorldId | null;
  /** The intro card has been dismissed once; returning visitors land on the map. */
  introSeen: boolean;
}

export const emptyProgress = (): Progress => ({
  discovered: {},
  fog: {},
  secrets: [],
  lastWorld: null,
  introSeen: false,
});

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function browserStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

const stringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

/** Keep only data this version understands; drop anything unknown or stale. */
export function sanitizeProgress(value: unknown): Progress {
  const out = emptyProgress();
  if (!value || typeof value !== 'object') return out;
  const data = value as Record<string, unknown>;
  const discovered = (data.discovered ?? {}) as Record<string, unknown>;
  const fog = (data.fog ?? {}) as Record<string, unknown>;
  for (const id of WORLD_IDS) {
    const slugs = [...new Set(stringList(discovered[id]))].filter((s) => projectBySlug(s)?.world === id);
    if (slugs.length) out.discovered[id] = slugs;
    if (typeof fog[id] === 'string') out.fog[id] = fog[id];
  }
  out.secrets = [...new Set(stringList(data.secrets))];
  out.lastWorld = isWorldId(data.lastWorld) ? data.lastWorld : null;
  out.introSeen = data.introSeen === true;
  return out;
}

export function loadProgress(storage: StorageLike | null = browserStorage()): Progress {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    return raw ? sanitizeProgress(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress, storage: StorageLike | null = browserStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ v: 1, ...progress }));
  } catch {
    /* blocked or full: progress lives for this visit only */
  }
}
