import { seeded, smoothOpen } from '../shared/sketch';
import { INK, OXBLOOD, GOLD, PAPER } from './ink';

// The busier parts of the estate: wings of small rooms, a spiral stair, a
// passage nobody admits to, candles, birds and a quill that keeps redrawing
// its own flourish. Scenery only; it gives the eye somewhere to wander.

const WINGS = [
  { x: 300, y: 890, cols: 4, rows: 2, w: 80, h: 58, label: 'West Wing' },
  { x: 860, y: 432, cols: 5, rows: 1, w: 68, h: 82, label: 'North Range' },
  { x: 1990, y: 916, cols: 2, rows: 2, w: 80, h: 60, label: 'East Lodgings' },
] as const;

function Wing({ x, y, cols, rows, w, h, label, seed }: (typeof WINGS)[number] & { seed: number }) {
  const rand = seeded(seed);
  return (
    <g fill="none" stroke={INK}>
      <rect x={x} y={y} width={cols * w} height={rows * h} strokeWidth="2.8" fill={PAPER} fillOpacity="0.5" />
      {Array.from({ length: cols - 1 }, (_, i) => (
        <path key={`c${i}`} d={`M${x + (i + 1) * w} ${y}v${rows * h}`} strokeWidth="1.8" />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <path key={`r${i}`} d={`M${x} ${y + (i + 1) * h}h${cols * w}`} strokeWidth="1.8" />
      ))}
      {/* doorways and a bit of furniture in each room */}
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = x + (i % cols) * w;
        const cy = y + Math.floor(i / cols) * h;
        const r = rand();
        return (
          <g key={i}>
            <path d={`M${cx + w * 0.35} ${cy + h}h${w * 0.3}`} stroke={PAPER} strokeWidth="4" />
            {r > 0.5 ? (
              <rect x={cx + 12} y={cy + 12} width={w * 0.34} height={h * 0.28} strokeWidth="1.1" />
            ) : (
              <circle cx={cx + w * 0.62} cy={cy + h * 0.42} r={6 + r * 6} strokeWidth="1.1" />
            )}
          </g>
        );
      })}
      <text x={x + (cols * w) / 2} y={y + rows * h + 30} textAnchor="middle" className="ms-label ms-label-small" stroke="none">
        {label}
      </text>
    </g>
  );
}

function SpiralStair({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={INK}>
      <circle r="38" strokeWidth="2.6" fill={PAPER} />
      <circle r="8" strokeWidth="1.6" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M${Math.cos(a) * 8} ${Math.sin(a) * 8}L${Math.cos(a + 0.35) * 38} ${Math.sin(a + 0.35) * 38}`} strokeWidth="1.1" />;
      })}
    </g>
  );
}

function Candle({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3.5" y="0" width="7" height="16" fill={PAPER} stroke={INK} strokeWidth="1.4" />
      <path d="M0 -14C5 -8 4 -2 0 0C-4 -2 -5 -8 0 -14Z" fill={GOLD} stroke={OXBLOOD} strokeWidth="1" className="ms-flame" />
    </g>
  );
}

function Birds({ y, delay, scale = 1 }: { y: number; delay: number; scale?: number }) {
  return (
    <g className="ms-birds" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(0 ${y}) scale(${scale})`} fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round">
        <path d="M0 0q8-8 16 0q8-8 16 0" />
        <path d="M26 -22q6-6 12 0q6-6 12 0" />
        <path d="M-18 -30q5-5 10 0q5-5 10 0" />
      </g>
    </g>
  );
}

const FLOURISH = smoothOpen([
  { x: 880, y: 236 },
  { x: 940, y: 210 },
  { x: 1000, y: 246 },
  { x: 1060, y: 220 },
  { x: 1100, y: 238 },
  { x: 1140, y: 220 },
  { x: 1200, y: 246 },
  { x: 1260, y: 210 },
  { x: 1320, y: 236 },
]);

export default function Estate() {
  return (
    <>
      {WINGS.map((wing, i) => (
        <Wing key={wing.label} {...wing} seed={60 + i} />
      ))}
      <SpiralStair x={760} y={548} />

      {/* the passage nobody admits to */}
      <path
        d="M570 872C600 960 690 1010 700 1120C706 1180 712 1214 720 1236"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeDasharray="3 9"
        strokeLinecap="round"
        opacity="0.7"
      />
      <text x="560" y="1000" transform="rotate(62 560 1000)" className="ms-label ms-label-small" opacity="0.7">
        passage, unofficial
      </text>

      <Candle x={482} y={754} />
      <Candle x={652} y={754} />
      <Candle x={1290} y={196} />
      <Candle x={836} y={590} />

      <path d={FLOURISH} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" pathLength={1} className="ms-quill" />

      <Birds y={330} delay={0} />
      <Birds y={1060} delay={-17} scale={0.8} />
    </>
  );
}
