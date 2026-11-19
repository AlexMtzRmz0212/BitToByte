import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { resolvePlace, type PlaceId, type Point, type ThemeId } from './data/worlds';
import { site } from './data/site';
import { useReducedMotion } from './engine/motion';
import {
  app,
  navigate,
  registerFlightStarter,
  setTheme,
  startProgressSync,
  themeFor,
  useApp,
  useRoute,
  useTheme,
} from './state/app';
import { loadPlaceFonts } from './theme/fonts';
import { applyPlace } from './theme/tokens';
import { getModule, hasMap, loadModule, moduleKeyFor, useModule } from './worlds/registry';
import FlightTransition, { type Flight } from './components/FlightTransition';
import ListView from './components/ListView';
import MapScreen from './components/map/MapScreen';
import RiftTransition, { type Rift } from './components/RiftTransition';
import RouteLink from './components/RouteLink';
import Welcome from './components/Welcome';

// Server rendering has no layout to measure; skip the layout effect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** How long a covered portal waits for the next map's code before showing its loading screen. */
const MAP_WAIT_MS = 1500;

/** How long the plane stays in the air at least (the flight's covered phase). */
const CRUISE_MS = 1300;

/** `promise`'s value, or undefined if it takes longer than `ms`. */
const within = <T,>(promise: Promise<T>, ms: number) =>
  Promise.race([promise, new Promise<undefined>((resolve) => setTimeout(resolve, ms))]);

/** The module that draws a place in the theme it wears right now. */
const keyFor = (place: PlaceId) => moduleKeyFor(place, themeFor(app.get(), place));

interface Scene {
  /** The map on screen. Lags the URL while the traveler walks to a portal. */
  place: PlaceId;
  /** Where we came from, so we step out of the matching gate. The same place: a flight. */
  from: PlaceId | null;
}

