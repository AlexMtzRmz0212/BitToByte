import { useEffect, useState } from 'react';
import { PLACES } from '../../data/worlds';
import { prefersReducedMotion } from '../../engine/motion';
import { burst } from '../shared/sketch';
import type { GateProps } from '../types';

// Pop-Panel City: the gate, the traveler, and the page's sound effects.

const K = '#161616';

/** A comic starburst door; its eye spins with speed rings in the destination's colour. */
export function PopGate({ to, at }: GateProps) {
  const tint = PLACES[to].tokens.accent;
  return (
    <g transform={`translate(${at.x} ${at.y})`} data-target={`gate:${to}`} className="pp-gate">
      <polygon points={burst(0, 0, 130, 92, 16)} fill="#FFD400" stroke={K} strokeWidth="7" strokeLinejoin="round" />
      <circle r="82" fill="#FFFEFA" stroke={K} strokeWidth="6" />
      <g className="pp-eye">
        {[70, 54, 38, 22].map((r, k) => (
          <circle key={r} r={r} fill={k % 2 ? '#FFFEFA' : tint} stroke={K} strokeWidth="3" strokeDasharray={k % 2 ? '0' : '26 10'} />
        ))}
      </g>
      <circle r="8" fill={K} />
      <rect x="-140" y="-140" width="280" height="280" fill="transparent" />
    </g>
  );
}

/** A small spider dangling from its silk line. It swings as it travels. */
export function Spider() {
  return (
    <div className="pp-spider">
      <svg viewBox="-30 -70 60 100" width="54" height="90" aria-hidden="true" focusable="false">
        <g className="pp-swing">
          <path d="M0 -70V-6" stroke={K} strokeWidth="2" />
          <g stroke={K} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M-8 4q-12 -8 -20 -2M-8 8q-14 -2 -20 6M-8 12q-12 6 -16 14M-6 15q-6 8 -8 16" />
            <path d="M8 4q12 -8 20 -2M8 8q14 -2 20 6M8 12q12 6 16 14M6 15q6 8 8 16" />
          </g>
          <ellipse cx="0" cy="8" rx="12" ry="13" className="pp-spider-body" />
          <ellipse cx="0" cy="-6" rx="9" ry="8" className="pp-spider-body" />
          <circle cx="-3.5" cy="-7" r="3.2" fill="#FFFEFA" />
          <circle cx="3.5" cy="-7" r="3.2" fill="#FFFEFA" />
          <circle cx="-3" cy="-6.5" r="1.4" fill={K} />
          <circle cx="4" cy="-6.5" r="1.4" fill={K} />
        </g>
      </svg>
    </div>
  );
}

const WORDS = ['POW!', 'ZIP!', 'BAM!', 'WHOOSH!', 'KRAK!', 'ZAP!', 'BOOM!', 'THUD!'];
const COLORS = ['#FFD400', '#FF8FB1', '#9AD0FF', '#FFFEFA'];

interface Pop {
  id: number;
  x: number;
  y: number;
  word: string;
  color: string;
  rot: number;
}

/** Sound effects that pop up around the page now and then. */
export function PopSfx() {
  const [pops, setPops] = useState<Pop[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let id = 0;
    const spawn = () => {
      if (document.hidden) return;
      const pop: Pop = {
        id: id++,
        x: 8 + Math.random() * 74,
        y: 16 + Math.random() * 56,
        word: WORDS[Math.floor(Math.random() * WORDS.length)]!,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        rot: -14 + Math.random() * 28,
      };
      setPops((list) => [...list.slice(-2), pop]);
      setTimeout(() => setPops((list) => list.filter((p) => p.id !== pop.id)), 1600);
    };
    const timer = setInterval(spawn, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pp-sfx-layer" aria-hidden="true">
      {pops.map((p) => (
        <span
          key={p.id}
          className="pp-pop"
          style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: `${p.rot}deg`, background: p.color }}
        >
          {p.word}
        </span>
      ))}
      <span className="pp-plane" />
    </div>
  );
}
