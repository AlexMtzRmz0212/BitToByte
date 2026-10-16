import { WORLDS, isWorldId, type PlaceId } from '../../data/worlds';
import { useFound } from './useFound';

export default function FoundCounter({ place }: { place: PlaceId }) {
  const { found, total } = useFound(place);
  const where = isWorldId(place) ? `in ${WORLDS[place].name}` : 'across all worlds';
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
