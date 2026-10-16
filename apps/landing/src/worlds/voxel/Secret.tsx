import type { Point } from '../../data/worlds';
import { S, isoBox } from '../shared/iso';

/** One block that glints. Tap it and eight little blocks click into one byte. */
export default function VoxelSecret({ at, found }: { at: Point; found: boolean }) {
  if (!found) {
    const b = isoBox(at.x, at.y, 1, 1, 1);
    return (
      <g className="vx-secret">
        <path d={b.left} className="vx-glint-left" />
        <path d={b.right} className="vx-glint-right" />
        <path d={b.top} className="vx-glint-top" />
        {[
          [-10, -38],
          [14, -22],
          [-2, -12],
        ].map(([dx, dy], k) => (
          <rect key={k} x={at.x + dx! - 3} y={at.y + dy! - 3} width="6" height="6" className="vx-sparkle" style={{ animationDelay: `${k * 0.5}s` }} />
        ))}
      </g>
    );
  }
  // Eight half-size cubes stacked 2 x 2 x 2: one byte.
  const cubes: { i: number; j: number; k: number }[] = [];
  for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) cubes.push({ i, j, k });
  cubes.sort((a, b) => a.k - b.k || a.i + a.j - (b.i + b.j));
  return (
    <g className="vx-byte">
      {cubes.map(({ i, j, k }, n) => {
        const x = at.x + (i - j) * 14;
        const y = at.y + (i + j) * 7 - k * S * 0.5 - 14;
        const b = isoBox(x, y, 0.5, 0.5, 0.5);
        return (
          <g key={n} className="vx-bit" style={{ animationDelay: `${n * 60}ms` }}>
            <path d={b.left} className="vx-cargo-left" />
            <path d={b.right} className="vx-cargo-right" />
            <path d={b.top} className="vx-cargo-top" />
          </g>
        );
      })}
      <text x={at.x} y={at.y - 70} textAnchor="middle" className="vx-byte-label">
        8 bits, 1 byte
      </text>
    </g>
  );
}
