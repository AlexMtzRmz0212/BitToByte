import type { MapLayout, Point } from '../../data/worlds';
import { blob, seeded, smoothClosed, smoothOpen } from '../shared/sketch';

// The state of Leonida, drawn like a page from a road atlas (north is up): the
// panhandle and Port Gellhorn in the north-west, Mount Kalaga across the north,
// Lake Leonida and the sugar fields of Ambrosia in the north-east, the swamps of
// Grassrivers in the south, Vice City on the south-east coast and the Leonida Keys
// trailing off to the south-west. Region names and rough positions follow
// Rockstar's own announcements; the drawing itself is original and stylized.

const P = (x: number, y: number): Point => ({ x, y });

/** The state's outline, clockwise from the north-west tip. */
const OUTLINE: Point[] = [
  P(170, 340), P(330, 310), P(520, 300), P(720, 285), P(900, 255), P(1080, 225), P(1250, 205), P(1420, 200),
  P(1560, 235), P(1610, 340), P(1600, 470), P(1560, 590), P(1590, 720), P(1570, 850), P(1530, 960), P(1500, 1060),
  P(1470, 1150), P(1420, 1220), P(1340, 1262), P(1250, 1240), P(1170, 1180), P(1115, 1100), P(1100, 1000),
  P(1130, 900), P(1090, 800), P(1050, 700), P(990, 610), P(900, 540), P(800, 500), P(680, 490), P(540, 480),
  P(400, 490), P(270, 470), P(190, 425),
];
const statePath = smoothClosed(OUTLINE);

/** The keys: a chain of small islands trailing south-west from the tip, joined by a highway. */
const KEYS: Point[] = [P(1340, 1262), P(1290, 1300), P(1215, 1335), P(1140, 1362), P(1060, 1380), P(985, 1392), P(910, 1395), P(840, 1388)];

/** The highway up the Atlantic coast and across the north to Port Gellhorn. */
const HIGHWAY: Point[] = [
  P(1450, 1000), P(1446, 900), P(1452, 780), P(1462, 640), P(1430, 500), P(1360, 380), P(1230, 345), P(1050, 365),
  P(860, 410), P(660, 430), P(470, 445),
];

const f = (n: number) => Math.round(n);

export default function LeonidaTerrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  return (
    <>
      <defs>
        <linearGradient id="lo-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7EE8E6" />
          <stop offset="1" stopColor="#1496B4" />
        </linearGradient>
        <clipPath id="lo-state">
          <path d={statePath} />
        </clipPath>
        <radialGradient id="lo-sun" cx="0.02" cy="0.5" r="1.05">
          <stop offset="0" stopColor="#FF7A3D" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#FF4F8B" stopOpacity="0.14" />
          <stop offset="1" stopColor="#FFB070" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={w} height={h} fill="url(#lo-sea)" />
      <Waves />
      <path d={statePath} className="lo-foam" />
      <path d={statePath} className="lo-beach" />
      <path d={statePath} className="lo-land" />

      <g clipPath="url(#lo-state)">
        <Ambrosia />
        <Mountains />
        <Grassrivers />
        <PortGellhorn />
        <Roads />
      </g>
      <Keys />
      <ViceCitySkyline />
      <Labels />

      <rect width={w} height={h} fill="url(#lo-sun)" className="vc-sunwash" />
    </>
  );
}

/* ------------------------------------------------------------------------- sea */

function Waves() {
  const rand = seeded(1970);
  return (
    <g>
      {Array.from({ length: 70 }, (_, k) => {
        const x = rand() * 2100 + 40;
        const y = rand() * 1420 + 40;
        return <path key={k} d={`M${f(x)} ${f(y)}q14 -9 28 0t28 0`} className="vc-wave" style={{ animationDelay: `${-rand() * 4}s` }} />;
      })}
    </g>
  );
}

/* --------------------------------------------------------- Ambrosia: sugar fields */

