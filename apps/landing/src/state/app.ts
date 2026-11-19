import { isWorldId, type WorldId } from '../data/worlds';
import { createStore, useStore } from './store';
import { emptyProgress, loadProgress, saveProgress, type Progress } from './persist';
import { NEXUS_ROUTE, normalizeRoute, parseRoute, routeToSearch, sameRoute, wantsWelcome, type Route } from './url';

export interface AppState {
  /** Where the URL says the visitor is. */
  route: Route;
  progress: Progress;
  /** True once the client has read stored progress (always false while prerendering). */
  ready: boolean;
  /** The URL is `/?welcome`: show the welcome even to a visitor who has seen it. */
  welcomeForced: boolean;
}

export const app = createStore<AppState>({
  route: NEXUS_ROUTE,
  progress: emptyProgress(),
  ready: false,
  welcomeForced: false,
});

export const useApp = <U,>(selector: (state: AppState) => U) => useStore(app, selector);
export const useRoute = () => useApp((s) => s.route);
export const useProgress = () => useApp((s) => s.progress);

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
  const progress = loadProgress();
  app.set({ progress, ready: true });
  let last = progress;
  let dirty = false;
  const flush = () => {
    clearTimeout(saveTimer);
    if (dirty) saveProgress(last);
    dirty = false;
  };
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
  if (isWorldId(route.place)) rememberWorld(route.place);
}

const updateProgress = (fn: (p: Progress) => Progress | null) =>
  app.set((s) => {
    const next = fn(s.progress);
    return next ? { progress: next } : {};
  });

export function rememberWorld(world: WorldId): void {
  updateProgress((p) => (p.lastWorld === world ? null : { ...p, lastWorld: world }));
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

export function saveFog(world: WorldId, encoded: string): void {
  updateProgress((p) => (p.fog[world] === encoded ? null : { ...p, fog: { ...p.fog, [world]: encoded } }));
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
