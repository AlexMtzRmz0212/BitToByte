import type { Point } from '../../data/worlds';
import { burst } from '../shared/sketch';

/** A taped-up package wedged by the pier. Open it and there is a note inside. */
export default function SunsetSecret({ at, found }: { at: Point; found: boolean }) {
  const { x, y } = at;
  if (!found) {
    return (
      <g className="ls-secret">
        <ellipse cx={x + 4} cy={y + 12} rx="20" ry="5" className="ls-shadow" />
        <path d={`M${x - 14} ${y + 10}V${y - 6}H${x + 14}V${y + 10}Z`} className="ls-package" />
        <path d={`M${x - 14} ${y - 6}l6 -6H${x + 20}l-6 6Z`} className="ls-package-top" />
        <path d={`M${x + 14} ${y + 10}V${y - 6}l6 -6V${y + 4}Z`} className="ls-package-side" />
        <path d={`M${x} ${y - 6}V${y + 10}M${x + 3} ${y - 12}l-6 6`} className="ls-tape" />
        <polygon points={burst(x + 18, y - 18, 8, 2, 4)} className="ls-glint" />
      </g>
    );
  }
  return (
    <g className="ls-found">
      <ellipse cx={x + 6} cy={y + 14} rx="34" ry="7" className="ls-shadow" />
      <path d={`M${x - 20} ${y + 12}V${y - 8}H${x + 20}V${y + 12}Z`} className="ls-package" />
      <path d={`M${x - 20} ${y - 8}l-12 -14H${x - 4}l-2 14Z`} className="ls-package-top" />
      <path d={`M${x + 20} ${y - 8}l10 -14H${x + 4}l2 14Z`} className="ls-package-top" />
      <g transform={`translate(${x} ${y - 30}) rotate(-8)`}>
        <rect x="-16" y="-12" width="32" height="22" className="ls-note" />
        <path d="M-10 -5h20M-10 0h14M-10 5h18" className="ls-note-ink" />
      </g>
      <polygon points={burst(x - 30, y - 40, 10, 3, 4)} className="ls-glint" />
      <polygon points={burst(x + 32, y - 34, 8, 2.4, 4)} className="ls-glint" />
    </g>
  );
}
