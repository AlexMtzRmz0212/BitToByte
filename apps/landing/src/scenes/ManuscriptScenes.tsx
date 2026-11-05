import type { CSSProperties } from 'react';
import './scenes.css';

// Arrival scenes for Hogwarts's projects: a few seconds of what
// each one does, in the world's ink. Theme tokens only, so they follow the
// palette; every animation is transform or opacity and runs once.

const ink = { stroke: 'var(--w-ink)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** FedEthics: the scales settle level, and the newsletter goes out. */
export function ScalesScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <g {...ink} fill="none" strokeWidth="2.4">
        <path d="M160 100V34M128 100h64M140 100l20-12 20 12" />
        <circle cx="160" cy="32" r="4" fill="var(--w-ink)" />
        <g className="sc-beam">
          <path d="M96 32H224" strokeWidth="3" />
          <g className="sc-pan sc-pan-l">
            <path d="M96 32l-16 34M96 32l16 34" strokeWidth="1.4" />
            <path d="M76 66q20 14 40 0z" fill="var(--w-deco-1)" fillOpacity="0.7" />
          </g>
          <g className="sc-pan sc-pan-r">
            <path d="M224 32l-16 34M224 32l16 34" strokeWidth="1.4" />
            <path d="M204 66q20 14 40 0z" fill="var(--w-deco-1)" fillOpacity="0.7" />
          </g>
        </g>
      </g>
      <g className="sc-letter" {...ink} strokeWidth="1.8" fill="var(--w-surface)">
        <rect x="262" y="58" width="34" height="22" />
        <path d="M262 58l17 13 17-13" fill="none" />
        <circle cx="279" cy="72" r="3.5" fill="var(--w-accent)" stroke="none" />
      </g>
    </svg>
  );
}

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

function Odometer({ x, label, stop, delay }: { x: number; label: string; stop: number; delay: number }) {
  const id = `sc-odo-${x}`;
  return (
    <g transform={`translate(${x} 22)`}>
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width="56" height="44" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="56" height="44" fill="var(--w-surface)" {...ink} strokeWidth="2" />
      <g clipPath={`url(#${id})`}>
        <g className="sc-roll" style={{ '--stop': `${-stop * 44}px`, animationDelay: `${delay}ms` } as CSSProperties}>
          {DIGITS.map((d) => (
            <text key={d} x="28" y={32 + d * 44} textAnchor="middle" className="sc-digit">
              {d}
            </text>
          ))}
        </g>
      </g>
      <path d="M0 22h56" stroke="var(--w-ink)" strokeOpacity="0.25" />
      <text x="28" y="66" textAnchor="middle" className="sc-caption">
        {label}
      </text>
    </g>
  );
}

/** Express Entry: the ledger board ticks over to the latest draw. */
export function LedgerScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <rect x="20" y="10" width="280" height="90" fill="none" {...ink} strokeWidth="2.4" />
      <Odometer x={52} label="round" stop={7} delay={0} />
      <Odometer x={132} label="score" stop={4} delay={180} />
      <Odometer x={212} label="invites" stop={9} delay={360} />
    </svg>
  );
}

/** Habits: the shadow sweeps the dial while a week of good days blooms. */
export function SundialScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <g {...ink} fill="none">
        <ellipse cx="100" cy="64" rx="70" ry="24" fill="var(--w-surface)" strokeWidth="2.4" />
        {Array.from({ length: 13 }, (_, i) => {
          const a = Math.PI + (i / 12) * Math.PI;
          return (
            <path key={i} d={`M${100 + Math.cos(a) * 52} ${64 + Math.sin(a) * 18}L${100 + Math.cos(a) * 64} ${64 + Math.sin(a) * 22}`} strokeWidth="1.2" />
          );
        })}
        <g className="sc-shadow">
          <path d="M100 64L44 58" stroke="var(--w-ink)" strokeOpacity="0.4" strokeWidth="8" />
        </g>
        <path d="M100 64L124 22V64Z" fill="var(--w-deco-1)" fillOpacity="0.75" strokeWidth="2" />
        <path d="M86 88h28" strokeWidth="2.4" />
      </g>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} transform={`translate(${196 + (i % 4) * 30} ${i < 4 ? 44 : 80})`}>
          <path d="M0 0v14" stroke="var(--w-deco-3)" strokeWidth="2" />
          <g className="sc-bloom" style={{ animationDelay: `${400 + i * 140}ms` }}>
            <circle r="9" fill={i % 3 === 1 ? 'var(--w-accent)' : 'var(--w-deco-3)'} fillOpacity="0.7" {...ink} strokeWidth="1.4" />
            <circle r="3" fill="var(--w-deco-1)" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** `count` points evenly spaced along an ellipse, walking clockwise from its left end. */
