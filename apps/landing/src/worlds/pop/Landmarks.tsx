import type { JSX } from 'react';
import { burst } from '../shared/sketch';
import type { LandmarkProps } from '../types';

// Landmarks of New York: flat colour, heavy ink, halftone shade on the
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

/* ---------------------------- Banda de Guerra: the parade stand and its drum */

const STICK_TIPS = [-1, 1];

const Bandstand: Art = ({ x, y }) => (
  <g>
    {/* the stand */}
    <rect x={x - 150} y={y - 30} width="300" height="30" fill="#FFFEFA" {...ink} />
    {/* pennants either side */}
    {STICK_TIPS.map((side) => (
      <g key={side}>
        <path d={`M${x + side * 136} ${y - 30}V${y - 200}`} {...ink} />
        <path d={`M${x + side * 136} ${y - 200}l${side * 44} 18l${-side * 44} 18Z`} fill={side < 0 ? '#1B4FD8' : '#6DBB3B'} {...ink} strokeWidth={4} />
      </g>
    ))}
    <polygon points={burst(x, y - 216, 74, 40, 10)} fill="#FF8FB1" {...ink} strokeWidth={4} className="pp-sparkle" />
    {/* the giant snare */}
    <path d={`M${x - 104} ${y - 176}V${y - 58}a104 26 0 0 0 208 0V${y - 176}Z`} fill="#C8102E" {...ink} />
    <path
      d={`M${x - 104} ${y - 60}L${x - 70} ${y - 150}L${x - 36} ${y - 36}L${x} ${y - 150}L${x + 36} ${y - 36}L${x + 70} ${y - 150}L${x + 104} ${y - 60}`}
      fill="none"
      stroke="#FFD400"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <path d={`M${x - 104} ${y - 72}a104 26 0 0 0 208 0`} fill="none" {...ink} strokeWidth={4} />
    <ellipse cx={x} cy={y - 176} rx="104" ry="28" fill="#FFFEFA" {...ink} />
    {/* crossed sticks mid-strike */}
    {STICK_TIPS.map((side) => (
      <g key={side}>
        <path d={`M${x + side * 118} ${y - 296}L${x - side * 18} ${y - 182}`} stroke={K} strokeWidth="18" strokeLinecap="round" />
        <path d={`M${x + side * 118} ${y - 296}L${x - side * 18} ${y - 182}`} stroke="#FFD400" strokeWidth="9" strokeLinecap="round" />
      </g>
    ))}
    {/* a judge's score card */}
    <path d={`M${x + 96} ${y - 30}V${y - 66}`} {...ink} strokeWidth={4} />
    <rect x={x + 62} y={y - 112} width="68" height="48" fill="#FFFEFA" {...ink} strokeWidth={4} />
    <text x={x + 96} y={y - 80} textAnchor="middle" className="pp-sign">
      9.5
    </text>
  </g>
);

/* ------------------------- Marvel: the heroes' tower and its watch order */

const WATCH_ORDER = ['#C8102E', '#FFD400', '#6DBB3B', '#FF8FB1', '#9AD0FF'];

