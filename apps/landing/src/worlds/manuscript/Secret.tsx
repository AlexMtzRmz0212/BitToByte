import type { Point } from '../../data/worlds';
import { burst } from '../shared/sketch';
import { INK, OXBLOOD, PAPER, PAPER_DARK } from './ink';

/**
 * The bottom-right corner of the sheet, folded over and sealed. Lift it and
 * the seal breaks, showing a note written in the margin.
 */
export default function ManuscriptSecret({ found }: { at: Point; found: boolean }) {
  if (!found) {
    return (
      <g className="ms-dogear">
        <path d="M2176 1356L2176 1476 2056 1476Z" fill={PAPER_DARK} />
        <path d="M2176 1356L2056 1476 2088 1386Z" fill="#D9C08E" stroke="#7A5A32" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="2104" cy="1420" r="15" fill={OXBLOOD} stroke="#4E1212" strokeWidth="2" />
        <polygon points={burst(2104, 1420, 8, 3, 4)} fill="#F6EBD3" opacity="0.8" />
      </g>
    );
  }
  return (
    <g className="ms-margin-note" transform="rotate(-4 2015 1375)">
      <path d="M1880 1300h270v150h-270z" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <text x="2015" y="1350" textAnchor="middle" className="ms-label ms-label-small">
        you read the margins.
      </text>
      <text x="2015" y="1384" textAnchor="middle" className="ms-label ms-label-small">
        most people never do.
      </text>
      <path d="M1950 1410q65 14 130 0" fill="none" stroke={INK} strokeWidth="1.5" />
      <path d="M2122 1428a15 15 0 0 1 0 -30M2128 1398a15 15 0 0 1 0 30" fill="none" stroke={OXBLOOD} strokeWidth="5" />
    </g>
  );
}
