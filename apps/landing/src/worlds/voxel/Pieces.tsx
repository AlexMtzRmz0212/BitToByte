import { PLACES } from '../../data/worlds';
import { faceQuad, isoBox } from '../shared/iso';
import type { GateProps } from '../types';

// The Voxel gate and traveler.

/** A stone frame whose pane glows in the destination's colour, shimmering in pixels. */
export function VoxelGate({ to, at }: GateProps) {
  const tint = PLACES[to].tokens.accent;
  const frame = isoBox(at.x, at.y + 30, 0.5, 2.8, 3.6);
  const pixels = Array.from({ length: 12 }, (_, k) => ({
    u0: 0.2 + (k % 4) * 0.16,
    v0: 0.15 + Math.floor(k / 4) * 0.24,
    d: (k * 0.37) % 2.4,
  }));
  return (
    <g data-target={`gate:${to}`} className="vx-gate">
      <ellipse cx={at.x} cy={at.y + 40} rx="96" ry="34" className="vx-gate-shadow" />
      <path d={frame.left} className="vx-frame-left" />
      <path d={frame.right} className="vx-frame-right" />
      <path d={frame.top} className="vx-frame-top" />
      <path d={faceQuad(at.x, at.y + 30, 0.5, 2.8, 3.6, 'right', 0.14, 0.86, 0.1, 0.88)} fill={tint} className="vx-pane" />
      {pixels.map((p, k) => (
        <path
          key={k}
          d={faceQuad(at.x, at.y + 30, 0.5, 2.8, 3.6, 'right', p.u0, p.u0 + 0.08, p.v0, p.v0 + 0.08)}
          className="vx-pane-pixel"
          style={{ animationDelay: `${-p.d}s` }}
        />
      ))}
      <rect x={at.x - 110} y={at.y - 120} width="220" height="200" fill="transparent" />
    </g>
  );
}

/** A minecart on the rails, with a little cube of cargo. */
export function Minecart() {
  const body = isoBox(0, 0, 0.9, 0.6, 0.5);
  const cargo = isoBox(0, -10, 0.45, 0.35, 0.45);
  return (
    <div className="vx-cart">
      <svg viewBox="-46 -46 92 70" width="74" height="56" aria-hidden="true" focusable="false">
        <ellipse cx="0" cy="14" rx="40" ry="10" fill="#000" opacity="0.15" />
        <path d={body.left} className="vx-cart-left" />
        <path d={body.right} className="vx-cart-right" />
        <path d={body.top} className="vx-cart-inside" />
        <path d={cargo.left} className="vx-cargo-left" />
        <path d={cargo.right} className="vx-cargo-right" />
        <path d={cargo.top} className="vx-cargo-top" />
        <rect x="-26" y="8" width="8" height="8" className="vx-wheel" />
        <rect x="-4" y="16" width="8" height="8" className="vx-wheel" />
        <rect x="18" y="8" width="8" height="8" className="vx-wheel" />
      </svg>
    </div>
  );
}
