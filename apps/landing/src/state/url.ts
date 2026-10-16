import { projectBySlug } from '../data/projects';
import { WORLDS, worldFromParam, type PlaceId } from '../data/worlds';

// Deep links: /?world=<world slug>&project=<project slug>&view=list|map
// The URL is the source of truth for where the visitor is. A world's old id works
// too; anything unknown falls back to the hub, so an old or mistyped link still
// lands somewhere useful.
//
// `view` is 'auto' unless the visitor chose: worlds then open as a map, or as the
// list when reduced motion is on. "Skip the map" sets 'list', "Show the map" sets
// 'map', and both stick in the URL so the back button and shared links keep them.

export type View = 'auto' | 'map' | 'list';

export interface Route {
  place: PlaceId;
  project: string | null;
  view: View;
}

export const NEXUS_ROUTE: Route = { place: 'nexus', project: null, view: 'auto' };

const isView = (value: unknown): value is View => value === 'map' || value === 'list';

export function parseRoute(search: string): Route {
  const params = new URLSearchParams(search);
  const place: PlaceId = worldFromParam(params.get('world')) ?? 'nexus';
  const rawView = params.get('view');
  let view: View = isView(rawView) ? rawView : 'auto';
  if (place === 'nexus' && view === 'map') view = 'auto';
  const slug = params.get('project');
  // The Nexus itself has no selection; a world or any list view can.
  const project = projectBySlug(slug) && (place !== 'nexus' || view === 'list') ? slug : null;
  return { place, project, view };
}

export function routeToSearch(route: Route): string {
  const params = new URLSearchParams();
  if (route.place !== 'nexus') params.set('world', WORLDS[route.place].slug);
  if (route.project) params.set('project', route.project);
  if (route.view !== 'auto' && !(route.place === 'nexus' && route.view === 'map')) {
    params.set('view', route.view);
  }
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

/** Normalize a route the same way parseRoute would, so links and state agree. */
export const normalizeRoute = (route: Route): Route => parseRoute(routeToSearch(route).slice(1));

export const sameRoute = (a: Route, b: Route) =>
  a.place === b.place && a.project === b.project && a.view === b.view;
