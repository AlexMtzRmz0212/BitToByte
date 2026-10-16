import { isWorldId, type WorldId } from '../data/worlds';
import { createStore, useStore } from './store';
import { emptyProgress, loadProgress, saveProgress, type Progress } from './persist';
import { NEXUS_ROUTE, normalizeRoute, parseRoute, routeToSearch, sameRoute, type Route } from './url';

export interface AppState {
  /** Where the URL says the visitor is. */
  route: Route;
  progress: Progress;
  /** True once the client has read stored progress (always false while prerendering). */
  ready: boolean;
}

export const app = createStore<AppState>({
  route: NEXUS_ROUTE,
  progress: emptyProgress(),
  ready: false,
});

export const useApp = <U,>(selector: (state: AppState) => U) => useStore(app, selector);
export const useRoute = () => useApp((s) => s.route);
export const useProgress = () => useApp((s) => s.progress);

/** Read the URL into the store before the first client render, and follow back/forward. */
export function initClientRoute(): Route {
  const route = parseRoute(window.location.search);
  app.set({ route });
  window.addEventListener('popstate', () => {
    app.set({ route: parseRoute(window.location.search) });
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
  app.subscribe(() => {
    const next = app.get().progress;
    if (next === last) return;
    last = next;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveProgress(next), 250);
  });
}

export type NavMode = 'push' | 'replace';

export function navigate(patch: Partial<Route>, mode: NavMode = 'push'): void {
  const current = app.get().route;
  const route = normalizeRoute({ ...current, ...patch });
  if (sameRoute(route, current)) return;
  const url = routeToSearch(route);
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
  app.set({ route });
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

/** Record an easter egg. Returns true the first time. */
export function findSecret(id: string): boolean {
  if (app.get().progress.secrets.includes(id)) return false;
  updateProgress((p) => ({ ...p, secrets: [...p.secrets, id] }));
  return true;
}
