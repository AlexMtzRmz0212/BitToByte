import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LocateFixedIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { projectBySlug, projectsInWorld } from '../../data/projects';
import {
  MAPS,
  PLACES,
  WORLDS,
  WORLD_IDS,
  arrivalPoint,
  departureGate,
  isWorldId,
  type PlaceId,
  type Point,
} from '../../data/worlds';
import type { MapController } from '../../engine/controller';
import { FogField } from '../../engine/fog';
import { doorstep, placeProjects } from '../../engine/lots';
import { useReducedMotion } from '../../engine/motion';
import { app, discover, markIntroSeen, navigate, saveFog, useProgress, useRoute } from '../../state/app';
import type { WorldModule } from '../../worlds/types';
import IntroCard from '../IntroCard';
import ProjectCard from '../ProjectCard';
import WorldDock from '../WorldDock';
import TopHud from '../hud/TopHud';
import TravelPanel from '../hud/TravelPanel';
import Compass, { type CompassTarget } from './Compass';
import FogLayer from './FogLayer';
import MapMarker from './MapMarker';
import MapViewport from './MapViewport';
import './map.css';

interface Props {
  place: PlaceId;
  module: WorldModule;
  /** The place we came from through a portal (null on a fresh load). */
  from: PlaceId | null;
  /** Set when the URL already points elsewhere: walk to the gate, then call onDeparted. */
  departingTo: PlaceId | null;
  /** Hands over to the portal, with the gate's position on screen (where the rift opens). */
  onDeparted: (at: Point | null) => void;
}

const desktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

/**
 * One map, any world. Lays out the world module's art, labels every gate and
 * landmark, and turns URL changes into travel: picking a project walks there
 * and opens its card; picking a gate walks there and hands off to the portal.
 */
