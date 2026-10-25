import { PLACES, type MapLayout } from '../../data/worlds';
import { spiralArm } from '../shared/sketch';
import Particles, { type ParticleKind } from '../shared/Particles';
import type { GateProps } from '../types';
import { RAIL_SLOPE, railY } from './land';

// Blackwater: the gate, the rider, the train, and the dust in the low sun.

const ARMS = [0, 1, 2].map((i) => spiralArm(0, 0, 50, 1.1, (i * Math.PI * 2) / 3, 30));

/** A timber ranch arch with a swirl of the destination's light between its posts. */
export function FrontierGate({ to, at }: GateProps) {
  const tint = PLACES[to].tokens.accent;
  const id = `fr-arch-${to}`;
  return (
    <g transform={`translate(${at.x} ${at.y})`} data-target={`gate:${to}`} className="fr-gate">
      <defs>
        <clipPath id={id}>
          <rect x="-50" y="-104" width="100" height="174" />
        </clipPath>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0" stopColor={tint} stopOpacity="0.9" />
          <stop offset="0.6" stopColor={tint} stopOpacity="0.35" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="72" rx="110" ry="16" className="fr-shadow" />
      <g clipPath={`url(#${id})`}>
        <rect x="-50" y="-104" width="100" height="174" className="fr-gate-void" />
        <circle cy="-16" r="80" fill={`url(#${id}-eye)`} />
        <g className="fr-vortex" style={{ transformOrigin: '0px -16px' }}>
          {ARMS.map((d, k) => (
            <path key={k} d={d} transform="translate(0 -16)" className="fr-vortex-arm" />
          ))}
        </g>
      </g>
      {/* posts, crossbeam, horseshoe and lantern */}
      <path d="M-66 72V-118H-50V72ZM50 72V-118H66V72Z" className="fr-gate-post" />
      <path d="M-62 72V-118M54 72V-118" className="fr-gate-lit" />
      <path d="M-92 -130H92V-112H-92Z" className="fr-gate-beam" />
      <path d="M-50 -112L-30 -92M50 -112L30 -92" className="fr-gate-brace" />
      <path d="M-10 -132v-12a10 10 0 0 1 20 0v12" className="fr-horseshoe" />
      <path d="M0 -112v12" className="fr-rope" />
      <rect x="-7" y="-100" width="14" height="18" rx="3" fill={tint} className="fr-gate-lantern" />
      <rect x="-100" y="-160" width="200" height="240" fill="transparent" />
    </g>
  );
}

/** Horse and rider, facing the way they travel. */
export function Rider() {
  return (
    <div className="fr-rider">
      <svg viewBox="-40 -56 80 70" width="72" height="63" aria-hidden="true" focusable="false">
        <ellipse cx="2" cy="10" rx="28" ry="5" className="fr-rider-shadow" />
        <g className="fr-rider-dust">
          <circle cx="-22" cy="6" r="4" />
          <circle cx="-30" cy="2" r="5" />
          <circle cx="-38" cy="-2" r="4" />
        </g>
        <g className="fr-rider-bob">
          <g className="fr-legs">
            <path d="M-14 -6l-4 15M-8 -5l2 14" className="fr-leg fr-leg-a" />
            <path d="M8 -5l-3 14M14 -7l5 14" className="fr-leg fr-leg-b" />
          </g>
          <path d="M-18 -13C-26 -12 -29 -2 -27 5" className="fr-tail" />
          <path d="M-19 -14C-19 -23 12 -25 16 -17L18 -7C9 -2 -12 -2 -19 -7Z" className="fr-horse" />
          <path d="M9 -17L17 -31C19 -35 25 -36 29 -32L33 -27C31 -24 27 -25 24 -24L18 -12Z" className="fr-horse" />
          <path d="M21 -34l1 -5 3 4" className="fr-horse" />
          <path d="M12 -26l6 -6" className="fr-mane" />
          {/* rider */}
          <path d="M0 -21l5 11" className="fr-rider-leg" />
          <path d="M-2 -22L2 -38" className="fr-rider-body" />
          <path d="M0 -36l5 1 -1 3Z" className="fr-bandana" />
          <circle cx="3" cy="-42" r="4" className="fr-rider-head" />
          <path d="M-5 -45h16M-1 -45v-5h8v5" className="fr-rider-hat" />
          <path d="M2 -32l9 6" className="fr-rider-arm" />
        </g>
      </svg>
    </div>
  );
}

