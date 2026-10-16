import { SECRET_IDS, WORLD_IDS, WORLDS } from '../../data/worlds';
import { useProgress } from '../../state/app';
import PlaceGlyph from '../PlaceGlyph';

/** "Secrets n/4": one slot per world, lit when that world's secret is found. */
export default function SecretsCounter() {
  const { secrets } = useProgress();
  const found = WORLD_IDS.filter((id) => secrets.includes(SECRET_IDS[id]));
  const label = `Secrets found: ${found.length} of ${WORLD_IDS.length}.`;
  const hint = found.length
    ? ` Found in ${found.map((id) => WORLDS[id].name).join(', ')}.`
    : ' One hides in each world.';
  return (
    <p className="flex min-h-11 items-center gap-2 rounded-control px-2 text-sm text-muted" title={label + hint}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {WORLD_IDS.map((id) => (
          <PlaceGlyph
            key={id}
            id={id}
            className={`h-3.5 w-3.5 ${found.includes(id) ? 'text-deco-3' : 'opacity-40'}`}
          />
        ))}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        <span className="hidden sm:inline">Secrets </span>
        {found.length}/{WORLD_IDS.length}
      </span>
      <span className="sr-only">
        {label}
        {hint}
      </span>
    </p>
  );
}
