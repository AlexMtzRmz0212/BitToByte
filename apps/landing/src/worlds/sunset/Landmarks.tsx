import type { JSX } from 'react';
import type { LandmarkProps } from '../types';

// Landmarks of Los Santos stand up off the atlas page: glass, stucco and
// floodlights in the last of the sun, each with a gold accent.

type Art = (p: { x: number; y: number; name: string }) => JSX.Element;

export default function SunsetLandmark({ project, at }: LandmarkProps) {
  const Art = ART[project.district] ?? GlassTower;
  return (
    <g className="ls-landmark">
      <Art x={at.x} y={at.y} name={project.name} />
      <rect x={at.x - 160} y={at.y - 300} width="320" height="330" fill="transparent" />
    </g>
  );
}

const PalmTree = ({ x, y, h = 120 }: { x: number; y: number; h?: number }) => (
  <g>
    <path d={`M${x} ${y}q-8 ${-h / 2} 4 ${-h}`} className="ls-trunk" />
    <g transform={`translate(${x + 4} ${y - h})`} className="ls-fronds">
      <path d="M0 0q-20 -14 -42 2q22 -6 42 -2Z" />
      <path d="M0 0q20 -14 42 2q-22 -6 -42 -2Z" />
      <path d="M0 0q-10 -22 -30 -26q18 10 30 26Z" />
      <path d="M0 0q10 -22 30 -26q-18 10 -30 26Z" />
      <path d="M0 0q-24 4 -34 22q14 -16 34 -22Z" />
      <path d="M0 0q24 4 34 22q-14 -16 -34 -22Z" />
    </g>
  </g>
);

/* ------------------------------ EastCoastEV: showroom with charging bays */

const Showroom: Art = ({ x, y, name }) => {
  const L = x - 130;
  const R = x + 130;
  const top = y - 150;
  return (
    <g>
      <ellipse cx={x + 60} cy={y + 6} rx="200" ry="18" className="ls-shadow" />
      {/* the box, glass all round */}
      <path d={`M${L} ${y}V${top}H${R}V${y}Z`} className="ls-stucco" />
      <path d={`M${L + 14} ${y}V${top + 44}H${R - 14}V${y}Z`} className="ls-glass" />
      <path d={`M${L + 14} ${top + 44}L${x - 20} ${y}H${x + 40}L${R - 60} ${top + 44}Z`} className="ls-glass-shine" />
      <path
        d={Array.from({ length: 5 }, (_, k) => `M${L + 14 + ((R - L - 28) * (k + 1)) / 6} ${top + 44}V${y}`).join('')}
        className="ls-mullion"
      />
      <path d={`M${L - 10} ${top}H${R + 10}V${top + 40}H${L - 10}Z`} className="ls-fascia" />
      <text x={x} y={top + 28} textAnchor="middle" className="ls-sign-text">
        {name.toUpperCase().slice(0, 14)}
      </text>
      {/* an e-bike and a car on the floor */}
      <g transform={`translate(${x - 60} ${y - 16})`} className="ls-bike">
        <circle cx="-16" cy="0" r="11" />
        <circle cx="18" cy="0" r="11" />
        <path d="M-16 0L-2 -16H14L18 0M-2 -16L4 0H-16M14 -16l-3 -8h-6" />
      </g>
      <g transform={`translate(${x + 60} ${y - 6})`}>
        <path d="M-44 0v-14q4 -10 20 -12l14 -12h34l16 12q14 2 14 12V0Z" className="ls-car-body" />
        <path d="M-6 -36l-10 10h22v-10ZM20 -36v10h16l-10 -10Z" className="ls-car-glass" />
        <circle cx="-26" cy="0" r="9" className="ls-tyre" />
        <circle cx="34" cy="0" r="9" className="ls-tyre" />
      </g>
      {/* charging bays out front */}
      {[-150, -110, 110, 150].map((dx, k) => (
        <g key={dx} transform={`translate(${x + dx} ${y + 4})`}>
          <rect x="-9" y="-42" width="18" height="42" rx="3" className="ls-charger" />
          <rect x="-5" y="-36" width="10" height="8" className="ls-charger-screen" />
          <path d="M1 -24l-5 9h4l-3 8 7 -11h-4l3 -6z" className={k % 2 ? 'ls-bolt' : 'ls-bolt ls-bolt-on'} />
        </g>
      ))}
      <PalmTree x={L - 30} y={y + 2} h={150} />
      <PalmTree x={R + 34} y={y + 2} h={130} />
      {/* pennant flags along the roof */}
      <path d={`M${L} ${top - 2}Q${x} ${top + 14} ${R} ${top - 2}`} className="ls-bunting-line" />
      {Array.from({ length: 9 }, (_, k) => {
        const t = (k + 0.5) / 9;
        const bx = L + (R - L) * t;
        const by = top - 2 + 16 * 4 * t * (1 - t) * 0.5;
        return <path key={k} d={`M${bx - 6} ${by}h12l-6 12Z`} className={`ls-pennant ls-pennant-${k % 3}`} />;
      })}
    </g>
  );
};

