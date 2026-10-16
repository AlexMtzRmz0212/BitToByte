import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import type { MapLayout, PlaceId, Point } from '../../data/worlds';
import { MapController } from '../../engine/controller';

interface Props {
  place: PlaceId;
  layout: MapLayout;
  /** Where the traveler starts (read once, on mount). */
  start: Point;
  reducedMotion: boolean;
  label: string;
  /** SVG content: terrain, gates, landmarks. */
  art: ReactNode;
  /** HTML labels positioned in world units. */
  markers: ReactNode;
  /** World-space layers under the route (fog) and over it (footprints). */
  underRoute?: ReactNode;
  overRoute?: ReactNode;
  traveler: ReactNode;
  routeClass: string;
  /** Arrived through a portal: the traveler steps out. */
  arriving?: boolean;
  onReady: (controller: MapController | null) => void;
  /** Clicks on art carrying data-target="gate:<id>" | "project:<slug>" | "home". */
  onTarget: (target: string) => void;
}

/**
 * The pannable, zoomable map surface. Renders the world layer once; the
 * controller then moves it with transforms. Before hydration (and without JS)
 * CSS centres the art at a fixed zoom.
 */
export default function MapViewport({
  place,
  layout,
  start,
  reducedMotion,
  label,
  art,
  markers,
  underRoute,
  overRoute,
  traveler,
  routeClass,
  arriving = false,
  onReady,
  onTarget,
}: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const travelerEl = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const controller = useRef<MapController | null>(null);
  const startRef = useRef(start);
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
  });

  useEffect(() => {
    if (!viewport.current || !world.current || !travelerEl.current || !route.current || !reveal.current) return;
    const ctl = new MapController(
      {
        viewport: viewport.current,
        world: world.current,
        traveler: travelerEl.current,
        route: route.current,
        reveal: reveal.current,
      },
      layout.size,
      startRef.current,
      reducedMotion
    );
    controller.current = ctl;
    readyRef.current(ctl);
    return () => {
      ctl.destroy();
      controller.current = null;
      readyRef.current(null);
    };
    // The controller lives for the life of this map; layout is fixed per place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place]);

  useEffect(() => {
    controller.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const el = (event.target as Element).closest?.('[data-target]');
    if (el && viewport.current?.contains(el)) onTarget(el.getAttribute('data-target')!);
  };

  const { w, h } = layout.size;
  const maskId = `route-reveal-${place}`;

  return (
    <div
      ref={viewport}
      id="map-viewport"
      className="map-viewport"
      tabIndex={0}
      role="region"
      aria-label={label}
      aria-describedby="map-keys"
      onClick={handleClick}
    >
      <div ref={world} className="map-world" style={{ width: w, height: h }}>
        <svg className="map-art" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
          {art}
        </svg>
        {underRoute}
        <svg className="map-route" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false" data-state="idle">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
              <path ref={reveal} className="route-reveal" pathLength={1} />
            </mask>
          </defs>
          <path ref={route} className={`route ${routeClass}`} mask={`url(#${maskId})`} />
        </svg>
        {overRoute}
        {markers}
        <div
          ref={travelerEl}
          className="traveler"
          data-moving="false"
          data-arriving={arriving ? 'true' : undefined}
          style={{ transform: `translate3d(${start.x}px, ${start.y}px, 0) scale(var(--inv-z))` }}
        >
          {traveler}
        </div>
      </div>
    </div>
  );
}
