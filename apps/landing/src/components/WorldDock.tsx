import { PLACES, WORLD_IDS, type PlaceId } from '../data/worlds';
import type { View } from '../state/url';
import PlaceGlyph from './PlaceGlyph';
import RouteLink from './RouteLink';

const ORDER: PlaceId[] = ['nexus', ...WORLD_IDS];

/**
 * The always-visible world switcher. Keeps the current view (map or list) and
 * drops the selection, since each world has its own map.
 */
export default function WorldDock({ current, view }: { current: PlaceId; view: View }) {
  return (
    <nav
      aria-label="Worlds"
      className="pointer-events-auto mx-auto w-max max-w-[calc(100vw-1.5rem)] rounded-control border-[length:var(--w-bw)] border-line bg-raised/95 p-1 shadow-card backdrop-blur"
    >
      <ul className="flex items-center gap-0.5">
        {ORDER.map((id) => {
          const active = id === current;
          return (
            <li key={id}>
              <RouteLink
                to={{ place: id, project: null, view: id === 'nexus' ? 'auto' : view }}
                aria-current={active ? 'page' : undefined}
                aria-label={PLACES[id].name}
                title={PLACES[id].name}
                className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-control px-2.5 text-sm font-semibold transition-colors md:px-3.5 ${
                  active ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
                }`}
              >
                <PlaceGlyph id={id} />
                <span className="hidden md:inline" aria-hidden="true">
                  {PLACES[id].short}
                </span>
              </RouteLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
