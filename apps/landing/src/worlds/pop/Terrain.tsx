import type { JSX } from 'react';
import type { MapLayout } from '../../data/worlds';
import { burst, seeded } from '../shared/sketch';

// Pop-Panel City: the map is a comic page. Nine panels in three tiers, each a
// scene of the city in flat colour with ink outlines and Ben-Day dots; the
// landmarks and gates sit inside their panels (drawn by the map screen).

const K = '#161616';
const RED = '#C8102E';
const BLUE = '#1B4FD8';
const YELLOW = '#FFD400';
const SKY = '#9AD0FF';
const PINK = '#FF8FB1';
const PAPER = '#F2EFE6';

interface Panel {
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
  dots: string;
  tilt?: number;
}

const PANELS: Panel[] = [
  { x: 40, y: 40, w: 720, h: 400, bg: YELLOW, dots: RED },
  { x: 790, y: 40, w: 620, h: 400, bg: BLUE, dots: SKY },
  { x: 1440, y: 40, w: 720, h: 400, bg: PAPER, dots: SKY },
  { x: 40, y: 470, w: 660, h: 530, bg: SKY, dots: BLUE },
  { x: 730, y: 470, w: 740, h: 530, bg: PAPER, dots: PINK },
  { x: 1500, y: 470, w: 660, h: 530, bg: PINK, dots: RED },
  { x: 40, y: 1030, w: 500, h: 430, bg: '#2A2D6E', dots: BLUE },
  { x: 570, y: 1030, w: 1060, h: 430, bg: YELLOW, dots: RED },
  { x: 1660, y: 1030, w: 500, h: 430, bg: '#2A2D6E', dots: BLUE },
];

/** A strip of flat skyline along the bottom of a panel, with water towers on some roofs. */
function Skyline({ p, seed, color = K, towers = true }: { p: Panel; seed: number; color?: string; towers?: boolean }) {
  const rand = seeded(seed);
  const parts: JSX.Element[] = [];
  let x = p.x;
  let k = 0;
  while (x < p.x + p.w) {
    const w = 50 + rand() * 70;
    const h = 60 + rand() * 120;
    const top = p.y + p.h - h;
    parts.push(<rect key={`b${k}`} x={x} y={top} width={w + 1} height={h} fill={color} />);
    // windows
    const win: string[] = [];
    for (let wy = top + 14; wy < p.y + p.h - 14; wy += 20) {
      for (let wx = x + 10; wx < x + w - 12; wx += 18) if (rand() < 0.55) win.push(`M${wx.toFixed(0)} ${wy.toFixed(0)}h8v10h-8z`);
    }
    parts.push(<path key={`w${k}`} d={win.join('')} fill={YELLOW} opacity="0.9" />);
    if (towers && rand() < 0.45) {
      const tx = x + w * 0.3;
      parts.push(
        <g key={`t${k}`} stroke={color} strokeWidth="4">
          <path d={`M${tx} ${top}l6 -26M${tx + 26} ${top}l-6 -26M${tx + 3} ${top - 12}h20`} />
          <rect x={tx - 2} y={top - 58} width="30" height="32" fill={color} />
          <path d={`M${tx - 4} ${top - 58}l17 -12 17 12z`} fill={color} />
        </g>
      );
    }
    x += w + 2 + rand() * 6;
    k++;
  }
  return <g clipPath={`url(#pp-clip-${seed})`}>{parts}</g>;
}

function SpeedLines({ cx, cy, r0, r1, n, color, seed }: { cx: number; cy: number; r0: number; r1: number; n: number; color: string; seed: number }) {
  const rand = seeded(seed);
  const d = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rand() * 0.06;
    const rr = r0 + rand() * 30;
    return `M${(cx + Math.cos(a) * rr).toFixed(0)} ${(cy + Math.sin(a) * rr).toFixed(0)}L${(cx + Math.cos(a) * r1).toFixed(0)} ${(cy + Math.sin(a) * r1).toFixed(0)}`;
  }).join('');
  return <path d={d} stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.55" />;
}