export default function App() {
  const route = useRoute();
  const reducedMotion = useReducedMotion();
  const [scene, setScene] = useState<Scene>({ place: route.place, from: null });
  const [failed, setFailed] = useState<PlaceId | null>(null);
  const [rift, setRift] = useState<Rift | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const sceneRef = useRef(scene);
  const riftRef = useRef(rift);
  const flightRef = useRef(flight);
  useEffect(() => {
    sceneRef.current = scene;
    riftRef.current = rift;
    flightRef.current = flight;
  });

  // The welcome sits over the hub for a first-time visitor (the prerendered HTML
  // includes it; the client starts with nothing seen, so hydration matches) or
  // when the URL is /?welcome. Deep links into a world or the list never get it.
  const introSeen = useApp((s) => s.progress.introSeen);
  const welcomeForced = useApp((s) => s.welcomeForced);
  const welcomeOpen = route.place === 'nexus' && route.view === 'auto' && (!introSeen || welcomeForced);
  // Everything behind the welcome is out of reach until a door is picked. Only
  // once the client has taken over: the prerendered document has to stay usable
  // without JavaScript.
  const ready = useApp((s) => s.ready);

  // The theme each place wears: the URL's place, and the (possibly older) scene's.
  const routeTheme = useTheme(route.place);
  const sceneTheme = useTheme(scene.place);

  const showList =
    route.view === 'list' ||
    failed === route.place ||
    (route.place !== 'nexus' &&
      (!hasMap(moduleKeyFor(route.place, routeTheme)) || (route.view === 'auto' && reducedMotion)));

  const sceneKey = moduleKeyFor(scene.place, sceneTheme);

  // With no map on screen (a list, or a world without one) there is nothing to
  // walk across, so the scene follows the URL directly.
  if (scene.place !== route.place && (showList || !getModule(sceneKey))) {
    setScene({ place: route.place, from: scene.place });
  }

  const module = useModule(sceneKey);
  const departingTo = !showList && route.place !== scene.place ? route.place : null;
  const displayed = showList ? route.place : scene.place;
  const displayedTheme = useTheme(displayed);

  useEffect(() => {
    startProgressSync();
    // The pre-paint script hid the intro for returning visitors; React owns it now.
    document.documentElement.classList.remove('intro-seen');
  }, []);

  // A deep link straight into a world: fetch its map.
  useEffect(() => {
    if (showList || module) return;
    const place = scene.place;
    void loadModule(sceneKey).then((mod) => {
      if (!mod) setFailed(place);
    });
  }, [showList, module, scene.place, sceneKey]);

  // Heading out: start fetching the next world while the traveler walks to the gate.
  useEffect(() => {
    if (!departingTo) return;
    void loadModule(keyFor(departingTo));
    void loadPlaceFonts(departingTo, themeFor(app.get(), departingTo));
  }, [departingTo]);

  // Each rift has an id, so a late step from one trip (say, the arrival rift
  // still closing when Back is pressed) can never move the next trip's rift.
  const riftSeq = useRef(0);

  // The traveler reached the gate: open the rift there.
  const finishDeparture = useCallback((at: Point | null) => {
    const to = app.get().route.place;
    riftSeq.current += 1;
    setRift({ id: riftSeq.current, from: sceneRef.current.place, to, at, phase: 'opening' });
  }, []);

  // Fully covered: wait (briefly) for the next world's code and fonts, swap,
  // then reveal it. A map still downloading after that shows its loading screen
  // instead, so a slow network never leaves the screen covered.
  const riftCovered = useCallback((id: number) => {
    const to = app.get().route.place;
    setRift((r) => (r && r.id === id ? { ...r, to, phase: 'covered' } : r));
    void Promise.all([
      within(loadModule(keyFor(to)), MAP_WAIT_MS),
      loadPlaceFonts(to, themeFor(app.get(), to)),
    ]).then(([mod]) => {
      if (riftSeq.current !== id) return;
      // null: the chunk failed outright (undefined: still on its way).
      if (mod === null && hasMap(keyFor(to))) setFailed(to);
      setScene((s) => ({ place: app.get().route.place, from: s.place }));
      // Two frames: the new map mounts and centres its camera before the reveal.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setRift((r) => (r && r.id === id ? { ...r, phase: 'closing' } : r)))
      );
    });
  }, []);

  const riftDone = useCallback((id: number) => setRift((r) => (r && r.id === id ? null : r)), []);

  // Flights: a theme switch. The same shape as a rift (ids guard late steps), but
  // it stays in the air a minimum time and swaps the theme, not the place. Only
  // Los Santos / Vice City / Leonida have themes.
  const flightSeq = useRef(0);
  // Ends the current flight's cruise early (tap or Escape); `skipped` remembers a
  // skip that came before the cruise began.
  const flightSkip = useRef<{ id: number; fn: (() => void) | null }>({ id: 0, fn: null });
  const skipped = useRef(0);
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  });

  const startFlight = useCallback((to: ThemeId) => {
    const { route: now, flying } = app.get();
    if (flying || riftRef.current || sceneRef.current.place !== now.place) return;
    if (now.place !== 'sunset' && now.place !== 'leonida') return;
    const from = themeFor(app.get(), now.place) ?? 'vice';
    if (from === to) return;
    flightSeq.current += 1;
    app.set({ flying: true });
    setFlight({ id: flightSeq.current, from, to, phase: 'opening' });
    // Start fetching the destination's map and fonts while the plane taxis.
    void loadModule(moduleKeyFor('sunset', to));
    void loadPlaceFonts('sunset', to);
  }, []);

  useEffect(() => registerFlightStarter(startFlight), [startFlight]);

  const flightCovered = useCallback((id: number) => {
    const current = flightRef.current;
    if (!current || current.id !== id) return;
    const { to } = current;
    setFlight((f) => (f && f.id === id ? { ...f, phase: 'covered' } : f));
    const dwell = new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, reducedMotionRef.current ? 0 : CRUISE_MS);
      const finish = () => {
        clearTimeout(timer);
        resolve();
      };
      flightSkip.current = { id, fn: finish };
      // Skipped before the cruise began.
      if (skipped.current === id) finish();
    });
    void Promise.all([
      within(loadModule(moduleKeyFor('sunset', to)), MAP_WAIT_MS),
      loadPlaceFonts('sunset', to),
      dwell,
    ]).then(([mod]) => {
      if (flightSeq.current !== id) return;
      const here = app.get().route.place;
      if (here === 'sunset' || here === 'leonida') {
        if (mod === null) setFailed('sunset');
        // One tick: the theme, the URL and the scene change together, so the new
        // map mounts once, already knowing it arrived by air.
        setTheme('sunset', to);
        navigate({ place: 'sunset', theme: to, ...(here === 'leonida' ? { project: null } : {}) }, 'replace');
        setScene({ place: 'sunset', from: 'sunset' });
      }
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setFlight((f) => (f && f.id === id ? { ...f, phase: 'closing' } : f)))
      );
    });
  }, []);

  const flightSkipNow = useCallback((id: number) => {
    skipped.current = id;
    if (flightSkip.current.id === id) flightSkip.current.fn?.();
  }, []);

  const flightDone = useCallback((id: number) => {
    setFlight((f) => (f && f.id === id ? null : f));
    if (flightSeq.current === id) app.set({ flying: false });
  }, []);

  useIsoLayoutEffect(() => {
    applyPlace(displayed, displayedTheme);
    void loadPlaceFonts(displayed, displayedTheme);
    document.title =
      displayed === 'nexus'
        ? `${site.name} · ${site.tagline}`
        : `${resolvePlace(displayed, displayedTheme).name} · ${site.name}`;
  }, [displayed, displayedTheme]);

  // Switching between list and map starts at the top; the first render keeps
  // the browser's own scroll restoration.
  const firstRender = useRef(true);
  useIsoLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [showList, displayed]);

  // Leonida has no projects to list: its list view is Vice City's.
  const listRoute =
    route.place === 'leonida' ? { ...route, place: 'sunset' as const, theme: 'vice' as const } : route;

  let content;
  if (showList) {
    content = (
      <ListView
        route={listRoute}
        notice={failed === route.place ? 'That map didn’t load, so here is everything as a list.' : undefined}
      />
    );
  } else if (module) {
    content = (
      <MapScreen
        key={`${scene.place}:${sceneTheme ?? ''}`}
        place={scene.place}
        theme={sceneTheme}
        module={module}
        from={scene.from}
        departingTo={departingTo}
        onDeparted={finishDeparture}
      />
    );
  } else {
    content = (
      <div className="map-loading">
        <p className="type-display text-2xl" role="status">
          Opening {resolvePlace(scene.place, sceneTheme).name}…
        </p>
        <RouteLink to={{ ...route, place: scene.place, view: 'list' }} className="btn">
          Show its projects as a list
        </RouteLink>
      </div>
    );
  }

  return (
    <>
      {welcomeOpen && <Welcome />}
      <div className="app-behind" inert={ready && welcomeOpen}>
        <a className="skip-link" href={showList ? '#main' : '#travel'}>
          {showList ? 'Skip to content' : 'Skip to the project list'}
        </a>
        {content}
        {rift && (
          <RiftTransition rift={rift} reducedMotion={reducedMotion} onCovered={riftCovered} onDone={riftDone} />
        )}
        {flight && (
          <FlightTransition
            flight={flight}
            reducedMotion={reducedMotion}
            onCovered={flightCovered}
            onDone={flightDone}
            onSkip={flightSkipNow}
          />
        )}
      </div>
    </>
  );
}