function Ambrosia() {
  const rand = seeded(1961);
  const tones = ['lo-cane-0', 'lo-cane-1', 'lo-cane-2', 'lo-cane-3'];
  const fields: [number, number][] = [];
  for (let y = 500; y < 760; y += 34) for (let x = 1400; x < 1620; x += 46) fields.push([x + rand() * 4, y + rand() * 4]);
  return (
    <g>
      <rect x="1380" y="480" width="260" height="300" className="lo-ambrosia" />
      {fields.map(([x, y], k) => (
        <rect key={k} x={x} y={y} width="40" height="28" rx="3" className={tones[Math.floor(rand() * tones.length)]} />
      ))}
      {/* the lake */}
      <path d={blob(1300, 760, 112, 74, 4, 0.1, 14)} className="lo-lake-beach" />
      <path d={blob(1300, 760, 100, 62, 4, 0.1, 14)} className="lo-lake" />
      <path d="M1230 760q20 -10 40 0t40 0t40 0" className="vc-wave" />
      {/* the sugar refinery, with its smoke */}
      <g transform="translate(1458 640)">
        <rect x="-42" y="-8" width="92" height="40" className="vc-block-shadow" transform="translate(8 7)" />
        <rect x="-42" y="-10" width="92" height="40" className="lo-refinery" />
        {[-26, -4, 18].map((cx) => (
          <g key={cx}>
            <circle cx={cx + 8} cy="-2" r="9" className="vc-block-shadow" />
            <circle cx={cx} cy="-8" r="9" className="lo-stack" />
            <circle cx={cx} cy="-8" r="4" className="lo-stack-top" />
            <circle cx={cx + 4} cy="-26" r="7" className="lo-smoke" />
            <circle cx={cx + 12} cy="-40" r="9" className="lo-smoke lo-smoke-2" />
          </g>
        ))}
        <rect x="-30" y="12" width="24" height="12" className="lo-roof" />
        <rect x="6" y="12" width="32" height="12" className="lo-roof" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------ Mount Kalaga */

function Mountains() {
  const rand = seeded(1983);
  const peaks = Array.from({ length: 16 }, (_, k) => ({
    x: 980 + (k % 8) * 62 + rand() * 30 + (k > 7 ? 30 : 0),
    y: 300 + Math.floor(k / 8) * 62 + rand() * 18,
    s: 0.8 + rand() * 0.7,
  })).sort((a, b) => a.y - b.y);
  return (
    <g>
      <path d={blob(1200, 300, 300, 130, 9, 0.13, 16)} className="lo-forest" />
      {Array.from({ length: 30 }, (_, k) => {
        const x = 930 + rand() * 520;
        const y = 220 + rand() * 230;
        return <circle key={k} cx={f(x)} cy={f(y)} r={5 + rand() * 4} className="lo-tree" />;
      })}
      {peaks.map((p, k) => (
        <g key={k} transform={`translate(${f(p.x)} ${f(p.y)}) scale(${p.s.toFixed(2)})`}>
          <path d="M-8 4l26 4l-6 6Z" className="vc-block-shadow" />
          <path d="M0 -40L-30 14H30Z" className="lo-peak" />
          <path d="M0 -40L30 14H6Z" className="lo-peak-dark" />
          <path d="M0 -40l-8 14l8 -4l7 6Z" className="lo-snow" />
        </g>
      ))}
    </g>
  );
}

/* ----------------------------------------------------------------- Grassrivers */

function Grassrivers() {
  const rand = seeded(1992);
  return (
    <g>
      <path d={blob(1200, 1060, 190, 150, 12, 0.14, 16)} className="lo-swamp" />
      <path d={blob(1190, 1070, 140, 104, 6, 0.18, 14)} className="lo-swamp-deep" />
      {Array.from({ length: 9 }, (_, k) => {
        const x = 1040 + k * 36 + rand() * 20;
        return (
          <path
            key={k}
            d={`M${f(x)} ${920 + f(rand() * 40)}q${f((rand() - 0.5) * 70)} 60 ${f((rand() - 0.5) * 50)} 110t${f((rand() - 0.5) * 60)} 110t${f((rand() - 0.5) * 40)} 80`}
            className="lo-river"
          />
        );
      })}
      {/* reeds */}
      {Array.from({ length: 70 }, (_, k) => {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand());
        const x = 1200 + Math.cos(a) * 185 * r;
        const y = 1060 + Math.sin(a) * 145 * r;
        return <path key={k} d={`M${f(x)} ${f(y)}v-10M${f(x) + 4} ${f(y)}v-14M${f(x) + 8} ${f(y)}v-9`} className="lo-reed" />;
      })}
      {/* a gator, sunning */}
      <g transform="translate(1150 1085) rotate(-18)">
        <path d="M-30 0q10 -7 30 -5l22 -3q8 0 10 3l-10 4q-6 3 -14 3l-12 1q-14 4 -26 3l-14 3q-6 -3 -6 -9Z" className="lo-gator" transform="translate(0 4)" />
        <path d="M-30 0q10 -7 30 -5l22 -3q8 0 10 3l-10 4q-6 3 -14 3l-12 1q-14 4 -26 3l-14 3q-6 -3 -6 -9Z" className="lo-gator" />
        <circle cx="26" cy="-4" r="1.6" className="lo-gator-eye" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------- Port Gellhorn */

function PortGellhorn() {
  const rand = seeded(1975);
  return (
    <g>
      {/* a tired grid of houses behind the docks */}
      <rect x="320" y="370" width="240" height="80" rx="8" className="lo-town" />
      {Array.from({ length: 22 }, (_, k) => (
        <rect key={k} x={332 + (k % 11) * 21 + rand() * 4} y={380 + Math.floor(k / 11) * 28 + rand() * 4} width="16" height="12" className={`lo-house lo-house-${k % 3}`} />
      ))}
      {/* the docks: rust-red containers, three cranes and a ship that has seen better days */}
      <rect x="400" y="446" width="170" height="30" className="lo-dock" />
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x={408 + (k % 6) * 26} y={450 + Math.floor(k / 6) * 12} width="22" height="10" className={`lo-crate lo-crate-${k % 4}`} />
      ))}
      {[430, 490, 550].map((x) => (
        <g key={x} transform={`translate(${x} 478)`}>
          <path d="M0 0v-26h-22M0 -26h20" className="vc-crane" />
          <rect x="-4" y="-30" width="8" height="8" className="vc-crane-cab" />
        </g>
      ))}
    </g>
  );
}

