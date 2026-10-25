import type { MapLayout } from '../../data/worlds';
import { blob, smoothOpen } from '../shared/sketch';
import {
  AIRPORT,
  BLOCKS,
  COAST,
  FWY_BOTTOM,
  FWY_TOP,
  FWY_WEST,
  FWY_X,
  FWY_Y,
  GRID,
  HILLS,
  PALMS,
  TOWERS,
  coastY,
  hillY,
  type Block,
} from './city';

// Los Santos, drawn as a sunset atlas: flat colour from straight above, the
// sun going down over the ocean in the south-west, so every tower throws a
// long shadow east. Landmarks and gates stand up off the page.

const f = (n: number) => Math.round(n * 10) / 10;

const coastPath = () => smoothOpen(COAST);
const hillPath = () => `${smoothOpen(HILLS)}V-20H-20Z`;

export default function SunsetTerrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  return (
    <>
      <defs>
        <linearGradient id="ls-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C8DB0" />
          <stop offset="1" stopColor="#1A4F7A" />
        </linearGradient>
        <radialGradient id="ls-sunset" cx="0.05" cy="1" r="1.1">
          <stop offset="0" stopColor="#FF7A59" stopOpacity="0.5" />
          <stop offset="0.45" stopColor="#FF9A6B" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFB238" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ls-hills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9C8F64" />
          <stop offset="1" stopColor="#B7A877" />
        </linearGradient>
        <clipPath id="ls-land">
          <path d={`${coastPath()}V-20H-20Z`} />
        </clipPath>
      </defs>

      <rect width={w} height={h} className="ls-land" />
      <Hills />
      <Streets />
      <Blocks />
      <Ocean />
      <Airport />
      <Freeways />
      <Downtown />
      {PALMS.map((p, k) => (
        <Palm key={k} x={p.x} y={p.y} seed={k} />
      ))}
      <Pier />
      <Sign />

      <text x="620" y="1420" textAnchor="middle" className="ls-label ls-label-sea">
        Pacific Ocean
      </text>
      <text x="1160" y="378" textAnchor="middle" className="ls-label">
        Downtown
      </text>
      <text x="640" y="1290" textAnchor="middle" className="ls-label ls-label-small">
        Del Perro Pier
      </text>

      <rect width={w} height={h} fill="url(#ls-sunset)" className="ls-sunwash" />
    </>
  );
}

/* ------------------------------------------------------------ hills, sign */

function Hills() {
  return (
    <g>
      <path d={hillPath()} fill="url(#ls-hills)" className="ls-hill" />
      {[40, 80, 120, 160].map((dy) => (
        <path key={dy} d={smoothOpen(HILLS.map((p) => ({ x: p.x, y: p.y - dy + Math.sin(p.x / 140) * 10 })))} className="ls-contour" />
      ))}
      {[
        [300, 120, 90, 40],
        [1420, 110, 120, 50],
        [1900, 90, 80, 36],
      ].map(([x, y, rx, ry], k) => (
        <path key={k} d={blob(x!, y!, rx!, ry!, k + 7, 0.2, 10)} className="ls-scrub" />
      ))}
      {/* the observatory */}
      <g transform="translate(1640 168)">
        <ellipse cx="22" cy="6" rx="60" ry="10" className="ls-shadow" />
        <rect x="-46" y="-26" width="92" height="30" className="ls-white" />
        <path d="M-20 -26a20 20 0 0 1 40 0Z" className="ls-dome" />
        <path d="M-52 -26a10 10 0 0 1 20 0ZM32 -26a10 10 0 0 1 20 0Z" className="ls-dome" />
        <rect x="-8" y="-12" width="16" height="16" className="ls-door" />
      </g>
    </g>
  );
}

