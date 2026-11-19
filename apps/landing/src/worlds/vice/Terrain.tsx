import type { MapLayout } from '../../data/worlds';
import { blob, seeded, smoothClosed, smoothOpen } from '../shared/sketch';
import {
  AIRPORT,
  BLOCKS,
  CAUSEWAYS,
  COAST,
  CONTAINERS,
  EXPRESS_Y,
  GRID,
  HOTELS,
  HWY_X,
  ISLAND_CAP,
  ISLAND_E,
  ISLAND_W,
  ISLETS,
  OCEAN_DRIVE_BOTTOM,
  OCEAN_DRIVE_TOP,
  OCEAN_DRIVE_X,
  PALMS,
  PORT,
  STOCKYARD,
  SWAMP,
  TOWERS,
  WAREHOUSES,
  xAt,
} from './city';

// Vice City at golden hour, drawn flat from straight above: sun low in the west,
// so every tower throws its shadow east across the bay. Peach streets, pink and
// teal roofs, turquoise water, neon along Ocean Drive. Colours live in vice.css.

const mainlandPath = `${smoothOpen(COAST)}H-40V-40Z`;
const islandPath = smoothClosed([...ISLAND_W, ...[...ISLAND_E].reverse(), ISLAND_CAP]);

export default function ViceTerrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  return (
    <>
      <defs>
        <linearGradient id="vc-water" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.6" stopColor="#7EE8E6" />
          <stop offset="0.76" stopColor="#58DAE0" />
          <stop offset="0.88" stopColor="#2FB8CF" />
          <stop offset="1" stopColor="#0E86AA" />
        </linearGradient>
        <radialGradient id="vc-sun" cx="0.02" cy="0.55" r="1.05">
          <stop offset="0" stopColor="#FF7A3D" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FF4F8B" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFB070" stopOpacity="0" />
        </radialGradient>
        <clipPath id="vc-mainland">
          <path d={mainlandPath} />
        </clipPath>
      </defs>

      <rect width={w} height={h} fill="url(#vc-water)" />
      <Waves />
      <Shores />
      <Swamp />
      <Streets />
      <Blocks />
      <Stockyard />
      <Roads />
      <Airport />
      <Port />
      <Downtown />
      <IslandLife />
      <Islets />
      {PALMS.map((p, k) => (
        <Palm key={k} x={p.x} y={p.y} />
      ))}
      <Labels />

      <rect width={w} height={h} fill="url(#vc-sun)" className="vc-sunwash" />
    </>
  );
}

/* --------------------------------------------------------------- water, shore */

function Waves() {
  const rand = seeded(1980);
  return (
    <g>
      {Array.from({ length: 34 }, (_, k) => {
        const x = 1810 + rand() * 360;
        const y = 40 + (k * 1420) / 34 + rand() * 20;
        return <path key={k} d={`M${x.toFixed(0)} ${y.toFixed(0)}q14 -9 28 0t28 0`} className="vc-wave" style={{ animationDelay: `${-rand() * 4}s` }} />;
      })}
      {/* the sun's road across the bay */}
      <path d="M1440 0V1500" className="vc-glare" />
    </g>
  );
}

function Shores() {
  return (
    <g>
      <path d={smoothOpen(COAST)} className="vc-foam" />
      <path d={islandPath} className="vc-foam" />
      <path d={smoothOpen(COAST)} className="vc-beach" />
      <path d={islandPath} className="vc-beach vc-beach-island" />
      <path d={mainlandPath} className="vc-land" />
      <path d={islandPath} className="vc-island" />
      {/* boardwalk along the island's ocean side */}
      <path d={smoothOpen(ISLAND_E.map((p) => ({ x: p.x - 40, y: p.y })))} className="vc-boardwalk" />
    </g>
  );
}

