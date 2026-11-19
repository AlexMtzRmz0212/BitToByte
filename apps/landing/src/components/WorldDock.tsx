import { WORLD_IDS, type PlaceId } from '../data/worlds';
import { usePlaceResolver } from '../state/app';
import type { View } from '../state/url';
import PlaceGlyph from './PlaceGlyph';
import RouteLink from './RouteLink';

const ORDER: PlaceId[] = ['nexus', ...WORLD_IDS];

/**
 * The always-visible world switcher. Keeps the current view (map or list) and
 * drops the selection, since each world has its own map.
 */
export default function WorldDock({ current, view }: { current: PlaceId; view: View }) {
  const placeOf = usePlaceResolver();
  return (
    <nav
      aria-label="Worlds"
      className="world-dock pointer-events-auto mx-auto w-max max-w-[calc(100vw-1.5rem)] rounded-control border-[length:var(--w-bw)] border-line bg-raised/95 p-1 shadow-card backdrop-blur"
    >
      <ul className="flex items-center gap-0.5">
        {ORDER.map((id) => {
          // Leonida is part of Vice City's world: standing there lights up Vice City.
          const active = id === current || (id === 'sunset' && current === 'leonida');
          const place = placeOf(id);
          return (
            <li key={id}>
              <RouteLink
                to={{ place: id, project: null, view: id === 'nexus' ? 'auto' : view }}
                aria-current={active ? 'page' : undefined}
                aria-label={place.name}
                // Overworld draws its own item tooltips; a native one would stack on top.
                title={current === 'voxel' ? undefined : place.name}
                className={`dock-slot-link flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-control px-2.5 text-sm font-semibold transition-colors md:px-3.5 ${
                  active ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
                }`}
              >
                <PlaceGlyph id={id} />
                <span className="dock-label hidden md:inline" aria-hidden="true">
                  {place.short}
                </span>
              </RouteLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
