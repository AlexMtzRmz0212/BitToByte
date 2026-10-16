import type { CSSProperties } from 'react';
import './scenes.css';

// Arrival scenes for the Manuscript Realm's projects: a few seconds of what
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