function Swamp() {
  const rand = seeded(1992);
  return (
    <g clipPath="url(#vc-mainland)">
      <path d={blob(SWAMP.cx, SWAMP.cy, SWAMP.rx, SWAMP.ry, 11, 0.12, 18)} className="vc-swamp" />
      <path d={blob(SWAMP.cx - 40, SWAMP.cy + 20, SWAMP.rx * 0.78, SWAMP.ry * 0.62, 5, 0.18, 14)} className="vc-swamp-deep" />
      {/* tangled channels */}
      {Array.from({ length: 9 }, (_, k) => {
        const x = 20 + k * 64 + rand() * 30;
        return (
          <path
            key={k}
            d={`M${x} ${1200 + rand() * 30}q${(rand() - 0.5) * 80} 60 ${(rand() - 0.5) * 60} 110t${(rand() - 0.5) * 60} 110`}
            className="vc-channel"
          />
        );
      })}
      {Array.from({ length: 46 }, (_, k) => {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand());
        const x = SWAMP.cx + Math.cos(a) * SWAMP.rx * 0.95 * r;
        const y = SWAMP.cy + Math.sin(a) * SWAMP.ry * 0.9 * r;
        return <path key={k} d={blob(x, y, 16 + rand() * 12, 12 + rand() * 8, k + 3, 0.25, 8)} className="vc-mangrove" />;
      })}
    </g>
  );
}

/* ------------------------------------------------------------- streets, blocks */

function Streets() {
  const xs = Array.from({ length: Math.ceil(1460 / GRID) }, (_, k) => k * GRID);
  const ys = Array.from({ length: Math.ceil(1500 / GRID) }, (_, k) => k * GRID);
  const d = [...xs.map((x) => `M${x} -20V1520`), ...ys.map((y) => `M-20 ${y}H1480`)].join('');
  return (
    <g clipPath="url(#vc-mainland)">
      <path d={d} className="vc-street-edge" />
      <path d={d} className="vc-street" />
    </g>
  );
}

function Blocks() {
  return (
    <g clipPath="url(#vc-mainland)">
      {BLOCKS.map((b, k) => (
        <g key={k}>
          <rect x={b.x + 7} y={b.y + 6} width={b.w} height={b.h} rx="4" className="vc-block-shadow" />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" className={`vc-roof vc-roof-${b.tone}`} />
          <rect x={b.x + 8} y={b.y + 8} width={b.w - 16} height={b.h - 16} rx="3" className="vc-roof-inner" />
          {b.pool && <rect x={b.x + b.w - 34} y={b.y + 12} width="22" height="14" rx="4" className="vc-pool" />}
        </g>
      ))}
    </g>
  );
}

