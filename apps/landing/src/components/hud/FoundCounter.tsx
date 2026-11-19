import { isWorldId, type PlaceId } from '../../data/worlds';
import { usePlaceResolver } from '../../state/app';
import { useFound } from './useFound';

export default function FoundCounter({ place }: { place: PlaceId }) {
  // Leonida is part of Vice City's world: it counts Vice City's projects.
  const scope: PlaceId = place === 'leonida' ? 'sunset' : place;
  const { found, total } = useFound(scope);
  const placeOf = usePlaceResolver();
  const where = isWorldId(scope) ? `in ${placeOf(scope).name}` : 'across all worlds';
  const pct = total ? Math.round((found / total) * 100) : 0;
  return (
    <p className="found-counter chrome-pill" title={`${found} of ${total} projects found ${where}`}>
      <span className="found-bar" aria-hidden="true">
        <span className="found-fill" style={{ width: `${pct}%` }} />
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {found}/{total}
        <span className="hidden sm:inline"> found</span>
      </span>
      <span className="sr-only">
        {found} of {total} projects found {where}.
      </span>
    </p>
  );
}