/* --------------------------------- The Locker Room: the coastal stadium */

const Stadium: Art = ({ x, y }) => {
  const rx = 150;
  const ry = 56;
  const cy = y - 70;
  return (
    <g>
      <ellipse cx={x + 40} cy={y + 4} rx={rx + 30} ry="22" className="ls-shadow" />
      {/* outer wall */}
      <path d={`M${x - rx} ${cy}V${y - 20}A${rx} ${ry * 0.6} 0 0 0 ${x + rx} ${y - 20}V${cy}Z`} className="ls-stucco" />
      <path
        d={Array.from({ length: 13 }, (_, k) => {
          const a = Math.PI * (k / 12);
          const px = x - Math.cos(a) * rx;
          const py = y - 20 + Math.sin(a) * ry * 0.6;
          return `M${px.toFixed(1)} ${(py - 6).toFixed(1)}V${(cy + 10).toFixed(1)}`;
        }).join('')}
        className="ls-arch"
      />
      {/* stands and pitch */}
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} className="ls-stands" />
      <ellipse cx={x} cy={cy} rx={rx - 26} ry={ry - 14} className="ls-stands-inner" />
      <ellipse cx={x} cy={cy + 2} rx={rx - 52} ry={ry - 26} className="ls-pitch" />
      <path d={`M${x} ${cy - ry + 26}V${cy + ry - 22}`} className="ls-pitch-line" />
      <ellipse cx={x} cy={cy + 2} rx="12" ry="5" className="ls-pitch-line" />
      {/* floodlights */}
      {[
        [-rx + 10, -1],
        [rx - 10, 1],
      ].map(([dx, side]) => (
        <g key={dx} transform={`translate(${x + dx!} ${cy})`}>
          <path d="M0 0V-150" className="ls-mast" />
          <rect x="-20" y="-178" width="40" height="28" className="ls-lamps" />
          <path d={`M${side! * -10} -150L${side! * -150} 10L${side! * -70} 30Z`} className="ls-floodlight" />
        </g>
      ))}
      {/* scoreboard */}
      <g transform={`translate(${x} ${cy - ry - 34})`}>
        <path d="M-8 30V0M8 30V0" className="ls-mast" />
        <rect x="-50" y="-30" width="100" height="36" className="ls-board" />
        <text x="-22" y="-5" textAnchor="middle" className="ls-score">
          3
        </text>
        <text x="22" y="-5" textAnchor="middle" className="ls-score">
          1
        </text>
      </g>
    </g>
  );
};

/* ------------------------------ anything else: a glass tower with a helipad */

const GlassTower: Art = ({ x, y, name }) => {
  const L = x - 60;
  const R = x + 60;
  const top = y - 260;
  return (
    <g>
      <path d={`M${R} ${y}V${top}l40 18V${y + 10}Z`} className="ls-tower-side" />
      <rect x={L} y={top} width="120" height="260" className="ls-glass" />
      <path d={`M${L} ${top}L${x + 30} ${y}H${x + 60}L${R} ${top + 120}V${top}Z`} className="ls-glass-shine" />
      <path d={Array.from({ length: 11 }, (_, k) => `M${L} ${top + 22 * (k + 1)}H${R}`).join('')} className="ls-mullion" />
      <path d={`M${L - 6} ${top}H${R + 6}V${top - 10}H${L - 6}Z`} className="ls-stucco" />
      <ellipse cx={x + 12} cy={top - 12} rx="44" ry="10" className="ls-helipad" />
      <path d={`M${x + 6} ${top - 16}v8M${x + 18} ${top - 16}v8M${x + 6} ${top - 12}h12`} className="ls-helipad-h" />
      <path d={`M${L + 10} ${top - 10}v-40`} className="ls-mast" />
      <circle cx={L + 10} cy={top - 52} r="4" className="ls-beacon" />
      <rect x={L + 12} y={y - 44} width="96" height="22" className="ls-fascia" />
      <text x={x} y={y - 28} textAnchor="middle" className="ls-sign-text ls-sign-small">
        {name.toUpperCase().slice(0, 12)}
      </text>
    </g>
  );
};

const ART: Record<string, Art> = {
  showroom: Showroom,
  stadium: Stadium,
};
