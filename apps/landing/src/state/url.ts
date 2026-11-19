import { projectBySlug } from '../data/projects';
import { hasThemes, isThemeId, placeFromParam, slugOf, type PlaceId, type ThemeId } from '../data/worlds';

// Deep links: /?world=<world slug>&project=<project slug>&view=list|map&theme=<theme>
// The URL is the source of truth for where the visitor is. A world's old id works
// too; anything unknown falls back to the hub, so an old or mistyped link still
// lands somewhere useful.
//
// `view` is 'auto' unless the visitor chose: worlds then open as a map, or as the
// list when reduced motion is on. "Skip the map" sets 'list', "Show the map" sets
// 'map', and both stick in the URL so the back button and shared links keep them.
//
// `theme` only means something for a world with more than one (Los Santos: vice
// or santos). Without it the visitor's remembered choice, else the default, applies.

export type View = 'auto' | 'map' | 'list';

export interface Route {
  place: PlaceId;
  project: string | null;
  view: View;
  /** Which theme of a themed world; absent means "the remembered or default one". */
  theme?: ThemeId;
}

export const NEXUS_ROUTE: Route = { place: 'nexus', project: null, view: 'auto' };

const isView = (value: unknown): value is View => value === 'map' || value === 'list';

export function parseRoute(search: string): Route {
  const params = new URLSearchParams(search);
  let place: PlaceId = placeFromParam(params.get('world')) ?? 'nexus';
  const rawView = params.get('view');
  let view: View = isView(rawView) ? rawView : 'auto';
  if (place === 'nexus' && view === 'map') view = 'auto';
  const rawTheme = params.get('theme');
  let theme: ThemeId | undefined = isThemeId(rawTheme) ? rawTheme : undefined;
  // Leonida has no projects to list: its list view is Vice City's.
  if (place === 'leonida' && view === 'list') {
    place = 'sunset';
    theme = 'vice';
  }
  const slug = params.get('project');
  // The Nexus itself has no selection (a world or any list view can), and Leonida has no projects.
  const project = projectBySlug(slug) && place !== 'leonida' && (place !== 'nexus' || view === 'list') ? slug : null;
  const route: Route = { place, project, view };
  if (theme && hasThemes(place)) route.theme = theme;
  return route;
}

export function routeToSearch(route: Route): string {
  const params = new URLSearchParams();
  if (route.place !== 'nexus') params.set('world', slugOf(route.place));
  if (route.project) params.set('project', route.project);
  if (route.view !== 'auto' && !(route.place === 'nexus' && route.view === 'map')) {
    params.set('view', route.view);
  }
  if (route.theme && hasThemes(route.place)) params.set('theme', route.theme);
  const query = params.toString();
  return query ? `/?${query}` : '/';
}

/** `/?welcome` asks for the welcome even if this visitor has seen it. It is not part of the route. */
export const wantsWelcome = (search: string) => new URLSearchParams(search).has('welcome');

/** Normalize a route the same way parseRoute would, so links and state agree. */
export const normalizeRoute = (route: Route): Route => parseRoute(routeToSearch(route).slice(1));

export const sameRoute = (a: Route, b: Route) =>
  a.place === b.place && a.project === b.project && a.view === b.view && a.theme === b.theme;