function Stockyard() {
  const { x0, x1, y0, y1 } = STOCKYARD;
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx="10" className="vc-yard" />
      {/* two tracks run through it */}
      {[400, 430].map((y) => (
        <g key={y}>
          <path d={`M-20 ${y}H${HWY_X - 30}`} className="vc-rail-bed" />
          <path d={`M-20 ${y}H${HWY_X - 30}`} className="vc-rail" />
        </g>
      ))}
      {WAREHOUSES.map((b, k) => (
        <g key={k}>
          <rect x={b.x + 7} y={b.y + 6} width={b.w} height={b.h} className="vc-block-shadow" />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} className={`vc-warehouse vc-warehouse-${b.tone}`} />
          {/* sawtooth roof */}
          <path
            d={Array.from({ length: Math.floor(b.w / 16) }, (_, i) => `M${b.x + 4 + i * 16} ${b.y + b.h - 6}V${b.y + 6}`).join('')}
            className="vc-saw"
          />
        </g>
      ))}
      {/* silos */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <circle cx={x1 - 36 + 7} cy={y0 + 36 + k * 44 + 6} r="17" className="vc-block-shadow" />
          <circle cx={x1 - 36} cy={y0 + 36 + k * 44} r="17" className="vc-silo" />
          <circle cx={x1 - 36} cy={y0 + 36 + k * 44} r="7" className="vc-silo-top" />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------------ roads */

function Roads() {
  const [near, far] = [CAUSEWAYS[0]!, CAUSEWAYS[1]!];
  const bridge = ([ym, yi]: [number, number]) => `M${xAt(COAST, ym) - 30} ${ym}L${xAt(ISLAND_W, yi) + 34} ${yi}`;
  return (
    <g>
      {/* causeways over the bay */}
      {[near, far].map((c, k) => (
        <g key={k}>
          <path d={bridge(c)} className="vc-bridge-shadow" />
          <path d={bridge(c)} className="vc-bridge-edge" />
          <path d={bridge(c)} className="vc-bridge" />
          <path d={bridge(c)} className="vc-bridge-lane" />
        </g>
      ))}

      {/* Ocean Drive, lit in neon */}
      <path d={`M${OCEAN_DRIVE_X} ${OCEAN_DRIVE_TOP}V${OCEAN_DRIVE_BOTTOM}`} className="vc-drive-edge" />
      <path d={`M${OCEAN_DRIVE_X} ${OCEAN_DRIVE_TOP}V${OCEAN_DRIVE_BOTTOM}`} className="vc-drive" />
      <path d={`M${OCEAN_DRIVE_X} ${OCEAN_DRIVE_TOP}V${OCEAN_DRIVE_BOTTOM}`} className="vc-drive-neon" />

      {/* the pier out to the east, where the gate to New York stands */}
      <rect x="1700" y="318" width="270" height="24" className="vc-pier" />
      <path d={Array.from({ length: 22 }, (_, i) => `M${1710 + i * 12} 318v24`).join('')} className="vc-plank" />
      <circle cx="1960" cy="330" r="62" className="vc-pier" />
      <circle cx="1960" cy="330" r="62" className="vc-pier-ring" />

      {/* the highway north to Leonida, and the expressway into downtown */}
      <path d={`M${HWY_X + 8} -30V1320`} className="vc-hwy-shadow" />
      <path d={`M${HWY_X} -30V1320`} className="vc-hwy-edge" />
      <path d={`M${HWY_X} -30V1320`} className="vc-hwy" />
      <path d={`M${HWY_X - 10} -30V1320M${HWY_X + 10} -30V1320`} className="vc-hwy-lanes" />
      <path d={`M${HWY_X} -30V1320`} className="vc-hwy-median" />
      <path d={`M${HWY_X} ${EXPRESS_Y + 8}H1396`} className="vc-hwy-shadow" />
      <path d={`M${HWY_X} ${EXPRESS_Y}H1396`} className="vc-hwy-edge" />
      <path d={`M${HWY_X} ${EXPRESS_Y}H1396`} className="vc-hwy" />
      <path d={`M${HWY_X} ${EXPRESS_Y - 8}H1396M${HWY_X} ${EXPRESS_Y + 8}H1396`} className="vc-hwy-lanes" />
      {/* the interchange's loops */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sy]) => (
        <g key={`${sx}${sy}`}>
          <circle cx={HWY_X + sx! * 62} cy={EXPRESS_Y + sy! * 62} r="30" className="vc-ramp-edge" />
          <circle cx={HWY_X + sx! * 62} cy={EXPRESS_Y + sy! * 62} r="30" className="vc-ramp" />
        </g>
      ))}
    </g>
  );
}

/* ----------------------------------------------------------------------- airport */