export default function MapScreen({ place, module, from, departingTo, onDeparted }: Props) {
  const route = useRoute();
  const progress = useProgress();
  const reducedMotion = useReducedMotion();
  const layout = MAPS[place];
  const world = isWorldId(place) ? place : null;
  const placed = useMemo(() => (world ? placeProjects(world) : []), [world]);

  // Where the traveler appears: at the landmark for a deep link, else at the gate we came through.
  const [start] = useState<Point>(() => {
    const target = world && route.project ? placed.find((p) => p.project.slug === route.project) : null;
    if (target && !from) return doorstep(target.at);
    return arrivalPoint(place, from);
  });
  const [arrived, setArrived] = useState<string | null>(() =>
    world && route.project && !from && placed.some((p) => p.project.slug === route.project) ? route.project : null
  );
  const [controller, setController] = useState<MapController | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [launching, setLaunching] = useState<string | null>(null);
  const travellingTo = useRef<string | null>(null);
  const settled = useRef(false);

  // Fog of war: restored from storage, cleared around where you arrive and
  // around anything already found. Purely visual; nothing under it is gated.
  const fog = useMemo(() => {
    if (!world || !module.fog || !layout.fog) return null;
    const field = new FogField(layout.size.w, layout.size.h, layout.fog.cell);
    const saved = app.get().progress;
    field.decode(saved.fog[world]);
    // A generous clearing where you arrive, so a new world never opens on a blank page.
    field.clearCircle(start.x, start.y, layout.fog.radius * 1.7);
    for (const p of placed) {
      if (saved.discovered[world]?.includes(p.project.slug)) field.clearCircle(p.at.x, p.at.y, layout.fog.radius * 0.8);
    }
    return field;
    // One field per mounted map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world]);

  const fogSave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onFogChange = useCallback(() => {
    if (!fog || !world) return;
    clearTimeout(fogSave.current);
    fogSave.current = setTimeout(() => saveFog(world, fog.encode()), 600);
  }, [fog, world]);

  // Clearing fog over a landmark counts as finding it.
  const onFogReveal = useCallback(
    (x: number, y: number, r: number) => {
      if (!world || !fog) return;
      for (const { project, at } of placed) {
        if (Math.hypot(at.x - x, at.y - y) > r + 60 || !fog.isClearAt(at.x, at.y)) continue;
        if (discover(world, project.slug)) setAnnouncement(`You found ${project.name}.`);
      }
    },
    [world, fog, placed]
  );

  // Landing straight on a project (a deep link) counts as finding it.
  useEffect(() => {
    if (world && arrived) discover(world, arrived);
    // Only for the project we started on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Coming back from a launched project (browser back, page restored from cache): clear the veil.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && setLaunching(null);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const isHub = place === 'nexus';
  const introOpen = isHub && (!progress.introSeen || aboutOpen);

  // Keep the camera's idea of "centre" clear of the panels covering the map.
  useEffect(() => {
    if (!controller) return;
    const update = () => {
      const wide = desktop();
      const { vh } = controller.size;
      controller.setInsets(
        wide
          ? { top: 72, right: 380, bottom: 88, left: introOpen ? 480 : 0 }
          : { top: 64, right: 0, bottom: introOpen ? Math.round(vh * 0.62) : 150, left: 0 }
      );
    };
    update();
    if (layout.overview) controller.fitBox(layout.overview, settled.current ? 500 : 0);
    else controller.centerOn(controller.traveler, controller.view.z, settled.current ? 500 : 0);
    settled.current = true;
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [controller, introOpen, layout.overview]);

  // Walk to a selected project.
  useEffect(() => {
    if (!controller || departingTo || !world) return;
    const target = placed.find((p) => p.project.slug === route.project);
    if (!target || travellingTo.current === target.project.slug) return;
    if (arrived === target.project.slug && !controller.travelling) return;
    travellingTo.current = target.project.slug;
    controller.travelTo(doorstep(target.at), () => {
      travellingTo.current = null;
      setArrived(target.project.slug);
      const isNew = discover(world, target.project.slug);
      const found = (progress.discovered[world]?.length ?? 0) + (isNew ? 1 : 0);
      setAnnouncement(
        `Arrived at ${target.project.name}. ${found} of ${placed.length} found in ${WORLDS[world].name}.`
      );
    });
    // Travel reacts to the URL and the controller only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, route.project, departingTo]);

  // Leaving: walk to the right gate, then hand over to the portal.
  useEffect(() => {
    if (!departingTo) return;
    if (!controller) {
      onDeparted(null);
      return;
    }
    const gate = departureGate(place, departingTo);
    if (!gate) {
      onDeparted(null);
      return;
    }
    travellingTo.current = null;
    controller.travelTo(gate, () => onDeparted(controller.toScreen(gate)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, departingTo]);

  const goTo = useCallback((target: string) => {
    if (target === 'home') {
      if (!layout.home || !controller) return;
      // The traveler parks beside the HQ (the spawn point), clear of its label.
      controller.travelTo(layout.spawn, () => setAboutOpen(true));
      return;
    }
    const [kind, id] = target.split(':') as [string, string];
    if (kind === 'gate' && (id === 'nexus' || isWorldId(id))) {
      navigate({ place: id, project: null, view: 'auto' });
    } else if (kind === 'project' && projectBySlug(id)) {
      navigate({ project: id });
    }
  }, [controller, layout.home, layout.spawn]);

  const closeIntro = useCallback(() => {
    markIntroSeen();
    setAboutOpen(false);
    document.getElementById('map-viewport')?.focus({ preventScroll: true });
  }, []);

  const closeCard = useCallback(() => {
    navigate({ project: null }, 'replace');
  }, []);

  // Launch: the camera pushes into the building, the world fades, then we go.
  const launch = useCallback(
    (project: { slug: string; liveUrl: string }) => {
      if (reducedMotion || !controller) return false;
      const target = placed.find((p) => p.project.slug === project.slug);
      if (target) controller.centerOn({ x: target.at.x, y: target.at.y - 80 }, controller.view.z * 2.4, 850);
      setLaunching(project.slug);
      window.setTimeout(() => window.location.assign(project.liveUrl), 880);
      return true;
    },
    [reducedMotion, controller, placed]
  );

  const selected = world && route.project && arrived === route.project ? projectBySlug(route.project) : undefined;

  // The compass points at the selection, else the nearest place still to find.
  const compassTarget = useMemo<CompassTarget | null>(() => {
    if (!controller) return null;
    const here = controller.traveler;
    const dist = (p: Point) => Math.hypot(p.x - here.x, p.y - here.y);
    if (world) {
      const sel = placed.find((p) => p.project.slug === route.project);
      if (sel) return { at: sel.at, label: sel.project.name, go: () => goTo(`project:${sel.project.slug}`) };
      const seen = progress.discovered[world] ?? [];
      const next = placed.filter((p) => !seen.includes(p.project.slug)).sort((a, b) => dist(a.at) - dist(b.at))[0];
      if (next) return { at: next.at, label: next.project.name, go: () => goTo(`project:${next.project.slug}`) };
      const home = layout.gates.nexus;
      return home ? { at: home, label: 'The Nexus', go: () => goTo('gate:nexus') } : null;
    }
    const open = WORLD_IDS.filter((w) => (progress.discovered[w]?.length ?? 0) < projectsInWorld(w).length)
      .map((w) => ({ w, at: layout.gates[w]! }))
      .sort((a, b) => dist(a.at) - dist(b.at))[0];
    return open ? { at: open.at, label: WORLDS[open.w].name, go: () => goTo(`gate:${open.w}`) } : null;
    // Recomputed after each arrival (arrived changes), which is when "nearest" can change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, world, route.project, progress.discovered, arrived, goTo]);

  const Terrain = module.Terrain;
  const Gate = module.Gate;
  const Landmark = module.Landmark;
  const Home = module.Home;
  const Traveler = module.Traveler;
  const Backdrop = module.Backdrop;
  const Ambient = module.Ambient;
  const Overlay = module.Overlay;
  const Scene = selected ? module.scenes?.[selected.scene] : undefined;

  const gates = Object.entries(layout.gates) as [PlaceId, Point][];

  const art = (
    <>
      <Terrain layout={layout} />
      {gates.map(([to, at]) => (
        <Gate key={to} to={to} at={at} />
      ))}
      {Home && layout.home && <Home at={layout.home} />}
      {placed.map(({ project, at }) => (
        <g key={project.slug} data-target={`project:${project.slug}`} className="landmark">
          <Landmark project={project} at={at} discovered={(progress.discovered[world!] ?? []).includes(project.slug)} />
        </g>
      ))}
    </>
  );

  const markers = (
    <>
      {gates.map(([to, at]) => {
        const count = to === 'nexus' ? null : projectsInWorld(to).length;
        const found = to === 'nexus' ? null : (progress.discovered[to]?.length ?? 0);
        return (
          <MapMarker
            key={to}
            kind="gate"
            at={at}
            lift={-118}
            label={to === 'nexus' ? 'Back to the Nexus' : isHub ? PLACES[to].name : `To ${PLACES[to].name}`}
            sub={count === null ? undefined : `${found}/${count} found`}
            ariaLabel={to === 'nexus' ? 'Portal back to the Nexus' : `Portal to ${PLACES[to].name}, ${count} projects, ${found} found`}
            onSelect={() => goTo(`gate:${to}`)}
          />
        );
      })}
      {layout.home && (
        <MapMarker
          kind="home"
          at={layout.home}
          lift={-18}
          label="BitToByte HQ"
          sub="About the studio"
          ariaLabel="BitToByte HQ: about the studio"
          onSelect={() => goTo('home')}
        />
      )}
      {placed.map(({ project, at }) => {
        const found = (progress.discovered[world!] ?? []).includes(project.slug);
        return (
          <MapMarker
            key={project.slug}
            kind="landmark"
            at={at}
            lift={module.landmarkHeight}
            label={project.name}
            state={arrived === project.slug ? 'here' : found ? 'found' : 'idle'}
            ariaLabel={`Travel to ${project.name}${found ? ', found' : ''}`}
            onSelect={() => goTo(`project:${project.slug}`)}
          />
        );
      })}
    </>
  );

  return (
    <div className="map-screen" data-place={place}>
      {Backdrop && <Backdrop />}
      <main id="main" className="contents">
        <MapViewport
          place={place}
          layout={layout}
          start={start}
          reducedMotion={reducedMotion}
          label={`Map of ${PLACES[place].name}`}
          art={art}
          markers={markers}
          traveler={<Traveler />}
          routeClass={module.routeClass}
          arriving={from !== null}
          underRoute={
            fog && module.fog && layout.fog ? (
              <FogLayer
                controller={controller}
                layout={layout}
                field={fog}
                renderer={module.fog}
                radius={layout.fog.radius}
                onReveal={onFogReveal}
                onChange={onFogChange}
              />
            ) : null
          }
          overRoute={Overlay && controller ? <Overlay controller={controller} layout={layout} /> : null}
          onReady={setController}
          onTarget={goTo}
        />
        <p id="map-keys" className="sr-only">
          Drag or use the arrow keys to look around, plus and minus to zoom, and 0 to return to the traveler.
          Choose a place from the labels on the map or from the Travel list.
        </p>
      </main>
      {Ambient && controller && <Ambient controller={controller} />}

      <TopHud place={place} onAbout={isHub ? () => setAboutOpen(true) : undefined} />

      <div className="map-tools">
        <Compass controller={controller} target={compassTarget} />
        <div className="zoom-tools chrome-pill">
          <button type="button" onClick={() => controller?.zoomBy(1.3)} aria-label="Zoom in">
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => controller?.zoomBy(0.77)} aria-label="Zoom out">
            <MinusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => controller?.recenter()} aria-label="Back to the traveler">
            <LocateFixedIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <TravelPanel
        place={place}
        open={panelOpen}
        onToggle={() => setPanelOpen((v) => !v)}
        onPick={() => setPanelOpen(false)}
      />

      <div className="dock-slot">
        <WorldDock current={place} view="auto" />
      </div>

      {introOpen && <IntroCard onExplore={closeIntro} />}
      {selected && (
        <ProjectCard project={selected} onClose={closeCard} onLaunch={launch} scene={Scene ? <Scene /> : undefined} />
      )}
      {launching && (
        <div className="launch-veil" role="status">
          <p>Opening {projectBySlug(launching)?.name}…</p>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