function Caption({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="56" fill={YELLOW} stroke={K} strokeWidth="5" />
      <text x={x + 18} y={y + 38} className="pp-caption">
        {text}
      </text>
    </g>
  );
}

function Balloon({ x, y, w, text, tail = 'left' }: { x: number; y: number; w: number; text: string; tail?: 'left' | 'right' }) {
  const tx = tail === 'left' ? x + w * 0.25 : x + w * 0.75;
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry="44" fill="#FFFEFA" stroke={K} strokeWidth="5" />
      <path d={`M${tx - 14} ${y + 36}L${tx + (tail === 'left' ? -26 : 26)} ${y + 82}L${tx + 16} ${y + 38}`} fill="#FFFEFA" stroke={K} strokeWidth="5" strokeLinejoin="round" />
      <rect x={tx - 14} y={y + 28} width="30" height="12" fill="#FFFEFA" />
      <text x={x + w / 2} y={y + 12} textAnchor="middle" className="pp-balloon-text">
        {text}
      </text>
    </g>
  );
}

function Sfx({ x, y, text, color, r = 90, rot = -8 }: { x: number; y: number; text: string; color: string; r?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <polygon points={burst(x, y, r, r * 0.62, 14)} fill={color} stroke={K} strokeWidth="5" strokeLinejoin="round" />
      <text x={x} y={y + 18} textAnchor="middle" className="pp-sfx">
        {text}
      </text>
    </g>
  );
}

