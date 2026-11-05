import type { CSSProperties } from 'react';
import './scenes.css';

// Arrival scenes for Overworld's projects. Blocky by design: squares,
// hard edges, stepped motion.

const block = (x: number, y: number, s: number, cls: string, style?: CSSProperties) => (
  <rect x={x} y={y} width={s} height={s} className={cls} style={style} />
);

/** AI Task Sorter: four notes shuffle, then settle into urgent/important quadrants. */
export function SortScene() {
  const notes = [
    { cls: 'sc-note-a', from: [40, 20], to: [190, 14] },
    { cls: 'sc-note-b', from: [80, 60], to: [244, 14] },
    { cls: 'sc-note-c', from: [20, 70], to: [190, 62] },
    { cls: 'sc-note-d', from: [110, 26], to: [244, 62] },
  ];
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <rect x="180" y="6" width="120" height="98" className="sc-board" />
      <path d="M240 6v98M180 55h120" className="sc-grid" />
      {notes.map((n, k) => (
        <g
          key={k}
          className="sc-sort"
          style={{ '--fx': `${n.from[0]! - n.to[0]!}px`, '--fy': `${n.from[1]! - n.to[1]!}px`, animationDelay: `${200 + k * 160}ms` } as CSSProperties}
        >
          {block(n.to[0]!, n.to[1]!, 42, `sc-note ${n.cls}`)}
          <path d={`M${n.to[0]! + 8} ${n.to[1]! + 14}h26M${n.to[0]! + 8} ${n.to[1]! + 24}h18`} className="sc-scribble" />
        </g>
      ))}
    </svg>
  );
}

// One ladder rung and its seal-in branch, in the order power reaches each part.
const LADDER_STEPS = [
  { wire: 'M20 38H70' },
  { block: { x: 70, y: 20, label: 'START' } },
  { wire: 'M106 38H150' },
  { block: { x: 150, y: 20, label: 'STOP' } },
  { wire: 'M186 38H236' },
  { block: { x: 236, y: 20, label: 'M1', coil: true } },
  { wire: 'M272 38H300' },
  { wire: 'M50 38V80H70' },
  { block: { x: 70, y: 62, label: 'M1' } },
  { wire: 'M106 80H128V38' },
];

/** PLC Showcase: START closes, power walks the rung, and the coil seals itself in. */
export function LadderScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <path d="M20 6V104M300 6V104" className="sc-ladder-rail" />
      {LADDER_STEPS.map(({ wire, block: part }, k) => {
        const style = { animationDelay: `${200 + k * 220}ms` };
        return wire ? (
          <g key={k}>
            <path d={wire} className="sc-grid" />
            <path d={wire} className="sc-ladder-wire sc-live" style={style} />
          </g>
        ) : part ? (
          <g key={k}>
            {block(part.x, part.y, 36, 'sc-source')}
            {block(part.x, part.y, 36, `sc-note ${part.coil ? 'sc-note-a' : 'sc-note-b'} sc-live`, style)}
            <text x={part.x + 18} y={part.y + 22} textAnchor="middle" className="sc-ladder-tag">
              {part.label}
            </text>
          </g>
        ) : null;
      })}
    </svg>
  );
}

/** ProjectsTracker: the timer ring runs while the heatmap fills in. */
export function TimerScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <circle cx="60" cy="55" r="38" className="sc-ring-back" />
      <circle cx="60" cy="55" r="38" className="sc-ring" pathLength={1} transform="rotate(-90 60 55)" />
      <rect x="54" y="30" width="12" height="28" className="sc-hand" />
      {Array.from({ length: 28 }, (_, k) => (
        <rect
          key={k}
          x={130 + (k % 7) * 24}
          y={14 + Math.floor(k / 7) * 22}
          width="18"
          height="18"
          className={`sc-heat sc-heat-${(k * 7) % 4}`}
          style={{ animationDelay: `${300 + k * 45}ms` }}
        />
      ))}
    </svg>
  );
}

/** Hack the Hill III: tickets from four systems fall into one queue. */
export function QueueScene() {
  const sources = [
    { x: 20, y: 10 },
    { x: 20, y: 80 },
    { x: 92, y: 10 },
    { x: 92, y: 80 },
  ];
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <rect x="170" y="38" width="140" height="34" className="sc-board" />
      {sources.map((s, k) => (
        <g key={k}>
          {block(s.x, s.y, 20, 'sc-source')}
          <g
            className="sc-ticket"
            style={{ '--fx': `${s.x - (180 + k * 30)}px`, '--fy': `${s.y - 45}px`, animationDelay: `${150 + k * 220}ms` } as CSSProperties}
          >
            {block(180 + k * 30, 45, 20, `sc-note sc-note-${'abcd'[k]}`)}
          </g>
        </g>
      ))}
      <path d="M120 55h40l-8 -6M160 55l-8 6" className="sc-grid" />
    </svg>
  );
}