function Airport() {
  const { x0, x1, y0, y1 } = AIRPORT;
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx="14" className="vc-tarmac" />
      <rect x={x0 + 20} y={y0 + 20} width={x1 - x0 - 40} height="36" className="vc-runway" />
      <path d={`M${x0 + 40} ${y0 + 38}H${x1 - 40}`} className="vc-runway-line" />
      <rect x={x0 + 40} y={y0 + 80} width={x1 - x0 - 80} height="12" className="vc-taxiway" />
      {/* the terminal, with BITTOBYTE across its roof */}
      <rect x="788" y="246" width="232" height="58" rx="6" className="vc-block-shadow" transform="translate(8 7)" />
      <rect x="780" y="240" width="232" height="58" rx="6" className="vc-terminal" />
      <rect x="788" y="248" width="216" height="42" rx="4" className="vc-terminal-roof" />
      <text x="896" y="281" textAnchor="middle" className="vc-sign-letter">
        BITTOBYTE
      </text>
      {/* gate fingers and parked planes */}
      {[820, 896, 972].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="206" width="10" height="36" className="vc-finger" />
          <Plane x={x} y={196} />
        </g>
      ))}
      <g transform="translate(1240 300)">
        <rect x="-14" y="-20" width="28" height="40" className="vc-block-shadow" transform="translate(8 6)" />
        <rect x="-12" y="-18" width="24" height="36" className="vc-terminal" />
        <circle r="9" className="vc-dome" />
      </g>
      <text x="1090" y="352" textAnchor="middle" className="vc-label vc-label-small">
        Airport
      </text>
    </g>
  );
}