export default function PopTerrain({ layout }: { layout: MapLayout }) {
  const [p1, p2, p3, p4, p5, p6, p7, p8, p9] = PANELS as [Panel, Panel, Panel, Panel, Panel, Panel, Panel, Panel, Panel];
  return (
    <>
      <defs>
        {PANELS.map((p, i) => (
          <g key={i}>
            <clipPath id={`pp-clip-${i}`}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} />
            </clipPath>
            <pattern id={`pp-dots-${i}`} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <circle cx="9" cy="9" r="3.4" fill={p.dots} />
            </pattern>
          </g>
        ))}
      </defs>

      {/* the page */}
      <rect width={layout.size.w} height={layout.size.h} fill={PAPER} />

      {PANELS.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={p.bg} />
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={`url(#pp-dots-${i})`} opacity="0.32" />
        </g>
      ))}

      {/* 1: masthead */}
      <g clipPath="url(#pp-clip-0)">
        <SpeedLines cx={p1.x + 400} cy={p1.y + 210} r0={120} r1={520} n={34} color={RED} seed={3} />
        <Skyline p={p1} seed={0} color={BLUE} />
        <text x={p1.x + 40} y={p1.y + 150} className="pp-masthead">
          Pop-Panel
        </text>
        <text x={p1.x + 40} y={p1.y + 236} className="pp-masthead pp-masthead-2">
          City!
        </text>
        <Caption x={p1.x} y={p1.y} w={470} text="Meanwhile, somewhere loud..." />
      </g>

      {/* 2: the way home, framed by speed lines */}
      <g clipPath="url(#pp-clip-1)">
        <SpeedLines cx={p2.x + p2.w / 2} cy={p2.y + 210} r0={130} r1={520} n={48} color="#FFFEFA" seed={7} />
        <Skyline p={p2} seed={1} color="#0E2A7A" towers={false} />
      </g>

      {/* 3: the paper */}
      <g clipPath="url(#pp-clip-2)">
        <Skyline p={p3} seed={2} color={RED} />
        <g transform={`rotate(-6 ${p3.x + 360} ${p3.y + 180})`}>
          <rect x={p3.x + 150} y={p3.y + 60} width="430" height="250" fill="#FFFEFA" stroke={K} strokeWidth="5" />
          <text x={p3.x + 365} y={p3.y + 120} textAnchor="middle" className="pp-paper-title">
            The Daily Byte
          </text>
          <path d={`M${p3.x + 170} ${p3.y + 136}h390`} stroke={K} strokeWidth="3" />
          <text x={p3.x + 365} y={p3.y + 182} textAnchor="middle" className="pp-paper-headline">
            Local engineer ships
          </text>
          <text x={p3.x + 365} y={p3.y + 222} textAnchor="middle" className="pp-paper-headline">
            eleven live projects!
          </text>
          <path d={`M${p3.x + 180} ${p3.y + 250}h170M${p3.x + 180} ${p3.y + 268}h150M${p3.x + 180} ${p3.y + 286}h160M${p3.x + 380} ${p3.y + 250}h170M${p3.x + 380} ${p3.y + 268}h140M${p3.x + 380} ${p3.y + 286}h160`} stroke={K} strokeWidth="5" opacity="0.4" />
        </g>
        <Balloon x={p3.x + 470} y={p3.y + 360} w={220} text="Extra! Extra!" tail="left" />
      </g>

      {/* 4-6: landmark panels get a skyline backdrop and a few beats of noise */}
      <g clipPath="url(#pp-clip-3)">
        <Skyline p={{ ...p4, h: p4.h - 150 }} seed={3} color={BLUE} />
        <rect x={p4.x} y={p4.y + p4.h - 150} width={p4.w} height="150" fill="#E8414A" />
        <path d={`M${p4.x} ${p4.y + p4.h - 150}h${p4.w}`} stroke={K} strokeWidth="5" />
        <Caption x={p4.x} y={p4.y} w={300} text="Uptown, after dark..." />
      </g>
      <g clipPath="url(#pp-clip-4)">
        <Skyline p={{ ...p5, h: p5.h - 180 }} seed={4} color={BLUE} />
        <rect x={p5.x} y={p5.y + p5.h - 180} width={p5.w} height="180" fill="#6DBB3B" />
        <path d={`M${p5.x} ${p5.y + p5.h - 180}h${p5.w}`} stroke={K} strokeWidth="5" />
        <Sfx x={p5.x + 640} y={p5.y + 110} text="WHAM!" color={YELLOW} r={86} rot={10} />
      </g>
      <g clipPath="url(#pp-clip-5)">
        <Skyline p={{ ...p6, h: p6.h - 150 }} seed={5} color="#7A0A1C" />
        <rect x={p6.x} y={p6.y + p6.h - 150} width={p6.w} height="150" fill={SKY} />
        <path d={`M${p6.x} ${p6.y + p6.h - 150}h${p6.w}`} stroke={K} strokeWidth="5" />
        <Caption x={p6.x + p6.w - 320} y={p6.y} w={320} text="The stacks, at noon." />
      </g>

      {/* 7-9: the bottom tier: two gates either side of a rooftop chase */}
      <g clipPath="url(#pp-clip-6)">
        <Skyline p={p7} seed={6} color="#141633" />
        <SpeedLines cx={p7.x + 250} cy={p7.y + 260} r0={110} r1={420} n={26} color={SKY} seed={11} />
      </g>
      <g clipPath="url(#pp-clip-7)">
        <SpeedLines cx={p8.x + 120} cy={p8.y + 120} r0={160} r1={1200} n={40} color={RED} seed={13} />
        <Skyline p={p8} seed={7} color={BLUE} />
        <Caption x={p8.x} y={p8.y} w={430} text="Later, on the rooftops..." />
        <Sfx x={p8.x + 900} y={p8.y + 110} text="ZIP!" color="#FFFEFA" r={70} rot={-12} />
        <Balloon x={p8.x + 560} y={p8.y + 120} w={230} text="Nice swing!" tail="right" />
      </g>
      <g clipPath="url(#pp-clip-8)">
        <Skyline p={p9} seed={8} color="#141633" />
        <SpeedLines cx={p9.x + 250} cy={p9.y + 260} r0={110} r1={420} n={26} color={SKY} seed={17} />
      </g>

      {/* ink borders over everything */}
      {PANELS.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill="none" stroke={K} strokeWidth="9" strokeLinejoin="round" />
      ))}
    </>
  );
}
