import { projects, projectsInWorld } from '../../data/projects';
import { isWorldId, type PlaceId } from '../../data/worlds';
import { useProgress } from '../../state/app';

/** Discovered projects: this world's count on a world map, everything on the hub. */
export function useFound(place: PlaceId) {
  const { discovered } = useProgress();
  if (isWorldId(place)) {
    return { found: discovered[place]?.length ?? 0, total: projectsInWorld(place).length };
  }
  const found = Object.values(discovered).reduce((sum, list) => sum + (list?.length ?? 0), 0);
  return { found, total: projects.length };
}
