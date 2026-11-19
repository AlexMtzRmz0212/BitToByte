import { useCallback } from 'react';
import {
  defaultTheme,
  hasThemes,
  isWorldId,
  resolvePlace,
  type Place,
  type PlaceId,
  type ThemeId,
  type WorldId,
} from '../data/worlds';
import { createStore, useStore } from './store';
import { emptyProgress, loadProgress, saveProgress, type FogKey, type Progress } from './persist';
import { NEXUS_ROUTE, normalizeRoute, parseRoute, routeToSearch, sameRoute, wantsWelcome, type Route } from './url';

export interface AppState {
  /** Where the URL says the visitor is. */
  route: Route;
  progress: Progress;
  /** True once the client has read stored progress (always false while prerendering). */
  ready: boolean;
  /** The URL is `/?welcome`: show the welcome even to a visitor who has seen it. */
  welcomeForced: boolean;
  /** A flight (a theme switch) is in the air: the switch is busy. */
  flying: boolean;
}

export const app = createStore<AppState>({
  route: NEXUS_ROUTE,
  progress: emptyProgress(),
  ready: false,
  welcomeForced: false,
  flying: false,
});

export const useApp = <U,>(selector: (state: AppState) => U) => useStore(app, selector);
export const useRoute = () => useApp((s) => s.route);
export const useProgress = () => useApp((s) => s.progress);

/**
 * The theme a place wears: the URL's `?theme=` while standing in that place,
 * else the visitor's remembered pick, else the default. Leonida is always Vice
 * City's. Unthemed places have none.
 */
export function themeOf(place: PlaceId, route: Route, themes: Progress['themes']): ThemeId | undefined {
  if (place === 'leonida') return 'vice';
  if (!hasThemes(place)) return undefined;
  if (route.place === place && route.theme) return route.theme;
  return (isWorldId(place) ? themes[place] : undefined) ?? defaultTheme(place);
}

export const themeFor = (state: AppState, place: PlaceId) => themeOf(place, state.route, state.progress.themes);

/** A place's theme, re-rendering when it changes. */
export const useTheme = (place: PlaceId) => useApp((s) => themeFor(s, place));

/** A place as it looks right now: names and tokens in the theme it wears. */
export function usePlaceResolver(): (id: PlaceId) => Place {
  const route = useRoute();
  const themes = useApp((s) => s.progress.themes);
  return useCallback((id) => resolvePlace(id, themeOf(id, route, themes)), [route, themes]);
}

export const usePlace = (id: PlaceId): Place => usePlaceResolver()(id);

/** Non-reactive version for art components that read it as they mount. */
export const placeNow = (id: PlaceId): Place => resolvePlace(id, themeFor(app.get(), id));

/** Read the URL into the store before the first client render, and follow back/forward. */
export function initClientRoute(): Route {
  const route = parseRoute(window.location.search);
  app.set({ route, welcomeForced: wantsWelcome(window.location.search) });
  window.addEventListener('popstate', () => {
    const { search } = window.location;
    app.set({ route: parseRoute(search), welcomeForced: wantsWelcome(search) });
  });
  return route;
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;

/** Load stored progress after hydration and save changes from then on. */
export function startProgressSync(): void {
  if (app.get().ready) return;
  const stored = loadProgress();
  // A link that names a theme (?theme=santos) is also a choice: remember it.
  const { route } = app.get();
  const forced = isWorldId(route.place) ? route.theme : undefined;
  const progress = forced ? { ...stored, themes: { ...stored.themes, [route.place]: forced } } : stored;
  app.set({ progress, ready: true });
  let last = progress;
  let dirty = forced !== undefined && stored.themes[route.place as WorldId] !== forced;
  const flush = () => {
    clearTimeout(saveTimer);
    if (dirty) saveProgress(last);
    dirty = false;
  };
  if (dirty) saveTimer = setTimeout(flush, 250);
  app.subscribe(() => {
    const next = app.get().progress;
    if (next === last) return;
    last = next;
    dirty = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 250);
  });
  // Leaving or reloading straight after a change must not lose it.
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => document.hidden && flush());
}

export type NavMode = 'push' | 'replace';

export function navigate(patch: Partial<Route>, mode: NavMode = 'push'): void {
  const current = app.get().route;
  const route = normalizeRoute({ ...current, ...patch });
  if (sameRoute(route, current)) return;
  const url = routeToSearch(route);
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
  // The new URL never carries `?welcome`.
  app.set({ route, welcomeForced: false });
  if (isWorldId(route.place)) {
    rememberWorld(route.place);
    if (route.theme) setTheme(route.place, route.theme);
  }
}

const updateProgress = (fn: (p: Progress) => Progress | null) =>
  app.set((s) => {
    const next = fn(s.progress);
    return next ? { progress: next } : {};
  });

export function rememberWorld(world: WorldId): void {
  updateProgress((p) => (p.lastWorld === world ? null : { ...p, lastWorld: world }));
}

/** Remember which theme the visitor wants for a world. */
export function setTheme(world: WorldId, theme: ThemeId): void {
  updateProgress((p) => (p.themes[world] === theme ? null : { ...p, themes: { ...p.themes, [world]: theme } }));
}

// The App owns the flight animation; the switch button only asks for one.
let flightStarter: ((to: ThemeId) => void) | null = null;

/** Called by App: where flight requests go. Returns the cleanup. */
export function registerFlightStarter(start: (to: ThemeId) => void): () => void {
  flightStarter = start;
  return () => {
    if (flightStarter === start) flightStarter = null;
  };
}

/** Ask for a theme switch (a flight). Ignored while one is already in the air. */
export function requestFlight(to: ThemeId): void {
  if (!app.get().flying) flightStarter?.(to);
}

/** Mark a district found. Returns true the first time. */
export function discover(world: WorldId, slug: string): boolean {
  const known = app.get().progress.discovered[world] ?? [];
  if (known.includes(slug)) return false;
  updateProgress((p) => ({
    ...p,
    discovered: { ...p.discovered, [world]: [...known, slug] },
  }));
  return true;
}

export function saveFog(map: FogKey, encoded: string): void {
  updateProgress((p) => (p.fog[map] === encoded ? null : { ...p, fog: { ...p.fog, [map]: encoded } }));
}

export function markIntroSeen(): void {
  updateProgress((p) => (p.introSeen ? null : { ...p, introSeen: true }));
}

/** Close the welcome and open the Citadel: remember it was seen, and drop a `?welcome` from the URL. */
export function dismissWelcome(): void {
  markIntroSeen();
  if (!app.get().welcomeForced) return;
  window.history.replaceState(null, '', routeToSearch(app.get().route));
  app.set({ welcomeForced: false });
}

/** Record an easter egg. Returns true the first time. */
export function findSecret(id: string): boolean {
  if (app.get().progress.secrets.includes(id)) return false;
  updateProgress((p) => ({ ...p, secrets: [...p.secrets, id] }));
  return true;
}