/* ----------------------------------------------------------------------- roads */

function Roads() {
  const d = smoothOpen(HIGHWAY);
  const south = `${smoothOpen([P(1450, 1000), P(1446, 1080), P(1410, 1180), P(1340, 1262)])}`;
  const cross = smoothOpen([P(1446, 640), P(1380, 690), P(1300, 700)]);
  return (
    <g>
      {[d, south, cross].map((p, k) => (
        <g key={k}>
          <path d={p} className="lo-road-edge" />
          <path d={p} className="lo-road" />
          <path d={p} className="lo-road-lane" />
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ the Keys */

function Keys() {
  const rand = seeded(1958);
  const road = smoothOpen(KEYS);
  return (
    <g>
      {KEYS.slice(1).map((k, i) => (
        <g key={i}>
          <path d={blob(k.x, k.y, 46, 20, i + 30, 0.15, 10)} className="lo-key-beach" />
          <path d={blob(k.x, k.y, 36, 13, i + 30, 0.15, 10)} className="lo-key" />
          <Palm x={k.x - 10 + rand() * 6} y={k.y + 2} />
          <rect x={k.x + 8} y={k.y - 8} width="16" height="11" rx="2" className={`vc-roof vc-roof-${i % 5}`} />
        </g>
      ))}
      {/* the bridges between them */}
      <path d={road} className="lo-bridge-shadow" />
      <path d={road} className="lo-road-edge" />
      <path d={road} className="lo-road" />
      <path d={road} className="lo-road-lane" />
    </g>
  );
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y}q-3 -12 2 -24`} className="vc-trunk" />
      <g transform={`translate(${x + 2} ${y - 24})`} className="vc-fronds">
        <path d="M0 0q-12 -8 -24 2q12 -4 24 -2Z" />
        <path d="M0 0q12 -8 24 2q-12 -4 -24 -2Z" />
        <path d="M0 0q-6 -13 -17 -15q10 6 17 15Z" />
        <path d="M0 0q6 -13 17 -15q-10 6 -17 15Z" />
      </g>
    </g>
  );
}

/* ----------------------------------------------------------- Vice City on the coast */

function ViceCitySkyline() {
  const rand = seeded(2011);
  const towers = Array.from({ length: 26 }, (_, k) => ({
    x: 1472 + (k % 6) * 17 + rand() * 6,
    y: 940 + Math.floor(k / 6) * 24 + rand() * 6,
    w: 11 + rand() * 6,
    d: 11 + rand() * 6,
    h: 14 + rand() * rand() * 50,
    tone: Math.floor(rand() * 3),
  }));
  return (
    <g>
      <rect x="1456" y="926" width="116" height="132" rx="14" className="lo-city" />
      {towers.map((t, k) => (
        <g key={k}>
          <path d={`M${t.x + t.w} ${t.y}l${t.h * 0.4} ${t.h * 0.15}v${t.d}l${-t.h * 0.4} ${-t.h * 0.15}Z`} className="vc-tower-shadow" />
          <rect x={t.x} y={t.y} width={t.w} height={t.d} className={`vc-tower vc-tower-${t.tone}`} />
          {t.h > 40 && <rect x={t.x} y={t.y} width={t.w} height="2" className="vc-tower-neon" />}
        </g>
      ))}
    </g>
  );
}

/* ---------------------------------------------------------------------- labels */

function Labels() {
  return (
    <g>
      <text x="800" y="140" textAnchor="middle" className="vc-label lo-title">
        State of Leonida
      </text>
      <text x="1250" y="440" textAnchor="middle" className="vc-label lo-region">
        Mount Kalaga
      </text>
      <text x="1250" y="476" textAnchor="middle" className="vc-label vc-label-small">
        National Park
      </text>
      <text x="470" y="352" textAnchor="middle" className="vc-label lo-region">
        Port Gellhorn
      </text>
      <text x="470" y="520" textAnchor="middle" className="vc-label vc-label-small">
        Leonida&apos;s forgotten coast
      </text>
      <text x="1500" y="525" textAnchor="middle" className="vc-label lo-region">
        Ambrosia
      </text>
      <text x="1300" y="868" textAnchor="middle" className="vc-label vc-label-small">
        Lake Leonida
      </text>
      <text x="1180" y="1196" textAnchor="middle" className="vc-label lo-region">
        Grassrivers
      </text>
      <text x="1560" y="1118" textAnchor="middle" className="vc-label lo-region">
        Vice City
      </text>
      <text x="1030" y="1450" textAnchor="middle" className="vc-label lo-region">
        Leonida Keys
      </text>
      <text x="360" y="900" textAnchor="middle" transform="rotate(-8 360 900)" className="vc-label vc-label-sea">
        The Gulf
      </text>
      <text x="1870" y="760" textAnchor="middle" transform="rotate(90 1870 760)" className="vc-label vc-label-sea">
        The Atlantic
      </text>
    </g>
  );
}
