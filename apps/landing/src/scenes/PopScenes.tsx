import type { CSSProperties } from 'react';
import './scenes.css';

// Arrival scenes for New York: loud, quick, one panel each.

/** Hell o' Fame: sleeves slide onto the podium and the top spot lights up. */
export function RankingScene() {
  const sleeves = [
    { cls: 'sc-note-a', x: 136, y: 18, from: -120 },
    { cls: 'sc-note-b', x: 84, y: 40, from: -170 },
    { cls: 'sc-note-c', x: 188, y: 52, from: 140 },
  ];
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <polygon points="160,4 168,16 182,12 178,26 192,32 178,38 182,52 168,48 160,60 152,48 138,52 142,38 128,32 142,26 138,12 152,16" className="sc-burst" />
      <g className="sc-line">
        <rect x="132" y="62" width="56" height="44" className="sc-body" />
        <rect x="80" y="76" width="52" height="30" className="sc-body" />
        <rect x="188" y="84" width="52" height="22" className="sc-body" />
      </g>
      {sleeves.map((s, k) => (
        <g key={k} className="sc-slide" style={{ '--fx': `${s.from}px`, '--fy': '0px', animationDelay: `${200 + k * 200}ms` } as CSSProperties}>
          <rect x={s.x} y={s.y} width="48" height="40" className={`sc-note ${s.cls}`} />
          <circle cx={s.x + 24} cy={s.y + 20} r="9" className="sc-hole" />
        </g>
      ))}
    </svg>
  );
}

/** Banda de Guerra: the sticks strike the snare while the judges' scores land on the tablet. */
export function DrumlineScene() {
  const scores = [
    { y: 16, width: 96, cls: 'sc-note-b' },
    { y: 34, width: 112, cls: 'sc-note-c' },
    { y: 52, width: 80, cls: 'sc-note-d' },
  ];
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <g transform="translate(-34 -4)">
        <polygon points="160,4 168,16 182,12 178,26 192,32 178,38 182,52 168,48 160,60 152,48 138,52 142,38 128,32 142,26 138,12 152,16" className="sc-burst" />
      </g>
      <path d="M36 52V88a44 13 0 0 0 88 0V52Z" className="sc-note sc-note-a" />
      <path d="M36 88L50 58L66 99L80 60L94 99L110 58L124 88" className="sc-line" />
      <ellipse cx="80" cy="52" rx="44" ry="13" className="sc-board" />
      <g className="sc-stick sc-stick-l">
        <path d="M40 8L72 46" className="sc-stick-body" />
      </g>
      <g className="sc-stick sc-stick-r">
        <path d="M122 8L90 46" className="sc-stick-body" />
      </g>
      <rect x="172" y="6" width="136" height="98" rx="6" className="sc-board" />
      {scores.map((s, k) => (
        <g key={s.y} className="sc-slide" style={{ '--fx': '44px', '--fy': '0px', animationDelay: `${300 + k * 300}ms` } as CSSProperties}>
          <rect x="186" y={s.y} width={s.width} height="14" className={`sc-note ${s.cls}`} />
        </g>
      ))}
      <text x="240" y="94" textAnchor="middle" className="sc-score sc-score-b">
        28.5
      </text>
    </svg>
  );
}

const SPEECH_BARS = [14, 30, 20, 40, 24, 34, 12];
const NOTE_COLOURS = ['sc-note-a', 'sc-note-b', 'sc-note-c', 'sc-note-d'];

/** TikTok Archive: a clip plays, its speech is transcribed, and the notes file themselves. */
export function TranscribeScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <rect x="22" y="6" width="56" height="98" rx="8" className="sc-board" />
      <path d="M40 38V72L66 55Z" className="sc-hole" />
      {SPEECH_BARS.map((h, k) => (
        <rect key={k} x={94 + k * 10} y={55 - h / 2} width="6" height={h} className="sc-hole sc-live" style={{ animationDelay: `${200 + k * 110}ms` }} />
      ))}
      <rect x="176" y="6" width="130" height="98" className="sc-board" />
      {Array.from({ length: 12 }, (_, k) => (
        <g key={k} className="sc-slide" style={{ '--fx': '-70px', '--fy': '0px', animationDelay: `${1000 + k * 110}ms` } as CSSProperties}>
          <rect x={186 + (k % 4) * 28} y={15 + Math.floor(k / 4) * 28} width="24" height="24" className={`sc-note ${NOTE_COLOURS[(k * 3) % 4]}`} />
          <path d={`M${190 + (k % 4) * 28} ${23 + Math.floor(k / 4) * 28}h16M${190 + (k % 4) * 28} ${30 + Math.floor(k / 4) * 28}h10`} className="sc-scribble" />
        </g>
      ))}
    </svg>
  );
}

/** The Locker Room: a ball arcs over the pitch and the scoreboard flips. */
export function BallScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <rect x="10" y="78" width="300" height="28" className="sc-pitch" />
      <path d="M160 78v28" className="sc-chalk" />
      <g className="sc-line">
        <rect x="236" y="10" width="70" height="40" className="sc-board" />
      </g>
      <text x="254" y="40" className="sc-score sc-score-a">
        2
      </text>
      <text x="282" y="40" className="sc-score sc-score-b">
        3
      </text>
      <g className="sc-arc">
        <circle cx="0" cy="0" r="9" className="sc-ball" />
      </g>
    </svg>
  );
}

/** Marvel: spines shuffle into watch order. */
export function ShelfScene() {
  const spines = ['sc-note-a', 'sc-note-b', 'sc-note-c', 'sc-note-d', 'sc-note-a', 'sc-note-b'];
  const shuffle = [3, -2, 1, -3, 2, -1];
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <path d="M40 98h240" className="sc-line" />
      {spines.map((cls, k) => (
        <g key={k} className="sc-slide" style={{ '--fx': `${shuffle[k]! * 34}px`, '--fy': '0px', animationDelay: `${300 + k * 90}ms` } as CSSProperties}>
          <rect x={58 + k * 34} y={22 + (k % 2) * 8} width="28" height={76 - (k % 2) * 8} className={`sc-note ${cls}`} />
          <path d={`M${64 + k * 34} ${40 + (k % 2) * 8}h16`} className="sc-line" />
        </g>
      ))}
    </svg>
  );
}
