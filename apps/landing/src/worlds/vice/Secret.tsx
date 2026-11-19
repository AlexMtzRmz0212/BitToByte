import type { Point } from '../../data/worlds';
import { burst } from '../shared/sketch';

/** A taped-up package wedged under a mangrove dock. Open it and there is a note inside. */
export default function ViceSecret({ at, found }: { at: Point; found: boolean }) {
  const { x, y } = at;
  const dock = (
    <g>
      <rect x={x - 54} y={y + 8} width="108" height="16" className="vc-dock" />
      <path d={Array.from({ length: 9 }, (_, i) => `M${x - 48 + i * 12} ${y + 8}v16`).join('')} className="vc-plank" />
      <path d={`M${x - 46} ${y + 24}v10M${x + 46} ${y + 24}v10`} className="vc-dock-post" />
    </g>
  );
  if (!found) {
    return (
      <g className="vc-secret">
        {dock}
        <ellipse cx={x + 4} cy={y + 12} rx="20" ry="5" className="vc-shadow" />
        <path d={`M${x - 14} ${y + 10}V${y - 6}H${x + 14}V${y + 10}Z`} className="vc-package" />
        <path d={`M${x - 14} ${y - 6}l6 -6H${x + 20}l-6 6Z`} className="vc-package-top" />
        <path d={`M${x + 14} ${y + 10}V${y - 6}l6 -6V${y + 4}Z`} className="vc-package-side" />
        <path d={`M${x} ${y - 6}V${y + 10}M${x + 3} ${y - 12}l-6 6`} className="vc-tape" />
        <polygon points={burst(x + 18, y - 18, 8, 2, 4)} className="vc-glint" />
      </g>
    );
  }
  return (
    <g className="vc-found">
      {dock}
      <ellipse cx={x + 6} cy={y + 14} rx="34" ry="7" className="vc-shadow" />
      <path d={`M${x - 20} ${y + 12}V${y - 8}H${x + 20}V${y + 12}Z`} className="vc-package" />
      <path d={`M${x - 20} ${y - 8}l-12 -14H${x - 4}l-2 14Z`} className="vc-package-top" />
      <path d={`M${x + 20} ${y - 8}l10 -14H${x + 4}l2 14Z`} className="vc-package-top" />
      <g transform={`translate(${x} ${y - 30}) rotate(-8)`}>
        <rect x="-16" y="-12" width="32" height="22" className="vc-note" />
        <path d="M-10 -5h20M-10 0h14M-10 5h18" className="vc-note-ink" />
      </g>
      <polygon points={burst(x - 30, y - 40, 10, 3, 4)} className="vc-glint" />
      <polygon points={burst(x + 32, y - 34, 8, 2.4, 4)} className="vc-glint" />
    </g>
  );
}