function Sign() {
  const letters = 'BITTOBYTE'.split('');
  return (
    <g className="ls-sign">
      {letters.map((ch, k) => {
        const x = 560 + k * 50;
        const y = hillY(x) - 70 + (k % 2) * 6;
        return (
          <g key={k}>
            <path d={`M${x - 14} ${y + 4}v18M${x + 14} ${y + 4}v18`} className="ls-sign-leg" />
            <text x={x} y={y} textAnchor="middle" className="ls-sign-letter">
              {ch}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* --------------------------------------------------------- streets, blocks */

function Streets() {
  let d = '';
  for (let x = GRID / 2; x < 2200; x += GRID) d += `M${x} ${f(hillY(x) + 10)}V${f(coastY(x) - 30)}`;
  for (let y = 360; y < 1400; y += GRID) d += `M0 ${y}H2200`;
  return (
    <g clipPath="url(#ls-land)">
      <path d={d} className="ls-street-edge" />
      <path d={d} className="ls-street" />
      {/* the beach road and the boulevards */}
      <path d={smoothOpen(COAST.map((p) => ({ x: p.x, y: p.y - 70 })))} className="ls-blvd-edge" />
      <path d={smoothOpen(COAST.map((p) => ({ x: p.x, y: p.y - 70 })))} className="ls-blvd" />
      <path d="M600 330V1180M2000 300V1180" className="ls-blvd-edge" />
      <path d="M600 330V1180M2000 300V1180" className="ls-blvd" />
    </g>
  );
}

function rects(list: Block[]) {
  return list.map((b) => `M${f(b.x)} ${f(b.y)}h${f(b.w)}v${f(b.h)}h${f(-b.w)}Z`).join('');
}

function Blocks() {
  const by = (k: Block['kind']) => rects(BLOCKS.filter((b) => b.kind === k));
  const parks = BLOCKS.filter((b) => b.kind === 'park');
  return (
    <g>
      {parks.map((b, k) => (
        <g key={k}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="10" className="ls-park" />
          <path d={blob(b.x + b.w * 0.35, b.y + b.h * 0.4, 18, 14, k + 1)} className="ls-tree" />
          <path d={blob(b.x + b.w * 0.68, b.y + b.h * 0.62, 22, 16, k + 9)} className="ls-tree" />
        </g>
      ))}
      <path d={rects(BLOCKS.filter((b) => b.kind.startsWith('house')).map((b) => ({ ...b, x: b.x + 4, y: b.y + 2 })))} className="ls-shadow" />
      <path d={by('house-a')} className="ls-roof-a" />
      <path d={by('house-b')} className="ls-roof-b" />
      <path d={by('house-c')} className="ls-roof-c" />
      <path d={by('pool')} className="ls-pool" />
    </g>
  );
}

/* ------------------------------------------------------------------ water */

function Ocean() {
  const coast = coastPath();
  return (
    <g>
      <path d={coast} className="ls-beach" />
      <path d={`${coast}V1520H-20Z`} fill="url(#ls-ocean)" />
      <path d={coast} className="ls-surf" />
      {/* the sun's road on the water */}
      <path d="M-20 1500L360 1180L460 1200L120 1520Z" className="ls-glare" />
      {Array.from({ length: 18 }, (_, k) => {
        const x = 40 + ((k * 211) % 2100);
        const y = coastY(x) + 40 + ((k * 37) % 90);
        return <path key={k} d={`M${x} ${f(y)}q12 -6 24 0t24 0`} className="ls-wave" style={{ animationDelay: `${-k * 0.6}s` }} />;
      })}
      {/* marina */}
      <g>
        <path d="M30 960H250M60 960v110M110 960v110M160 960v110M210 960v110" className="ls-dock" />
        {[
          [80, 990],
          [86, 1040],
          [134, 1000],
          [186, 1030],
          [232, 990],
        ].map(([x, y], k) => (
          <path key={k} d={`M${x! - 8} ${y}q8 -26 16 0q-8 8 -16 0Z`} className="ls-boat" />
        ))}
      </g>
      {/* a yacht heading out */}
      <g className="ls-yacht">
        <path d="M1300 1420l60 -10 14 10 -14 10Z" className="ls-boat" />
        <path d="M1300 1420h-120" className="ls-wake" />
      </g>
    </g>
  );
}

function Pier() {
  return (
    <g>
      <rect x="456" y="1150" width="28" height="270" className="ls-pier" />
      <path d="M440 1400H630V1452H440Z" className="ls-pier" />
      <path d={Array.from({ length: 9 }, (_, k) => `M456 ${1170 + k * 28}h28`).join('')} className="ls-plank" />
      {/* the wheel */}
      <g transform="translate(570 1360)">
        <path d="M-30 40L0 0 30 40" className="ls-wheel-leg" />
        <g className="ls-wheel">
          <circle r="48" className="ls-wheel-rim" />
          {Array.from({ length: 12 }, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            return (
              <g key={k}>
                <path d={`M0 0L${f(Math.cos(a) * 48)} ${f(Math.sin(a) * 48)}`} className="ls-wheel-spoke" />
                <circle cx={f(Math.cos(a) * 48)} cy={f(Math.sin(a) * 48)} r="5" className={k % 3 ? 'ls-gondola' : 'ls-gondola ls-gondola-lit'} />
              </g>
            );
          })}
        </g>
      </g>
      {/* roller coaster track */}
      <path d="M460 1446c20 -40 40 -40 60 0s40 -50 60 0 30 -20 40 0" className="ls-coaster" />
    </g>
  );
}

/* --------------------------------------------------------------- freeways */

function Freeways() {
  // The east-west freeway starts where it leaves the coast highway.
  const ew = `M${FWY_WEST} ${FWY_Y}H2220`;
  const ns = `M${FWY_X} ${FWY_TOP}V${FWY_BOTTOM}`;
  // The cloverleaf: one loop ramp in each quarter of the crossing.
  const loops = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([sx, sy]) => {
    const cx = FWY_X + sx! * 62;
    const cy = FWY_Y + sy! * 62;
    return `M${cx - 44} ${cy}a44 44 0 1 0 88 0a44 44 0 1 0 -88 0`;
  });
  return (
    <g>
      <path d={loops.join('')} className="ls-ramp-edge" />
      <path d={loops.join('')} className="ls-ramp" />
      {[ew, ns].map((d) => (
        <g key={d}>
          <path d={d} className="ls-fwy-shadow" />
          <path d={d} className="ls-fwy-edge" />
          <path d={d} className="ls-fwy" />
          <path d={d} className="ls-fwy-lanes" />
        </g>
      ))}
      <path d={ew} className="ls-fwy-median" />
      <path d={ns} className="ls-fwy-median" />
      {/* the coast highway the north-south freeway runs into */}
      <path d={smoothOpen(COAST.map((p) => ({ x: p.x, y: p.y - 30 })))} className="ls-hwy-edge" />
      <path d={smoothOpen(COAST.map((p) => ({ x: p.x, y: p.y - 30 })))} className="ls-hwy" />
    </g>
  );
}

/* ------------------------------------------------------- downtown, airport */

function Downtown() {
  const shadows = TOWERS.map((t) => `M${f(t.x)} ${f(t.y)}h${f(t.w)}l${f(t.z)} ${f(t.z * 0.35)}v${f(t.h)}h${f(-t.w)}l${f(-t.z)} ${f(-t.z * 0.35)}Z`).join('');
  return (
    <g>
      <path d={shadows} className="ls-tower-shadow" />
      {TOWERS.map((t, k) => (
        <g key={k}>
          <rect x={t.x} y={t.y} width={t.w} height={t.h} className={`ls-tower ls-tower-${t.tone}`} />
          <rect x={t.x + 4} y={t.y + 4} width={t.w - 8} height={t.h - 8} className="ls-tower-inner" />
          {t.z > 90 ? (
            <g>
              <circle cx={t.x + t.w / 2} cy={t.y + t.h / 2} r="9" className="ls-helipad" />
              <path d={`M${t.x + t.w / 2 - 3} ${t.y + t.h / 2 - 4}v8M${t.x + t.w / 2 + 3} ${t.y + t.h / 2 - 4}v8M${t.x + t.w / 2 - 3} ${t.y + t.h / 2}h6`} className="ls-helipad-h" />
            </g>
          ) : (
            <rect x={t.x + 8} y={t.y + 8} width="8" height="6" className="ls-ac" />
          )}
        </g>
      ))}
    </g>
  );
}

function Airport() {
  const { x0, y0 } = AIRPORT;
  return (
    <g>
      <path d={`M${x0} ${y0}H2220V${coastY(2200) - 10}L${x0} ${coastY(x0) - 20}Z`} className="ls-tarmac" />
      <g transform={`rotate(-6 ${x0} ${y0})`}>
        <rect x={x0 + 40} y={y0 + 70} width="380" height="40" className="ls-runway" />
        <path d={`M${x0 + 60} ${y0 + 90}h340`} className="ls-runway-line" />
        <rect x={x0 + 60} y={y0 + 150} width="300" height="22" className="ls-runway" />
      </g>
      <rect x={x0 + 30} y={y0 + 10} width="150" height="40" className="ls-terminal" />
      <g transform={`translate(${x0 + 260} ${y0 + 30}) rotate(-6)`}>
        <path d="M-30 0h60M0 -26v52M-8 0l-6 -24h4l10 24M-8 0l-6 24h4l10 -24M24 -2l8 -10h3l-4 12 4 12h-3l-8 -10" className="ls-plane" />
      </g>
    </g>
  );
}

function Palm({ x, y, seed }: { x: number; y: number; seed: number }) {
  const turn = (seed * 47) % 360;
  return (
    <g>
      <path d={`M${x + 6} ${y + 4}l26 10`} className="ls-palm-shadow" />
      <g transform={`translate(${x} ${y}) rotate(${turn})`} className="ls-palm">
        <path d="M0 0L-14 -4L-2 2L-6 14L2 2L14 6L2 -2L8 -14Z" />
      </g>
      <circle cx={x} cy={y} r="2.4" className="ls-palm-core" />
    </g>
  );
}
