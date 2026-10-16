import type { JSX } from 'react';
import { burst } from '../shared/sketch';
import type { LandmarkProps } from '../types';

// Landmarks of Pop-Panel City: flat colour, heavy ink, halftone shade on the
// side that faces away from the light.

const K = '#161616';
const ink = { stroke: K, strokeWidth: 5, strokeLinejoin: 'round' as const };

type Art = (p: { x: number; y: number }) => JSX.Element;

export default function PopLandmark({ project, at }: LandmarkProps) {
  const Art = ART[project.district] ?? BrickBlock;
  return (
    <g className="pp-landmark">
      <Art x={at.x} y={at.y} />
      <rect x={at.x - 150} y={at.y - 300} width="300" height="330" fill="transparent" />
    </g>
  );
}

/* ------------------------------------- Hell o' Fame: the hall of fame */

const Monument: Art = ({ x, y }) => (
  <g>
    {/* red carpet */}
    <path d={`M${x - 34} ${y}L${x - 70} ${y + 40}H${x + 70}L${x + 34} ${y}Z`} fill="#C8102E" {...ink} />
    {/* stepped plinth */}
    <rect x={x - 150} y={y - 30} width="300" height="30" fill="#FFFEFA" {...ink} />
    <rect x={x - 120} y={y - 60} width="240" height="30" fill="#FFFEFA" {...ink} />
    {/* niches with album sleeves */}
    <rect x={x - 120} y={y - 170} width="240" height="110" fill="#F2EFE6" {...ink} />
    {[
      [-104, '#1B4FD8'],
      [-36, '#FFD400'],
      [32, '#FF8FB1'],
    ].map(([dx, c]) => (
      <g key={dx as number}>
        <rect x={x + (dx as number)} y={y - 150} width="64" height="64" fill={c as string} {...ink} strokeWidth={4} />
        <circle cx={x + (dx as number) + 32} cy={y - 118} r="16" fill={K} />
      </g>
    ))}
    <path d={`M${x - 120} ${y - 60}h240`} {...ink} />
    {/* the golden record on top */}
    <rect x={x - 70} y={y - 196} width="140" height="26" fill="#FFFEFA" {...ink} />
    <circle cx={x} cy={y - 268} r="70" fill="#FFD400" {...ink} />
    <circle cx={x} cy={y - 268} r="52" fill="none" stroke={K} strokeWidth="2.5" opacity="0.6" />
    <circle cx={x} cy={y - 268} r="38" fill="none" stroke={K} strokeWidth="2.5" opacity="0.6" />
    <circle cx={x} cy={y - 268} r="18" fill="#C8102E" {...ink} strokeWidth={4} />
    <path d={`M${x - 46} ${y - 300}q14 -16 32 -18`} fill="none" stroke="#FFFEFA" strokeWidth="6" strokeLinecap="round" />
    <polygon points={burst(x + 74, y - 330, 26, 12, 8)} fill="#FFFEFA" {...ink} strokeWidth={3.5} className="pp-sparkle" />
  </g>
);

/* --------------------------------------------- The Locker Room: stadium */

const Stadium: Art = ({ x, y }) => (
  <g>
    {/* floodlights */}
    {[-200, 200].map((dx) => (
      <g key={dx}>
        <path d={`M${x + dx} ${y - 40}V${y - 250}`} {...ink} />
        <rect x={x + dx - 26} y={y - 282} width="52" height="34" fill="#FFFEFA" {...ink} />
        <path d={`M${x + dx - 16} ${y - 270}h32M${x + dx - 16} ${y - 260}h32`} stroke={K} strokeWidth="3" />
      </g>
    ))}
    {/* the bowl */}
    <ellipse cx={x} cy={y - 60} rx="200" ry="86" fill="#C8102E" {...ink} />
    <path d={`M${x - 200} ${y - 60}v34a200 86 0 0 0 400 0v-34`} fill="#9B0C24" {...ink} />
    <ellipse cx={x} cy={y - 66} rx="150" ry="56" fill="#FFFEFA" {...ink} />
    <ellipse cx={x} cy={y - 60} rx="128" ry="44" fill="#6DBB3B" {...ink} />
    <path d={`M${x} ${y - 104}v88`} stroke="#FFFEFA" strokeWidth="4" />
    <ellipse cx={x} cy={y - 60} rx="22" ry="9" fill="none" stroke="#FFFEFA" strokeWidth="4" />
    {/* scoreboard */}
    <rect x={x - 70} y={y - 210} width="140" height="56" fill={K} />
    <path d={`M${x - 46} ${y - 154}v20M${x + 46} ${y - 154}v20`} {...ink} />
    <text x={x - 34} y={y - 168} className="pp-score">
      3
    </text>
    <text x={x + 16} y={y - 168} className="pp-score">
      2
    </text>
    <circle cx={x + 120} cy={y - 150} r="12" fill="#FFFEFA" {...ink} strokeWidth={3} className="pp-ball" />
  </g>
);

/* ---------------------------------------- Marvel: the comic archive */

const SPINES = ['#C8102E', '#1B4FD8', '#FFD400', '#FF8FB1', '#6DBB3B', '#9AD0FF', '#C8102E', '#FFD400'];

const Library: Art = ({ x, y }) => (
  <g>
    <rect x={x - 140} y={y - 24} width="280" height="24" fill="#FFFEFA" {...ink} />
    <rect x={x - 130} y={y - 200} width="260" height="176" fill="#F2EFE6" {...ink} />
    {/* the facade: a shelf of giant comic spines */}
    {SPINES.map((c, k) => (
      <g key={k}>
        <rect x={x - 116 + k * 29} y={y - 186} width="26" height="150" fill={c} {...ink} strokeWidth={3.5} />
        <path d={`M${x - 112 + k * 29} ${y - 160}h18M${x - 112 + k * 29} ${y - 66}h18`} stroke={K} strokeWidth="3" />
      </g>
    ))}
    <rect x={x - 26} y={y - 70} width="52" height="46" fill={K} />
    {/* pediment with the sign */}
    <path d={`M${x - 150} ${y - 200}L${x} ${y - 270}L${x + 150} ${y - 200}Z`} fill="#FFD400" {...ink} />
    <rect x={x - 82} y={y - 236} width="164" height="30" fill="#FFFEFA" {...ink} strokeWidth={3.5} />
    <text x={x} y={y - 213} textAnchor="middle" className="pp-sign">
      ARCHIVE
    </text>
  </g>
);

/* ---------------------------------- anything else: a brick walk-up */

const BrickBlock: Art = ({ x, y }) => (
  <g>
    <rect x={x - 90} y={y - 200} width="180" height="200" fill="#C8102E" {...ink} />
    {Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 3 }, (_, c) => (
        <rect key={`${r}-${c}`} x={x - 70 + c * 52} y={y - 182 + r * 44} width="36" height="28" fill="#FFD400" {...ink} strokeWidth={3.5} />
      ))
    )}
    <g stroke={K} strokeWidth="5">
      <path d={`M${x + 20} ${y - 200}l6 -30M${x + 60} ${y - 200}l-6 -30`} />
      <rect x={x + 14} y={y - 280} width="52" height="50" fill="#9B5B2E" />
      <path d={`M${x + 10} ${y - 280}l30 -22 30 22z`} fill="#9B5B2E" />
    </g>
  </g>
);

const ART: Record<string, Art> = {
  monument: Monument,
  stadium: Stadium,
  library: Library,
};
