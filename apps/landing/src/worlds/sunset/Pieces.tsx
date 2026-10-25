import { PLACES, type MapLayout } from '../../data/worlds';
import { spiralArm } from '../shared/sketch';
import type { GateProps } from '../types';
import { FWY_BOTTOM, FWY_TOP, FWY_WEST, FWY_X, FWY_Y } from './city';

// Los Santos: the gate, the car, freeway traffic and the evening sky.

const ARMS = [0, 1, 2].map((i) => spiralArm(0, 0, 46, 1.2, (i * Math.PI * 2) / 3, 30));

/** A freeway exit: a green sign gantry over a tunnel mouth swirling with the destination's colour. */
export function SunsetGate({ to, at }: GateProps) {
  const tint = PLACES[to].tokens.accent;
  const id = `ls-tunnel-${to}`;
  return (
    <g transform={`translate(${at.x} ${at.y})`} data-target={`gate:${to}`} className="ls-gate">
      <defs>
        <clipPath id={id}>
          <path d="M-52 70V-10A52 52 0 0 1 52 -10V70Z" />
        </clipPath>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0" stopColor={tint} stopOpacity="0.95" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="74" rx="110" ry="16" className="ls-shadow" />
      {/* concrete portal */}
      <path d="M-78 70V-14A78 78 0 0 1 78 -14V70H52V-10A52 52 0 0 0 -52 -10V70Z" className="ls-concrete" />
      <path d="M-52 70V-10A52 52 0 0 1 52 -10V70Z" className="ls-tunnel" />
      <g clipPath={`url(#${id})`}>
        <circle cy="10" r="70" fill={`url(#${id}-eye)`} />
        <g className="ls-vortex" style={{ transformOrigin: '0px 10px' }}>
          {ARMS.map((d, k) => (
            <path key={k} d={d} transform="translate(0 10)" className="ls-vortex-arm" />
          ))}
        </g>
      </g>
      <path d="M-30 70l-10 -16M30 70l10 -16M0 70v-16" className="ls-lane-mark" />
      {/* the sign gantry */}
      <path d="M-96 70V-150M96 70V-150M-100 -150H100" className="ls-gantry" />
      <rect x="-88" y="-146" width="176" height="56" rx="6" className="ls-exit-sign" />
      <rect x="-82" y="-140" width="164" height="44" rx="4" className="ls-exit-border" />
      <text x="-62" y="-111" className="ls-exit-text">
        {PLACES[to].short.toUpperCase().slice(0, 10)}
      </text>
      <path d="M58 -128v18l-6 -6M58 -128l6 6" className="ls-exit-arrow" />
      <rect x="-60" y="-166" width="46" height="18" rx="3" className="ls-exit-tab" />
      <text x="-37" y="-152" textAnchor="middle" className="ls-exit-tab-text">
        EXIT
      </text>
      <rect x="-110" y="-180" width="220" height="260" fill="transparent" />
    </g>
  );
}

/** A sports car seen from above, pointed where it is going; headlights on while moving. */
export function Car() {
  return (
    <div className="ls-car">
      <svg viewBox="-34 -18 68 36" width="60" height="32" aria-hidden="true" focusable="false">
        <path className="ls-headbeam" d="M26 -8L70 -22V22L26 8Z" />
        <rect x="-28" y="-13" width="56" height="26" rx="9" className="ls-car-shadow" transform="translate(3 3)" />
        <path d="M-28 -6q0 -7 8 -8h36q12 0 12 14t-12 14h-36q-8 -1 -8 -8Z" className="ls-car-paint" />
        <path d="M2 -10h8q6 4 6 10t-6 10h-8q3 -10 0 -20Z" className="ls-car-windshield" />
        <path d="M-14 -9h14q-2 9 0 18h-14q-3 -9 0 -18Z" className="ls-car-roof" />
        <path d="M-22 -8q-2 8 0 16" className="ls-car-rear" />
        <path d="M-24 -4h48M-24 4h48" className="ls-car-stripe" />
        <circle cx="24" cy="-9" r="2" className="ls-car-light" />
        <circle cx="24" cy="9" r="2" className="ls-car-light" />
        <circle cx="-27" cy="-8" r="1.8" className="ls-car-tail" />
        <circle cx="-27" cy="8" r="1.8" className="ls-car-tail" />
      </svg>
    </div>
  );
}

