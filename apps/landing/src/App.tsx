import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PLACES, isWorldId, type PlaceId } from './data/worlds';
import { site } from './data/site';
import { useReducedMotion } from './engine/motion';
import { app, startProgressSync, useRoute } from './state/app';
import { loadPlaceFonts } from './theme/fonts';
import { applyPlace } from './theme/tokens';
import { getModule, hasMap, loadModule, useModule } from './worlds/registry';
import ListView from './components/ListView';
import MapScreen from './components/map/MapScreen';

// Server rendering has no layout to measure; skip the layout effect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Scene {
  /** The map on screen. Lags the URL while the traveler walks to a portal. */
  place: PlaceId;
  /** Where we came from, so we step out of the matching gate. */
  from: PlaceId | null;
}

export default function App() {
  const route = useRoute();
  const reducedMotion = useReducedMotion();
  const [scene, setScene] = useState<Scene>({ place: route.place, from: null });
  const [failed, setFailed] = useState<PlaceId | null>(null);

  const world = isWorldId(route.place) ? route.place : null;
  const showList =
    route.view === 'list' ||
    failed === route.place ||
    (world !== null && (!hasMap(world) || (route.view === 'auto' && reducedMotion)));

  // With no map on screen (a list, or a world without one) there is nothing to
  // walk across, so the scene follows the URL directly.
  if (scene.place !== route.place && (showList || !getModule(scene.place))) {
    setScene({ place: route.place, from: scene.place });
  }

  const module = useModule(scene.place);
  const departingTo = !showList && route.place !== scene.place ? route.place : null;
  const displayed = showList ? route.place : scene.place;

  useEffect(() => {
    startProgressSync();
    // The pre-paint script hid the intro for returning visitors; React owns it now.
    document.documentElement.classList.remove('intro-seen');
  }, []);

  // A deep link straight into a world: fetch its map.
  useEffect(() => {
    if (showList || module) return;
    const place = scene.place;
    void loadModule(place).then((mod) => {
      if (!mod) setFailed(place);
    });
  }, [showList, module, scene.place]);

  // Heading out: start fetching the next world while the traveler walks to the gate.
  useEffect(() => {
    if (!departingTo) return;
    void loadModule(departingTo);
    void loadPlaceFonts(departingTo);
  }, [departingTo]);

  const finishDeparture = useCallback(() => {
    const to = app.get().route.place;
    void Promise.all([loadModule(to), loadPlaceFonts(to)]).then(([mod]) => {
      if (!mod && hasMap(to)) setFailed(to);
      setScene((s) => ({ place: app.get().route.place, from: s.place }));
    });
  }, []);

  useIsoLayoutEffect(() => {
    applyPlace(displayed);
    void loadPlaceFonts(displayed);
    document.title =
      displayed === 'nexus' ? `${site.name} · ${site.tagline}` : `${PLACES[displayed].name} · ${site.name}`;
  }, [displayed]);

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

  let content;
  if (showList) {
    content = (
      <ListView
        route={route}
        notice={failed === route.place ? 'That map didn’t load, so here is everything as a list.' : undefined}
      />
    );
  } else if (module) {
    content = (
      <MapScreen
        key={scene.place}
        place={scene.place}
        module={module}
        from={scene.from}
        departingTo={departingTo}
        onDeparted={finishDeparture}
      />
    );
  } else {
    content = (
      <div className="map-loading" role="status">
        <p className="type-display text-2xl">Opening {PLACES[scene.place].name}…</p>
      </div>
    );
  }

  return (
    <>
      <a className="skip-link" href={showList ? '#main' : '#travel'}>
        {showList ? 'Skip to content' : 'Skip to the project list'}
      </a>
      {content}
    </>
  );
}
