import { BitToByteMark } from '@alex_mtz/bittobyte-ui';
import { PLACES } from '../../data/worlds';
import { spiralArm } from '../shared/sketch';
import Particles, { type ParticleKind } from '../shared/Particles';
import type { GateProps } from '../types';

// Gotham: the gate, the traveler, and the sky effects (rain,
// searchlights, and the studio's own signal on the clouds).

const ARMS = [0, 1, 2].map((i) => spiralArm(0, 0, 52, 1.2, (i * Math.PI * 2) / 3, 30));

/** An art-deco archway full of turning mist, with the destination's colour at its eye. */
export function NoirGate({ to, at }: GateProps) {
  const tint = PLACES[to].tokens.accent;
  const id = `nr-arch-${to}`;
  return (
    <g transform={`translate(${at.x} ${at.y})`} data-target={`gate:${to}`} className="nr-gate">
      <defs>
        <clipPath id={id}>
          <path d="M-44 70V-40Q-44 -96 0 -104Q44 -96 44 -40V70Z" />
        </clipPath>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0" stopColor={tint} stopOpacity="0.9" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cy="74" rx="90" ry="16" className="nr-gate-glow" />
      <path d="M-44 70V-40Q-44 -96 0 -104Q44 -96 44 -40V70Z" className="nr-arch-void" />
      <g clipPath={`url(#${id})`}>
        <circle cy="-10" r="64" fill={`url(#${id}-eye)`} />
        <g className="nr-vortex" style={{ transformOrigin: '0px -10px' }}>
          {ARMS.map((d, k) => (
            <path key={k} d={d} transform="translate(0 -10)" className="nr-vortex-arm" />
          ))}
        </g>
      </g>
      {/* deco frame with a sunburst crown */}
      <path d="M-62 70V-40Q-62 -118 0 -128Q62 -118 62 -40V70H44V-40Q44 -96 0 -104Q-44 -96 -44 -40V70Z" className="nr-arch" />
      <path d="M0 -128V-160M-22 -124l-14 -26M22 -124l14 -26M-40 -112l-26 -18M40 -112l26 -18" className="nr-sunburst" />
      <path d="M-72 70H72" className="nr-arch-step" />
      <rect x="-80" y="-170" width="160" height="250" fill="transparent" />
    </g>
  );
}

/** An amber beacon whose cone of light sweeps ahead of it. */
export function Beacon() {
  return (
    <div className="nr-beacon">
      <span className="nr-cone-turn">
        <span className="nr-cone" />
      </span>
      <span className="nr-orb" />
    </div>
  );
}

const rain: ParticleKind = {
  density: 9,
  max: 260,
  spawn: (rand, w, h) => ({
    x: rand() * (w + 200),
    y: rand() * h - h,
    vx: -0.22,
    vy: 0.95 + rand() * 0.4,
    size: 10 + rand() * 12,
    phase: rand(),
    life: 0,
  }),
  step: (p, dt, _w, h) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    return p.y < h + 30;
  },
  draw: (ctx, p) => {
    ctx.globalAlpha = 0.18 + p.phase * 0.22;
    ctx.strokeStyle = '#9FB3D1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.vx * p.size, p.y + p.vy * p.size);
    ctx.stroke();
  },
};

/** Screen-space effects over the city: searchlights, the signal on the clouds, rain. */
export function NoirSkyFx() {
  return (
    <div className="nr-fx" aria-hidden="true">
      <div className="nr-clouds" />
      <div className="nr-searchlight nr-searchlight-a" />
      <div className="nr-searchlight nr-searchlight-b" />
      <div className="nr-signal-beam" />
      <div className="nr-signal">
        <BitToByteMark className="nr-signal-mark" />
      </div>
      <Particles kind={rain} />
    </div>
  );
}

/** Behind the city: the night sky beyond the map's edges. */
export function NoirBackdrop() {
  return <div className="nr-backdrop" aria-hidden="true" />;
}