function Plane({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-90)`}>
      <path d="M18 0 8 -3 2 -14 -3 -14 0 -3 -10 -3 -14 -8 -17 -8 -14 0 -17 8 -14 8 -10 3 0 3 -3 14 2 14 8 3Z" transform="translate(5 5)" className="vc-block-shadow" />
      <path d="M18 0 8 -3 2 -14 -3 -14 0 -3 -10 -3 -14 -8 -17 -8 -14 0 -17 8 -14 8 -10 3 0 3 -3 14 2 14 8 3Z" className="vc-plane" />
    </g>
  );
}

/* ------------------------------------------------------------------ port, downtown */

function Port() {
  const { x0, x1, y0, y1 } = PORT;
  return (
    <g>
      <path d={`M${x0 + 16} ${y0}H${x1 - 10}L${x1 + 6} ${y0 + 90}L${x1 - 10} ${y1}H${x0 + 40}Z`} className="vc-port-land" />
      {[1120, 1176, 1232].map((y) => (
        <rect key={y} x={x1 - 20} y={y} width="86" height="14" className="vc-port-land" />
      ))}
      {CONTAINERS.map((c, k) => (
        <rect key={k} x={c.x} y={c.y} width="22" height="12" rx="1.5" className={`vc-container vc-container-${c.tone}`} />
      ))}
      {/* gantry cranes at the quay */}
      {[1127, 1183, 1239].map((y) => (
        <g key={y} transform={`translate(${x1 + 20} ${y})`}>
          <path d="M-24 0H52M0 -4V4M30 -4V4" className="vc-crane" />
          <rect x="-5" y="-5" width="10" height="10" className="vc-crane-cab" />
        </g>
      ))}
      {/* a cruise ship alongside */}
      <g transform="translate(1642 1308)">
        <path d="M-96 0h172l24 -12l-24 -12h-172q-12 12 0 24Z" className="vc-ship-shadow" transform="translate(8 8)" />
        <path d="M-96 0h172l24 -12l-24 -12h-172q-12 12 0 24Z" className="vc-ship" />
        <rect x="-70" y="-9" width="120" height="6" rx="3" className="vc-ship-deck" />
        <rect x="-30" y="-13" width="40" height="4" rx="2" className="vc-ship-deck" />
      </g>
      <text x="1500" y="1338" textAnchor="middle" className="vc-label vc-label-small">
        Vice City Port
      </text>
    </g>
  );
}

function Downtown() {
  return (
    <g>
      {TOWERS.map((t, k) => {
        const sx = t.h * 0.55;
        const sy = t.h * 0.22;
        return (
          <g key={k}>
            <path
              d={`M${t.x} ${t.y + t.d}H${t.x + t.w}L${t.x + t.w + sx} ${t.y + t.d + sy}H${t.x + sx}ZM${t.x + t.w} ${t.y}L${t.x + t.w + sx} ${t.y + sy}V${t.y + t.d + sy}L${t.x + t.w} ${t.y + t.d}Z`}
              className="vc-tower-shadow"
            />
            <rect x={t.x} y={t.y} width={t.w} height={t.d} className={`vc-tower vc-tower-${t.tone}`} />
            <rect x={t.x + 5} y={t.y + 5} width={t.w - 10} height={t.d - 10} className="vc-tower-inner" />
            {t.h > 90 && <rect x={t.x} y={t.y} width={t.w} height="3" className="vc-tower-neon" />}
          </g>
        );
      })}
      <text x="1228" y="640" textAnchor="middle" className="vc-label">
        Downtown
      </text>
    </g>
  );
}

/* ------------------------------------------------------- Ocean Beach, the islets */

function IslandLife() {
  const neon = ['vc-neon-pink', 'vc-neon-teal', 'vc-neon-orange', 'vc-neon-teal'];
  return (
    <g>
      {HOTELS.map((o, k) => (
        <g key={k}>
          <rect x={o.x + 7} y={o.y + 6} width={o.w} height={o.h} rx="3" className="vc-block-shadow" />
          <rect x={o.x} y={o.y} width={o.w} height={o.h} rx="3" className={`vc-hotel vc-hotel-${o.tone}`} />
          <rect x={o.x + 5} y={o.y + 5} width={o.w - 10} height={o.h - 12} rx="2" className="vc-hotel-roof" />
          <rect x={o.x} y={o.y + o.h - 4} width={o.w} height="4" rx="2" className={neon[o.tone % neon.length]} />
        </g>
      ))}
      <text x={OCEAN_DRIVE_X} y="304" textAnchor="middle" className="vc-label vc-label-small">
        Ocean Beach
      </text>
    </g>
  );
}

function Islets() {
  return (
    <g>
      {ISLETS.map((s, k) => (
        <g key={k}>
          <path d={blob(s.x, s.y, s.r + 12, s.r + 8, k + 20, 0.12, 10)} className="vc-beach-islet" />
          <path d={blob(s.x, s.y, s.r, s.r * 0.8, k + 20, 0.12, 10)} className="vc-islet" />
          <rect x={s.x - 14} y={s.y - 10} width="26" height="18" rx="3" className="vc-roof vc-roof-1" />
          <rect x={s.x - 8} y={s.y - 4} width="14" height="8" rx="2" className="vc-roof-inner" />
          <Palm x={s.x + 16} y={s.y + 12} />
        </g>
      ))}
    </g>
  );
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y}l10 6`} className="vc-palm-shadow" />
      <path d={`M${x} ${y}q-3 -12 2 -24`} className="vc-trunk" />
      <g transform={`translate(${x + 2} ${y - 24})`} className="vc-fronds">
        <path d="M0 0q-12 -8 -24 2q12 -4 24 -2Z" />
        <path d="M0 0q12 -8 24 2q-12 -4 -24 -2Z" />
        <path d="M0 0q-6 -13 -17 -15q10 6 17 15Z" />
        <path d="M0 0q6 -13 17 -15q-10 6 -17 15Z" />
        <path d="M0 0q-14 2 -19 12q8 -9 19 -12Z" />
        <path d="M0 0q14 2 19 12q-8 -9 -19 -12Z" />
      </g>
    </g>
  );
}

/* ----------------------------------------------------------------------- labels */

function Labels() {
  return (
    <g>
      <text x="1890" y="760" textAnchor="middle" transform="rotate(90 1890 760)" className="vc-label vc-label-sea">
        The Atlantic
      </text>
      <text x="300" y="228" textAnchor="middle" className="vc-label vc-label-small">
        Stockyard
      </text>
      <text x="880" y="1010" textAnchor="middle" className="vc-label">
        Little Cuba
      </text>
      <text x="300" y="1290" textAnchor="middle" className="vc-label vc-label-small">
        Mangroves
      </text>
    </g>
  );
}
