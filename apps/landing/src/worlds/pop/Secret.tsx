import type { Point } from '../../data/worlds';
import { burst } from '../shared/sketch';

/** A tiny starburst hiding in a gutter. Pop it and you get a bonus panel. */
export default function PopSecret({ at, found }: { at: Point; found: boolean }) {
  if (!found) {
    return (
      <g className="pp-secret">
        <polygon points={burst(at.x, at.y, 22, 11, 10)} fill="#FFD400" stroke="#161616" strokeWidth="3" strokeLinejoin="round" />
        <text x={at.x} y={at.y + 7} textAnchor="middle" className="pp-secret-mark">
          ?
        </text>
      </g>
    );
  }
  return (
    <g className="pp-bonus">
      <rect x={at.x - 110} y={at.y - 70} width="220" height="140" fill="#FF8FB1" stroke="#161616" strokeWidth="7" />
      <polygon points={burst(at.x, at.y, 70, 40, 14)} fill="#FFD400" stroke="#161616" strokeWidth="4" strokeLinejoin="round" />
      <text x={at.x} y={at.y + 14} textAnchor="middle" className="pp-sfx pp-bonus-text">
        BONUS!
      </text>
    </g>
  );
}
