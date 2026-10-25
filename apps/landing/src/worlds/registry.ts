import { useSyncExternalStore } from 'react';
import type { PlaceId, WorldId } from '../data/worlds';
import { hubModule } from './hub';
import type { WorldModule } from './types';

// Map modules by place. The hub is bundled (it is the landing page); each world
// is its own chunk, fetched the first time someone heads there. A world with no
// loader yet opens as the list view.

const LOADERS: Partial<Record<WorldId, () => Promise<WorldModule>>> = {
  manuscript: () => import('./manuscript').then((m) => m.default),
  voxel: () => import('./voxel').then((m) => m.default),
  noir: () => import('./noir').then((m) => m.default),
  pop: () => import('./pop').then((m) => m.default),
  frontier: () => import('./frontier').then((m) => m.default),
  sunset: () => import('./sunset').then((m) => m.default),
};

const cache = new Map<PlaceId, WorldModule>([['nexus', hubModule]]);
const pending = new Map<PlaceId, Promise<WorldModule | null>>();
const listeners = new Set<() => void>();

export const hasMap = (id: PlaceId): boolean => id === 'nexus' || id in LOADERS;

export const getModule = (id: PlaceId): WorldModule | null => cache.get(id) ?? null;

/** Fetch a place's module (once). Resolves null if the place has no map or the chunk fails. */
export function loadModule(id: PlaceId): Promise<WorldModule | null> {
  const ready = cache.get(id);
  if (ready) return Promise.resolve(ready);
  const existing = pending.get(id);
  if (existing) return existing;
  const loader = id === 'nexus' ? undefined : LOADERS[id];
  if (!loader) return Promise.resolve(null);
  const job = loader()
    .then((mod) => {
      cache.set(id, mod);
      listeners.forEach((fn) => fn());
      return mod;
    })
    .catch(() => {
      pending.delete(id);
      return null;
    });
  pending.set(id, job);
  return job;
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** The module for a place if it has loaded, re-rendering when it arrives. */
export function useModule(id: PlaceId): WorldModule | null {
  return useSyncExternalStore(
    subscribe,
    () => getModule(id),
    () => getModule(id)
  );
}