function alongEllipse(cx: number, cy: number, rx: number, ry: number, count: number) {
  const STEPS = 720;
  const at = (i: number) => {
    const a = Math.PI + (i / STEPS) * Math.PI * 2;
    return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  };
  const lengths = [0];
  let total = 0;
  for (let i = 1; i <= STEPS; i++) {
    const p = at(i - 1);
    const q = at(i);
    total += Math.hypot(q.x - p.x, q.y - p.y);
    lengths.push(total);
  }
  return Array.from({ length: count }, (_, n) => at(lengths.findIndex((l) => l >= (total * n) / count)));
}

// The medal, then five decades of ten small beads with a large one between them.
const ROSARY_LOOP = alongEllipse(204, 55, 100, 40, 55).slice(1);
const ROSARY_TAIL = [
  { x: 52, large: true },
  { x: 64, large: false },
  { x: 72, large: false },
  { x: 80, large: false },
  { x: 91, large: true },
];

function Bead({ x, y, large, order }: { x: number; y: number; large: boolean; order: number }) {
  const r = large ? 4.4 : 2.8;
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="var(--w-surface)" {...ink} strokeWidth="1.1" />
      <circle
        cx={x}
        cy={y}
        r={r}
        className="sc-bead"
        fill={large ? 'var(--w-accent)' : 'var(--w-deco-1)'}
        {...ink}
        strokeWidth="1.1"
        style={{ animationDelay: `${order * 45}ms` }}
      />
    </>
  );
}

/** Rosary: the prayer is told bead by bead, from the cross around the whole loop. */
export function BeadsScene() {
  const tail = ROSARY_TAIL.length;
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <g {...ink} fill="none">
        <ellipse cx="204" cy="55" rx="100" ry="40" strokeWidth="1" />
        <path d="M40 55H104" strokeWidth="1" />
        <path d="M16 55H40M31 46V64" strokeWidth="4" />
      </g>
      {ROSARY_TAIL.map(({ x, large }, i) => (
        <Bead key={x} x={x} y={55} large={large} order={i} />
      ))}
      <circle cx="104" cy="55" r="6" fill="var(--w-deco-1)" {...ink} strokeWidth="1.6" />
      {ROSARY_LOOP.map(({ x, y }, i) => (
        <Bead key={i} x={x} y={y} large={(i + 1) % 11 === 0} order={tail + i} />
      ))}
    </svg>
  );
}

// Lit top-down, the way the house is scrolled: attic first, then each floor.
const WOODSTONE_WINDOWS = [
  { x: 78, y: 44 },
  { x: 111, y: 52 },
  { x: 131, y: 52 },
  { x: 151, y: 52 },
  { x: 171, y: 52 },
  { x: 191, y: 52 },
  { x: 78, y: 70 },
  { x: 111, y: 74 },
  { x: 131, y: 74 },
  { x: 171, y: 74 },
  { x: 191, y: 74 },
  { x: 227, y: 74 },
];

/** Woodstone: the house wakes floor by floor, then a cold spot gives up its ghost. */
export function HauntingScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <path d="M282 10a15 15 0 1 0 12 25a12 12 0 1 1-12-25z" fill="var(--w-deco-1)" {...ink} strokeWidth="1.6" />
      <path d="M38 100V68M38 84l-11-11M38 76l10-12M27 73l-4-9M48 64l5-7" {...ink} fill="none" strokeWidth="2" />
      <g {...ink} fill="var(--w-surface)" strokeWidth="2.4">
        <rect x="186" y="18" width="10" height="20" />
        <rect x="68" y="36" width="32" height="64" />
        <path d="M62 36L84 8L106 36Z" />
        <rect x="214" y="64" width="38" height="36" />
        <path d="M208 64L233 46L258 64Z" />
        <rect x="100" y="46" width="114" height="54" />
        <path d="M92 46L157 16L222 46Z" />
        <path d="M147 100V82a10 10 0 0 1 20 0V100" />
      </g>
      <circle cx="157" cy="33" r="5" fill="var(--w-ink)" fillOpacity="0.16" />
      <circle cx="157" cy="33" r="5" className="sc-window" fill="var(--w-deco-1)" />
      {WOODSTONE_WINDOWS.map(({ x, y }, i) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="12" height="14" fill="var(--w-ink)" fillOpacity="0.16" />
          <rect
            x={x}
            y={y}
            width="12"
            height="14"
            className="sc-window"
            fill="var(--w-deco-1)"
            style={{ animationDelay: `${(i + 1) * 120}ms` }}
          />
        </g>
      ))}
      <path d="M20 100H300" {...ink} fill="none" strokeWidth="2.4" />
      <ellipse cx="284" cy="99" rx="17" ry="4" className="sc-cold" fill="var(--w-accent)" fillOpacity="0.35" stroke="var(--w-accent)" strokeWidth="1.4" />
      <g className="sc-ghost" {...ink} strokeWidth="2">
        <path d="M274 97V74a10 10 0 0 1 20 0V97l-5-4-5 4-5-4z" fill="var(--w-surface)" />
        <circle cx="280" cy="75" r="1.6" fill="var(--w-ink)" stroke="none" />
        <circle cx="288" cy="75" r="1.6" fill="var(--w-ink)" stroke="none" />
      </g>
    </svg>
  );
}
