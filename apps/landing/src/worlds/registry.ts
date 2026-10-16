import type { WorldId } from '../data/worlds';

// Lazy loaders for each world's map code. A world without an entry here has no
// map yet and opens in list view. Each loader is its own chunk, so the Nexus
// never downloads a world's art until someone heads there.

export type WorldLoader = () => Promise<unknown>;

export const WORLD_LOADERS: Partial<Record<WorldId, WorldLoader>> = {};

export const hasMap = (id: WorldId): boolean => id in WORLD_LOADERS;
