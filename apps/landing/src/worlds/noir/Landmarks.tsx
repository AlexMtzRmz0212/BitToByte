import type { JSX } from 'react';
import type { LandmarkProps } from '../types';

// Landmarks of Lamplight, in the city's oblique view: front faces lit
// by street light, side faces in shadow, one amber accent each.

type Art = (p: { x: number; y: number; name: string }) => JSX.Element;

export default function NoirLandmark({ project, at }: LandmarkProps) {
  const Art = ART[project.district] ?? DecoTower;
  return (
    <g className="nr-landmark">
      <Art x={at.x} y={at.y} name={project.name} />
      <rect x={at.x - 140} y={at.y - 330} width="280" height="360" fill="transparent" />
    </g>
  );
}

/* ----------------------------------------- EastCoastEV: harbor lighthouse */

const Lighthouse: Art = ({ x, y }) => {
  const lamp = { x: x - 40, y: y - 260 };
  return (
    <g>
      {/* the beam, sweeping the water */}
      <g className="nr-sweep" style={{ transformOrigin: `${lamp.x}px ${lamp.y}px` }}>
        <path d={`M${lamp.x} ${lamp.y}L${lamp.x + 520} ${lamp.y - 70}L${lamp.x + 520} ${lamp.y + 70}Z`} className="nr-light-beam" />
      </g>
      {/* rock and tower */}
      <path d={`M${x - 110} ${y}q20 -30 70 -26h80q40 0 60 26z`} className="nr-rock" />
      <path d={`M${x - 76} ${y - 18}L${x - 58} ${y - 230}H${x - 22}L${x - 4} ${y - 18}Z`} className="nr-tower" />
      <path d={`M${x - 4} ${y - 18}L${x - 22} ${y - 230}l14 -10L${x + 12} ${y - 26}Z`} className="nr-side" />
      {[60, 120, 180].map((dy) => (
        <path key={dy} d={`M${x - 72 + dy * 0.085} ${y - dy}H${x - 8 - dy * 0.085}`} className="nr-band" />
      ))}
      <rect x={x - 66} y={y - 252} width="52" height="22" className="nr-gallery" />
      <rect x={x - 58} y={y - 284} width="36" height="32" className="nr-lantern" />
      <circle cx={lamp.x} cy={lamp.y - 8} r="10" className="nr-lamp-core" />
      <path d={`M${x - 64} ${y - 284}l24 -22l24 22z`} className="nr-cap" />
      {/* charging kiosk and a docked e-bike */}
      <rect x={x + 30} y={y - 74} width="34" height="62" rx="4" className="nr-kiosk" />
      <path d={`M${x + 50} ${y - 64}l-10 18h8l-6 16 14 -22h-8l6 -12z`} className="nr-bolt" />
      <path d={`M${x + 64} ${y - 40}c30 0 30 30 52 26`} className="nr-cable" />
      <g className="nr-bike" transform={`translate(${x + 128} ${y - 24})`}>
        <circle cx="-22" cy="8" r="14" />
        <circle cx="26" cy="8" r="14" />
        <path d="M-22 8L-4 -14H18L26 8M-4 -14L4 8H-22M18 -14l-4 -10h-8" />
      </g>
    </g>
  );
};

/* -------------------------------------------- Cinetech: the movie palace */

const Cinema: Art = ({ x, y, name }) => {
  const L = x - 110;
  const R = x + 110;
  const top = y - 200;
  const bulbs = Array.from({ length: 13 }, (_, k) => L + 22 + k * 15);
  return (
    <g>
      {/* projector light spilling out of the high window */}
      <path d={`M${x + 40} ${top + 34}L${x + 420} ${top - 220}L${x + 300} ${top - 280}Z`} className="nr-light-beam nr-projector" />
      <path d={`M${R} ${y}V${top + 20}l40 -26V${y - 22}Z`} className="nr-side" />
      {/* stepped deco front */}
      <path
        d={`M${L} ${y}V${top + 20}H${L + 30}V${top}H${L + 60}V${top - 20}H${R - 60}V${top}H${R - 30}V${top + 20}H${R}V${y}Z`}
        className="nr-front nr-deco nr-cinema"
      />
      <path d={`M${x} ${top - 20}V${top + 70}M${x - 30} ${top - 6}l30 30 30 -30`} className="nr-pilaster" />
      <rect x={x + 26} y={top + 22} width="26" height="20" className="nr-lit" />
      {/* posters */}
      {[-80, -26, 28].map((dx) => (
        <rect key={dx} x={x + dx} y={y - 108} width="44" height="58" className="nr-poster" />
      ))}
      {/* marquee */}
      <path d={`M${L - 16} ${y - 128}H${R + 16}l-14 26H${L - 2}z`} className="nr-marquee" />
      {bulbs.map((bx, k) => (
        <circle key={k} cx={bx} cy={y - 115} r="3" className="nr-bulb" style={{ animationDelay: `${(k % 3) * 0.25}s` }} />
      ))}
      <rect x={x - 26} y={y - 46} width="52" height="46" className="nr-door" />
      {/* the blade sign */}
      <rect x={L - 34} y={top - 40} width="30" height="190" rx="4" className="nr-blade" />
      <text x={L - 19} y={top - 18} className="nr-blade-text" textAnchor="middle">
        {name
          .toUpperCase()
          .slice(0, 8)
          .split('')
          .map((ch, k) => (
            <tspan key={k} x={L - 19} dy={k ? 22 : 0}>
              {ch}
            </tspan>
          ))}
      </text>
    </g>
  );
};

/* ----------------------------------------- anything else: a deco tower */

const DecoTower: Art = ({ x, y }) => (
  <g>
    <path d={`M${x + 60} ${y}V${y - 260}l34 -20V${y - 18}Z`} className="nr-side" />
    <rect x={x - 60} y={y - 260} width="120" height="260" className="nr-front nr-deco" />
    <path d={`M${x - 40} ${y - 260}v-24h80v24M${x - 20} ${y - 284}v-24h40v24M${x} ${y - 308}v-50`} className="nr-crown" />
    {Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => (
        <rect
          key={`${r}-${c}`}
          x={x - 48 + c * 26}
          y={y - 244 + r * 28}
          width="14"
          height="16"
          className={(r + c) % 3 === 0 ? 'nr-lit' : 'nr-win'}
        />
      ))
    )}
    <rect x={x - 22} y={y - 40} width="44" height="40" className="nr-door" />
  </g>
);

const ART: Record<string, Art> = {
  lighthouse: Lighthouse,
  cinema: Cinema,
};