const HeroTower: Art = ({ x, y }) => (
  <g>
    {/* a signal blazing behind the crown */}
    <polygon points={burst(x, y - 270, 52, 34, 12)} fill="#FFD400" {...ink} strokeWidth={3.5} className="pp-sparkle" />
    <rect x={x - 140} y={y - 24} width="280" height="24" fill="#FFFEFA" {...ink} />
    {/* the tower */}
    <path d={`M${x - 72} ${y - 24}L${x - 60} ${y - 250}H${x + 60}L${x + 72} ${y - 24}Z`} fill="#1B4FD8" {...ink} />
    <path d={`M${x + 34} ${y - 27}L${x + 30} ${y - 247}H${x + 57}L${x + 68} ${y - 27}Z`} fill="#123A9E" />
    {Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => (
        <rect
          key={`${r}-${c}`}
          x={x - 46 + c * 24}
          y={y - 236 + r * 22}
          width="16"
          height="13"
          fill={(r + c * 2) % 3 === 0 ? '#FFD400' : '#9AD0FF'}
          stroke={K}
          strokeWidth="2.5"
        />
      ))
    )}
    {/* the crown and its power core */}
    <path d={`M${x - 60} ${y - 250}L${x - 36} ${y - 292}H${x + 36}L${x + 60} ${y - 250}Z`} fill="#FFFEFA" {...ink} />
    <circle cx={x} cy={y - 270} r="16" fill="#9AD0FF" {...ink} strokeWidth={4} />
    <circle cx={x} cy={y - 270} r="7" fill="#FFFEFA" stroke={K} strokeWidth="2.5" />
    {/* the landing deck, with someone caped keeping watch */}
    <path d={`M${x + 128} ${y - 174}L${x + 66} ${y - 138}`} {...ink} />
    <rect x={x + 62} y={y - 186} width="70" height="12" fill="#FFFEFA" {...ink} strokeWidth={4} />
    <path d={`M${x + 92} ${y - 224}Q${x + 64} ${y - 206} ${x + 70} ${y - 186}L${x + 96} ${y - 198}Z`} fill="#C8102E" {...ink} strokeWidth={3} />
    <path d={`M${x + 92} ${y - 224}H${x + 108}L${x + 106} ${y - 204}L${x + 108} ${y - 186}H${x + 102}L${x + 100} ${y - 200}L${x + 98} ${y - 186}H${x + 92}L${x + 94} ${y - 204}Z`} fill={K} />
    <circle cx={x + 100} cy={y - 233} r="9" fill={K} />
    {/* a sound effect on the other side */}
    <polygon points={burst(x - 112, y - 196, 48, 30, 10)} fill="#FF8FB1" {...ink} strokeWidth={3.5} />
    <text x={x - 112} y={y - 187} textAnchor="middle" className="pp-sign">
      POW!
    </text>
    {/* the marquee: the films in order */}
    <path d={`M${x - 110} ${y - 68}V${y - 24}M${x + 110} ${y - 68}V${y - 24}`} {...ink} />
    <rect x={x - 26} y={y - 68} width="52" height="44" fill={K} />
    <rect x={x - 94} y={y - 150} width="188" height="32" fill="#FFFEFA" {...ink} strokeWidth={4} />
    <text x={x} y={y - 125} textAnchor="middle" className="pp-sign">
      WATCH ORDER
    </text>
    {WATCH_ORDER.map((c, k) => (
      <g key={c}>
        <rect x={x - 116 + k * 47} y={y - 112} width="44" height="44" fill={c} {...ink} strokeWidth={4} />
        <text x={x - 94 + k * 47} y={y - 81} textAnchor="middle" className="pp-sign">
          {k + 1}
        </text>
      </g>
    ))}
  </g>
);

/* -------------------------- TikTok Archive: a phone on its filing cabinets */

const DRAWERS = [-140, -46, 48];

const ClipFile: Art = ({ x, y }) => (
  <g>
    <polygon points={burst(x - 90, y - 248, 40, 20, 9)} fill="#FF8FB1" {...ink} strokeWidth={3.5} className="pp-sparkle" />
    {/* the phone, playing */}
    <rect x={x - 62} y={y - 304} width="124" height="196" rx="16" fill={K} {...ink} />
    <rect x={x - 50} y={y - 288} width="100" height="162" fill="#1B4FD8" />
    <path d={`M${x - 20} ${y - 244}V${y - 186}L${x + 28} ${y - 215}Z`} fill="#FFFEFA" {...ink} strokeWidth={4} />
    <path d={`M${x - 36} ${y - 150}h72M${x - 36} ${y - 136}h48`} stroke="#FFD400" strokeWidth="6" strokeLinecap="round" />
    {/* the cabinets, a drawer per pile of notes */}
    <rect x={x - 150} y={y - 112} width="300" height="112" fill="#FFD400" {...ink} />
    {[0, 1].map((row) =>
      DRAWERS.map((dx, k) => (
        <g key={`${row}-${dx}`}>
          <rect x={x + dx} y={y - 102 + row * 50} width="92" height="42" fill={k === 1 ? '#FF8FB1' : '#FFFEFA'} {...ink} strokeWidth={4} />
          <rect x={x + dx + 26} y={y - 94 + row * 50} width="40" height="11" fill="#FFFEFA" stroke={K} strokeWidth="2.5" />
          <path d={`M${x + dx + 34} ${y - 72 + row * 50}h24`} stroke={K} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))
    )}
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
  bandstand: Bandstand,
  herotower: HeroTower,
  clipfile: ClipFile,
};