/** A steam train crossing the map on the line, with its smoke. */
export function FrontierTrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  const y = railY(0);
  const angle = (Math.atan(RAIL_SLOPE) * 180) / Math.PI;
  const cars = [-150, -240, -330];
  return (
    <svg className="fr-overlay" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <g className="fr-train">
        <g transform={`translate(0 ${y}) rotate(${angle.toFixed(2)})`}>
          {/* engine */}
          <path d="M-60 -6H8V-34H-60Z" className="fr-engine" />
          <path d="M-90 -6H-60V-48H-90Z" className="fr-cab" />
          <path d="M-96 -48H-54V-54H-96Z" className="fr-cab-roof" />
          <rect x="-84" y="-42" width="16" height="12" className="fr-window" />
          <path d="M-10 -34V-58H4V-34M-14 -60H8" className="fr-stack" />
          <path d="M8 -6L24 -2H8Z" className="fr-cowcatcher" />
          <circle cx="6" cy="-26" r="5" className="fr-headlamp" />
          {[-78, -48, -20].map((cx) => (
            <circle key={cx} cx={cx} cy="-4" r="9" className="fr-train-wheel" />
          ))}
          {/* tender and cars */}
          <path d="M-136 -6H-96V-32H-136Z" className="fr-tender" />
          {cars.map((cx, k) => (
            <g key={cx}>
              <path d={`M${cx - 80} -6H${cx}V-40H${cx - 80}Z`} className={k === 2 ? 'fr-car fr-car-red' : 'fr-car'} />
              <path d={`M${cx - 84} -40H${cx + 4}l-6 -8H${cx - 78}Z`} className="fr-cab-roof" />
              {[0, 1, 2].map((n) => (
                <rect key={n} x={cx - 70 + n * 24} y="-32" width="14" height="12" className="fr-window" />
              ))}
              <circle cx={cx - 64} cy="-4" r="6" className="fr-train-wheel" />
              <circle cx={cx - 16} cy="-4" r="6" className="fr-train-wheel" />
            </g>
          ))}
          <g className="fr-steam">
            <circle cx="-4" cy="-70" r="10" />
            <circle cx="-24" cy="-88" r="14" />
            <circle cx="-54" cy="-102" r="18" />
            <circle cx="-94" cy="-110" r="22" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const dust: ParticleKind = {
  density: 5,
  max: 120,
  spawn: (rand, w, h) => ({
    x: rand() * w,
    y: rand() * h,
    vx: 0.012 + rand() * 0.02,
    vy: -0.004 - rand() * 0.008,
    size: 0.8 + rand() * 2,
    phase: rand() * Math.PI * 2,
    life: 0,
  }),
  step: (p, dt, w, h) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life += dt;
    return p.x < w + 10 && p.y > -10 && p.y < h + 10;
  },
  draw: (ctx, p, now) => {
    ctx.globalAlpha = 0.25 + 0.25 * Math.sin(p.phase + now / 900);
    ctx.fillStyle = '#FFE2A0';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  },
  blend: 'screen',
};

/** Screen-space life over the plains: warm dust in the low sun and a circling hawk. */
export function FrontierSkyFx() {
  return (
    <div className="fr-fx" aria-hidden="true">
      <div className="fr-sunlight" />
      <div className="fr-hawk-orbit">
        <svg viewBox="-20 -8 40 16" width="40" height="16" className="fr-hawk">
          <path d="M-18 0Q-10 -6 -2 -1L0 2 2 -1Q10 -6 18 0Q10 -3 3 2L0 5 -3 2Q-10 -3 -18 0Z" />
        </svg>
      </div>
      <Particles kind={dust} />
    </div>
  );
}

/** Beyond the map: the evening sky over the plains. */
export function FrontierBackdrop() {
  return <div className="fr-backdrop" aria-hidden="true" />;
}