/** World-space traffic on both freeways. */
export function SunsetTraffic({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  const colors = ['#F4F1FA', '#FF6F91', '#2EC4B6', '#FFB238', '#1C1631'];
  return (
    <svg className="ls-overlay" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      {Array.from({ length: 6 }, (_, k) => (
        <g key={`e${k}`} className="ls-traffic ls-east" style={{ animationDelay: `${-k * 3.4}s`, animationDuration: `${16 + (k % 3) * 3}s` }}>
          <rect x={FWY_WEST - 14} y={FWY_Y - 16 + (k % 2) * 9} width="24" height="11" rx="3" fill={colors[k % colors.length]} className="ls-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 6 }, (_, k) => (
        <g key={`w${k}`} className="ls-traffic ls-west" style={{ animationDelay: `${-k * 4.1}s`, animationDuration: `${18 + (k % 3) * 2}s` }}>
          <rect x={w - 10} y={FWY_Y + 5 + (k % 2) * 9} width="24" height="11" rx="3" fill={colors[(k + 2) % colors.length]} className="ls-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 4 }, (_, k) => (
        <g key={`s${k}`} className="ls-traffic ls-south" style={{ animationDelay: `${-k * 3.2}s`, animationDuration: `${11 + (k % 2) * 3}s` }}>
          <rect x={FWY_X - 16 + (k % 2) * 9} y={FWY_TOP - 14} width="11" height="24" rx="3" fill={colors[(k + 1) % colors.length]} className="ls-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 4 }, (_, k) => (
        <g key={`n${k}`} className="ls-traffic ls-north" style={{ animationDelay: `${-k * 2.9}s`, animationDuration: `${12 + (k % 2) * 2}s` }}>
          <rect x={FWY_X + 5 + (k % 2) * 9} y={FWY_BOTTOM - 10} width="11" height="24" rx="3" fill={colors[(k + 3) % colors.length]} className="ls-traffic-car" />
        </g>
      ))}
    </svg>
  );
}

/** Screen-space sky: the sunset glow, a blimp, a helicopter and gulls. */
export function SunsetSkyFx() {
  return (
    <div className="ls-fx" aria-hidden="true">
      <div className="ls-glow" />
      <div className="ls-blimp">
        <svg viewBox="-70 -24 140 48" width="140" height="48">
          <ellipse rx="56" ry="17" className="ls-blimp-body" />
          <path d="M-52 0l-16 -14v28Z" className="ls-blimp-body" />
          <rect x="-12" y="14" width="24" height="8" rx="3" className="ls-blimp-body" />
          <path d="M-30 -4h56" className="ls-blimp-stripe" />
        </svg>
      </div>
      <div className="ls-heli">
        <svg viewBox="-40 -40 80 80" width="80" height="80">
          <ellipse cx="6" cy="10" rx="18" ry="9" className="ls-heli-shadow" />
          <path d="M-30 0h20" className="ls-heli-tail" />
          <ellipse rx="14" ry="9" className="ls-heli-body" />
          <g className="ls-rotor">
            <path d="M-34 0H34M0 -34V34" />
          </g>
        </svg>
      </div>
      <div className="ls-gulls">
        <svg viewBox="0 0 120 40" width="120" height="40">
          <path d="M4 20q8 -8 14 0q6 -8 14 0M50 10q6 -6 10 0q4 -6 10 0M84 28q7 -7 12 0q5 -7 12 0" />
        </svg>
      </div>
    </div>
  );
}

/** Beyond the map: the ocean at dusk. */
export function SunsetBackdrop() {
  return <div className="ls-backdrop" aria-hidden="true" />;
}
