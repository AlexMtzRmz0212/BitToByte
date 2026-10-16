import type { CSSProperties } from 'react';
import Particles, { type ParticleKind } from '../shared/Particles';

// The sky keeps the visitor's own time: one full day passes every three
// minutes, but it starts at the hour it is where you are, so a late-night
// visit opens on stars and fireflies. Under reduced motion it stays daytime.

const CYCLE_S = 180;

/** Negative animation delay that puts the cycle at the visitor's local time. */
function cycleDelay(): string {
  if (typeof window === 'undefined') return '0s';
  const now = new Date();
  const day = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86400;
  // The cycle starts at 07:00 (morning).
  const phase = (day - 7 / 24 + 1) % 1;
  return `${(-phase * CYCLE_S).toFixed(1)}s`;
}

const cycleStyle = (): CSSProperties => ({ '--vx-cycle-delay': cycleDelay(), '--vx-cycle': `${CYCLE_S}s` }) as CSSProperties;

/** Screen-space sky behind the island. */
export function VoxelSky() {
  return (
    <div className="vx-sky" style={cycleStyle()} aria-hidden="true">
      <div className="vx-sky-dusk" />
      <div className="vx-sky-night">
        <div className="vx-stars" />
      </div>
      <div className="vx-sun" />
      <div className="vx-moon" />
    </div>
  );
}

const fireflies: ParticleKind = {
  density: 1.6,
  max: 40,
  blend: 'lighter',
  spawn: (rand, w, h) => ({
    x: rand() * w,
    y: h * 0.25 + rand() * h * 0.7,
    vx: (rand() - 0.5) * 0.02,
    vy: (rand() - 0.5) * 0.02,
    size: 1.6 + rand() * 1.6,
    phase: rand() * Math.PI * 2,
    life: 0,
  }),
  step: (p, dt, w, h) => {
    p.life += dt;
    p.vx += (Math.sin(p.life * 0.001 + p.phase) * 0.0006);
    p.vy += (Math.cos(p.life * 0.0013 + p.phase) * 0.0006);
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    return p.x > -20 && p.x < w + 20 && p.y > -20 && p.y < h + 20;
  },
  draw: (ctx, p, now) => {
    const glow = 0.4 + 0.6 * Math.max(0, Math.sin(now * 0.002 + p.phase));
    ctx.globalAlpha = glow;
    ctx.fillStyle = '#E8FF8A';
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.globalAlpha = glow * 0.25;
    ctx.fillRect(p.x - p.size * 1.5, p.y - p.size * 1.5, p.size * 3, p.size * 3);
  },
};

/** Over the island: nightfall shading, and fireflies once it's dark. */
export function VoxelAmbient() {
  return (
    <div className="vx-ambient" style={cycleStyle()} aria-hidden="true">
      <div className="vx-nightfall" />
      <div className="vx-fireflies">
        <Particles kind={fireflies} />
      </div>
    </div>
  );
}
