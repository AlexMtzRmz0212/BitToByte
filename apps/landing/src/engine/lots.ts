import { projectsInWorld, type Project } from '../data/projects';
import { MAPS, type Point, type WorldId } from '../data/worlds';

export interface Placed {
  project: Project;
  at: Point;
}

/**
 * Where each of a world's projects stands. Pinned projects (`lot`) take their
 * lot first; the rest fill the remaining lots in array order. If a world ever
 * has more projects than lots, the extras are spread on a ring around the map's
 * centre, so adding a project can never break a map.
 */
export function placeProjects(world: WorldId): Placed[] {
  const map = MAPS[world];
  const projects = projectsInWorld(world);
  const taken = new Set<number>();
  const assigned = new Map<string, Point>();

  for (const p of projects) {
    if (p.lot !== undefined && map.lots[p.lot] && !taken.has(p.lot)) {
      taken.add(p.lot);
      assigned.set(p.slug, map.lots[p.lot]!);
    }
  }

  let next = 0;
  let overflow = 0;
  for (const p of projects) {
    if (assigned.has(p.slug)) continue;
    while (next < map.lots.length && taken.has(next)) next++;
    if (next < map.lots.length) {
      taken.add(next);
      assigned.set(p.slug, map.lots[next]!);
      next++;
    } else {
      const angle = overflow * 2.39996; // golden angle keeps them apart
      const radius = Math.min(map.size.w, map.size.h) * 0.3;
      assigned.set(p.slug, {
        x: Math.round(map.size.w / 2 + Math.cos(angle) * radius),
        y: Math.round(map.size.h / 2 + Math.sin(angle) * radius),
      });
      overflow++;
    }
  }

  return projects.map((project) => ({ project, at: assigned.get(project.slug)! }));
}

/** Where the traveler stands when visiting a landmark: just in front of it. */
export const doorstep = (at: Point): Point => ({ x: at.x, y: at.y + 70 });
