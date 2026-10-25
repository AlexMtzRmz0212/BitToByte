import type { Point } from '../../data/worlds';
import { burst } from '../shared/sketch';

/** A glint in the creek under the trestle. Pan it and there is gold in the pan. */
export default function FrontierSecret({ at, found }: { at: Point; found: boolean }) {
  const { x, y } = at;
  if (!found) {
    return (
      <g className="fr-secret">
        <ellipse cx={x} cy={y + 4} rx="22" ry="7" className="fr-secret-ripple" />
        <polygon points={burst(x, y - 2, 12, 3, 4)} className="fr-glint" />
      </g>
    );
  }
  return (
    <g className="fr-gold">
      <ellipse cx={x + 10} cy={y + 12} rx="46" ry="10" className="fr-shadow" />
      <ellipse cx={x} cy={y} rx="44" ry="18" className="fr-pan" />
      <ellipse cx={x} cy={y - 2} rx="34" ry="12" className="fr-pan-inside" />
      <path d={`M${x - 10} ${y}l6 -9 10 -2 8 7 -4 8 -14 2Z`} className="fr-nugget" />
      <path d={`M${x - 4} ${y - 8}l6 -1`} className="fr-nugget-shine" />
      <polygon points={burst(x + 18, y - 22, 9, 2.5, 4)} className="fr-glint" />
      <polygon points={burst(x - 24, y - 16, 6, 2, 4)} className="fr-glint" />
    </g>
  );
}
