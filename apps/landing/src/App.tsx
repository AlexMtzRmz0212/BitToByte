import { useEffect, useLayoutEffect, useRef } from 'react';
import { PLACES, isWorldId } from './data/worlds';
import { site } from './data/site';
import { useReducedMotion } from './engine/motion';
import { startProgressSync, useRoute } from './state/app';
import { loadPlaceFonts } from './theme/fonts';
import { applyPlace } from './theme/tokens';
import { hasMap } from './worlds/registry';
import ListView from './components/ListView';
import Nexus from './components/nexus/Nexus';

// Server rendering has no layout to measure; skip the layout effect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function App() {
  const route = useRoute();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    startProgressSync();
  }, []);

  useIsoLayoutEffect(() => {
    applyPlace(route.place);
    void loadPlaceFonts(route.place);
    document.title =
      route.place === 'nexus'
        ? `${site.name} · ${site.tagline}`
        : `${PLACES[route.place].name} · ${site.name}`;
  }, [route.place]);

  // Changing place or view starts at the top; the first render keeps the
  // browser's own scroll restoration.
  const firstRender = useRef(true);
  useIsoLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [route.place, route.view]);

  const world = isWorldId(route.place) ? route.place : null;
  const showList =
    route.view === 'list' ||
    (world !== null && (!hasMap(world) || (route.view === 'auto' && reducedMotion)));

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {showList ? <ListView route={route} /> : <Nexus />}
    </>
  );
}
