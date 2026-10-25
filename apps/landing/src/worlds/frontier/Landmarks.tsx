import type { JSX } from 'react';
import type { LandmarkProps } from '../types';
import { DEPTH } from './land';

// Landmarks of Blackwater, in the same golden-hour light as the town: lit
// left faces, shaded right faces, shadows falling east, one red accent each.

type Art = (p: { x: number; y: number; name: string }) => JSX.Element;

export default function FrontierLandmark({ project, at }: LandmarkProps) {
  const Art = ART[project.district] ?? Saloon;
  return (
    <g className="fr-landmark">
      <Art x={at.x} y={at.y} name={project.name} />
      <rect x={at.x - 160} y={at.y - 300} width="320" height="330" fill="transparent" />
    </g>
  );
}

/* --------------------------------------- Habits: the camp and its journal */

const Tent = ({ x, y, w, h, flip = false }: { x: number; y: number; w: number; h: number; flip?: boolean }) => {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} 1)`}>
      <path d={`M${-w / 2} 0L0 ${-h}L${w / 2} 0Z`} className="fr-canvas" />
      <path d={`M0 ${-h}L${w / 2} 0L${w / 2 + 34} -18L${34} ${-h - 18}Z`} className="fr-canvas-shade" />
      <path d={`M-14 0L0 ${-h * 0.62}L14 0Z`} className="fr-tent-door" />
      <path d={`M0 ${-h}v-14M${-w / 2 - 10} 4l10 -4M${w / 2 + 44} -14l-10 -4`} className="fr-rope" />
    </g>
  );
};

const Camp: Art = ({ x, y }) => (
  <g>
    <ellipse cx={x} cy={y - 6} rx="170" ry="44" className="fr-clearing" />
    <Tent x={x - 92} y={y - 34} w={110} h={88} />
    <Tent x={x + 96} y={y - 44} w={130} h={104} />
    {/* the wagon behind the camp */}
    <g transform={`translate(${x - 10} ${y - 92})`}>
      <path d="M-60 0h100l10 -18h-120Z" className="fr-wood" />
      <path d="M-56 -18Q-10 -76 44 -18Z" className="fr-canvas" />
      <circle cx="-40" cy="4" r="14" className="fr-wheel" />
      <circle cx="26" cy="4" r="14" className="fr-wheel" />
    </g>
    {/* log seat, crate and the journal left open on it */}
    <rect x={x - 80} y={y + 4} width="58" height="14" rx="7" className="fr-log" />
    <g transform={`translate(${x + 52} ${y - 8})`}>
      <path d="M-20 0V-28H20V0Z" className="fr-crate" />
      <path d="M20 0V-28l12 -7V-7Z" className="fr-crate-side" />
      <path d="M-20 -28l12 -7H32l-12 7Z" className="fr-crate-top" />
      <path d="M-20 -14H20M-6 -28V0" className="fr-crate-slat" />
      <g transform="translate(5 -34) rotate(-6)">
        <path d="M-18 2L0 -2 18 2 16 -10 0 -14 -16 -10Z" className="fr-journal-cover" />
        <path d="M-15 -1L0 -5V-12L-14 -9ZM15 -1L0 -5V-12L14 -9Z" className="fr-journal-page" />
        <path d="M-12 -6l9 -2M-12 -3.5l9 -2M3 -8l9 2M3 -5.5l9 2" className="fr-journal-ink" />
      </g>
    </g>
    {/* the fire */}
    <g transform={`translate(${x - 4} ${y + 12})`}>
      <circle r="70" className="fr-fire-glow" />
      {Array.from({ length: 9 }, (_, k) => {
        const a = (k / 9) * Math.PI * 2;
        return <ellipse key={k} cx={Math.cos(a) * 20} cy={Math.sin(a) * 8} rx="6" ry="4" className="fr-stone" />;
      })}
      <path d="M-18 2L14 -6M-14 -6L18 2" className="fr-firewood" />
      <path d="M-10 -2Q-12 -22 0 -36Q2 -20 10 -14Q14 -24 12 -30Q22 -14 10 -2Z" className="fr-flame" />
      <path d="M-4 -4Q-6 -16 0 -24Q4 -12 6 -4Z" className="fr-flame-core" />
      <g className="fr-smoke">
        <circle cx="2" cy="-52" r="8" />
        <circle cx="10" cy="-76" r="11" />
        <circle cx="4" cy="-104" r="14" />
      </g>
    </g>
    {/* a lantern on a pole */}
    <path d={`M${x + 150} ${y + 10}V${y - 62}h-14`} className="fr-pole" />
    <rect x={x + 130} y={y - 60} width="12" height="16" rx="3" className="fr-lantern" />
  </g>
);

/* ------------------------- Hack the Hill: telegraph office with a queue */

const Telegraph: Art = ({ x, y }) => {
  const L = x - 130;
  const R = x + 60;
  const h = 170;
  const top = y - h;
  return (
    <g>
      <ellipse cx={x + 40} cy={y + 2} rx="200" ry="14" className="fr-shadow" />
      <path d={`M${R} ${y}V${top + 34}l${DEPTH.x * 1.4} ${DEPTH.y * 1.4}V${y + DEPTH.y * 1.4}Z`} className="fr-side" />
      <path d={`M${R} ${top + 34}l${DEPTH.x * 1.4} ${DEPTH.y * 1.4}l-22 -22H${R - 4}Z`} className="fr-roof" />
      {/* false front */}
      <path
        d={`M${L} ${y}V${top + 24}H${L + 16}V${top}H${R - 16}V${top + 24}H${R}V${y}Z`}
        className="fr-front fr-paint"
      />
      <rect x={L + 22} y={top + 6} width={R - L - 44} height="30" className="fr-signboard" />
      <text x={(L + R) / 2} y={top + 28} textAnchor="middle" className="fr-sign fr-sign-big">
        TELEGRAPH
      </text>
      <text x={(L + R) / 2} y={top + 56} textAnchor="middle" className="fr-sign">
        &amp; POST OFFICE
      </text>
      {[L + 18, R - 50].map((wx) => (
        <g key={wx}>
          <rect x={wx} y={y - 104} width="32" height="40" className="fr-window" />
          <path d={`M${wx + 16} ${y - 104}v40M${wx} ${y - 84}h32`} className="fr-mullion" />
        </g>
      ))}
      <rect x={x - 52} y={y - 66} width="30" height="66" className="fr-door" />
      <rect x={x - 48} y={y - 62} width="22" height="24" className="fr-window" />
      {/* porch roof */}
      <path d={`M${L - 10} ${y - 78}H${R + 10}l-8 12H${L - 2}Z`} className="fr-awning" />
      <path d={`M${L - 2} ${y - 66}V${y}M${R + 2} ${y - 66}V${y}`} className="fr-post" />
      <path d={`M${L - 14} ${y + 4}H${R + 14}`} className="fr-boardwalk" />
      {/* the pole and its wires */}
      <path d={`M${x + 128} ${y}V${top - 30}M${x + 108} ${top - 22}h40M${x + 112} ${top - 8}h32`} className="fr-pole" />
      <path d={`M${x + 108} ${top - 22}Q${x + 300} ${top + 10} ${x + 480} ${top - 30}M${x + 148} ${top - 22}Q${x + 320} ${top - 4} ${x + 500} ${top - 50}`} className="fr-wire" />
      <path d={`M${x + 112} ${top - 8}Q${x - 40} ${top - 30} ${x - 52} ${top + 30}`} className="fr-wire" />
      {/* one queue for everyone */}
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k} className="fr-person" style={{ animationDelay: `${-k * 0.45}s` }}>
          <g transform={`translate(${x - 4 + k * 34} ${y + 2})`}>
            <path d="M-8 0v-26q0 -8 8 -8t8 8v26Z" className={`fr-coat fr-coat-${k % 3}`} />
            <circle cy="-40" r="6" className="fr-face" />
            {k % 2 === 0 ? (
              <path d="M-11 -44h22M-6 -44v-6h12v6" className="fr-hat" />
            ) : (
              <path d="M-8 -42q8 -12 16 0Z" className="fr-bonnet" />
            )}
          </g>
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------- anything else: a saloon */

const Saloon: Art = ({ x, y, name }) => {
  const L = x - 110;
  const R = x + 110;
  const top = y - 200;
  return (
    <g>
      <ellipse cx={x + 50} cy={y + 2} rx="180" ry="14" className="fr-shadow" />
      <path d={`M${R} ${y}V${top + 40}l${DEPTH.x * 1.4} ${DEPTH.y * 1.4}V${y + DEPTH.y * 1.4}Z`} className="fr-side" />
      <path d={`M${L} ${y}V${top + 30}H${L + 20}V${top}H${R - 20}V${top + 30}H${R}V${y}Z`} className="fr-front fr-wood" />
      <rect x={L + 26} y={top + 8} width={R - L - 52} height="34" className="fr-signboard" />
      <text x={x} y={top + 32} textAnchor="middle" className="fr-sign fr-sign-big">
        {name.toUpperCase().slice(0, 14)}
      </text>
      {/* upper storey and balcony */}
      {[L + 22, x - 16, R - 54].map((wx) => (
        <rect key={wx} x={wx} y={top + 56} width="32" height="36" className="fr-window" />
      ))}
      <path d={`M${L - 8} ${y - 96}H${R + 8}M${L - 8} ${y - 96}v-16M${R + 8} ${y - 96}v-16M${L - 8} ${y - 110}H${R + 8}`} className="fr-balcony" />
      <path d={`M${L} ${y - 96}V${y}M${R} ${y - 96}V${y}`} className="fr-post" />
      {/* batwing doors */}
      <rect x={x - 24} y={y - 70} width="48" height="70" className="fr-door" />
      <path d={`M${x - 22} ${y - 54}h20v30h-20ZM${x + 2} ${y - 54}h20v30h-20Z`} className="fr-batwing" />
      <rect x={L + 20} y={y - 74} width="36" height="40" className="fr-window" />
      <rect x={R - 56} y={y - 74} width="36" height="40" className="fr-window" />
      <path d={`M${L - 12} ${y + 4}H${R + 12}`} className="fr-boardwalk" />
    </g>
  );
};

const ART: Record<string, Art> = {
  camp: Camp,
  telegraph: Telegraph,
};
