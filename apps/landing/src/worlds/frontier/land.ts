import type { Point } from '../../data/worlds';
import { seeded } from '../shared/sketch';

// Blackwater as data: a lake town at golden hour. Peaks along the north edge,
// pines on the foothills, a river running down past the rail trestle into the
// lake, the town on its east shore, open plains to the east and red mesas in
// the south-east. Everything the terrain draws, and where it keeps clear of the
// map's lots and gates.

const P = (x: number, y: number): Point => ({ x, y });

/** Oblique depth: side faces recede up and to the right. */
export const DEPTH = { x: 26, y: -15 };

export const LAKE: Point[] = [
  P(170, 820),
  P(380, 732),
  P(700, 742),
  P(900, 822),
  P(934, 940),
  P(822, 1050),
  P(560, 1092),
  P(300, 1062),
  P(150, 962),
];

export const RIVER: Point[] = [
  P(1262, -20),
  P(1232, 140),
  P(1172, 300),
  P(1102, 450),
  P(1074, 560),
  P(1062, 650),
  P(1050, 740),
  P(1000, 820),
  P(920, 880),
];

/** The rail line is straight: y = RAIL_Y0 + RAIL_SLOPE * x. */
export const RAIL_Y0 = 668;
export const RAIL_SLOPE = -0.02;
export const railY = (x: number) => RAIL_Y0 + RAIL_SLOPE * x;
export const TRESTLE = { x0: 1000, x1: 1136 };

/** Dirt roads: gate to town, town to every lot and onward to the other gates. */
export const ROADS: Point[][] = [
  [P(1100, 1390), P(1118, 1260), P(1170, 1130), P(1232, 1070)],
  [P(900, 1068), P(1100, 1066), P(1400, 1066), P(1620, 1066)],
  [P(980, 1064), P(1012, 920), P(1022, 790), P(990, 660), P(880, 616), P(760, 600)],
  [P(720, 560), P(540, 470), P(400, 400), P(300, 380)],
  [P(1620, 1066), P(1700, 960), P(1660, 870)],
  [P(1660, 870), P(1760, 700), P(1860, 540), P(1930, 440)],
  [P(1760, 700), P(1610, 580), P(1490, 520)],
  [P(1620, 1066), P(1700, 1180), P(1760, 1290)],
  [P(1118, 1300), P(820, 1262), P(580, 1268), P(430, 1300)],
];

export interface Peak {
  x: number;
  w: number;
  h: number;
}

/** The Grizzlies along the north edge, back row first. */
export const PEAKS: Peak[][] = [
  [
    { x: 80, w: 420, h: 250 },
    { x: 420, w: 480, h: 300 },
    { x: 860, w: 380, h: 240 },
    { x: 1300, w: 520, h: 310 },
    { x: 1760, w: 460, h: 270 },
    { x: 2120, w: 300, h: 220 },
  ],
  [
    { x: 250, w: 360, h: 170 },
    { x: 650, w: 320, h: 150 },
    { x: 1060, w: 340, h: 160 },
    { x: 1560, w: 380, h: 180 },
    { x: 1960, w: 340, h: 150 },
  ],
];
export const PEAK_BASE = [260, 330];

export interface Mesa {
  x0: number;
  x1: number;
  top: number;
  base: number;
}

export const MESAS: Mesa[] = [
  { x0: 1880, x1: 2240, top: 1110, base: 1330 },
  { x0: 1470, x1: 1620, top: 1300, base: 1440 },
  { x0: 2010, x1: 2140, top: 980, base: 1090 },
];

/** Town buildings on Blackwater's main street (scenery around lot 0). */
export interface Shop {
  x: number;
  base: number;
  w: number;
  h: number;
  sign?: string;
  tone: 'wood' | 'paint' | 'brick';
  storeys?: 2;
}

export const SHOPS: Shop[] = [
  { x: 1416, base: 1036, w: 96, h: 120, sign: 'GENERAL STORE', tone: 'paint' },
  { x: 1520, base: 1036, w: 110, h: 150, sign: 'HOTEL', tone: 'wood', storeys: 2 },
  { x: 930, base: 1176, w: 120, h: 130, sign: 'BANK', tone: 'brick' },
  { x: 1300, base: 1176, w: 110, h: 110, sign: 'STABLES', tone: 'wood' },
  { x: 1430, base: 1176, w: 84, h: 100, sign: 'GUNSMITH', tone: 'paint' },
];
export const CHURCH = { x: 950, base: 1030, w: 86, h: 110 };
export const DEPOT = { x: 1250, w: 130, h: 70 };

/** Keep scenery off the places people walk to. */
const CLEAR: [number, number, number][] = [
  [1250, 1020, 190],
  [720, 560, 190],
  [1640, 830, 180],
  [1760, 1260, 180],
  [420, 1260, 170],
  [1480, 470, 180],
  [1100, 1390, 140],
  [270, 340, 140],
  [1940, 380, 140],
  [1060, 700, 70],
];
const clear = (x: number, y: number) => CLEAR.every(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 > r * r);

const insidePoly = (pts: Point[], x: number, y: number) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i]!;
    const b = pts[j]!;
    if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
};

const nearRiver = (x: number, y: number) => RIVER.some((p) => Math.hypot(p.x - x, p.y - y) < 60);

export interface Pine {
  x: number;
  y: number;
  s: number;
}

/** Pines on the foothills, sorted back to front. */
export const PINES: Pine[] = (() => {
  const rand = seeded(1899);
  const out: Pine[] = [];
  const areas = [
    { x0: 60, x1: 1000, y0: 300, y1: 640, n: 120 },
    { x0: 1180, x1: 2160, y0: 300, y1: 480, n: 80 },
    { x0: 40, x1: 260, y0: 640, y1: 1000, n: 18 },
  ];
  for (const a of areas) {
    for (let i = 0; i < a.n; i++) {
      const x = a.x0 + rand() * (a.x1 - a.x0);
      const y = a.y0 + rand() * (a.y1 - a.y0);
      const s = 0.7 + rand() * 0.6;
      if (!clear(x, y) || insidePoly(LAKE, x, y + 20) || nearRiver(x, y) || Math.abs(y - railY(x)) < 30) continue;
      out.push({ x, y, s });
    }
  }
  return out.sort((a, b) => a.y - b.y);
})();

export interface Tuft {
  x: number;
  y: number;
  kind: 'sage' | 'cactus' | 'rock';
}

/** Sagebrush, cacti and rocks scattered over the plains and the south. */
export const SCRUB: Tuft[] = (() => {
  const rand = seeded(1873);
  const out: Tuft[] = [];
  for (let i = 0; i < 160; i++) {
    const x = 60 + rand() * 2080;
    const y = 700 + rand() * 760;
    const roll = rand();
    if (!clear(x, y) || insidePoly(LAKE, x, y) || nearRiver(x, y)) continue;
    if (x > 880 && x < 1660 && y > 950 && y < 1200) continue; // the town
    if (MESAS.some((m) => x > m.x0 - 20 && x < m.x1 + 20 && y > m.top - 20 && y < m.base + 10)) continue;
    const kind = y > 1150 && roll < 0.3 ? 'cactus' : roll < 0.78 ? 'sage' : 'rock';
    out.push({ x, y, kind });
  }
  return out.sort((a, b) => a.y - b.y);
})();

/** Grass patches that break up the ground colour. */
export const PATCHES: { x: number; y: number; rx: number; ry: number; dark: boolean }[] = (() => {
  const rand = seeded(1911);
  return Array.from({ length: 46 }, () => ({
    x: rand() * 2200,
    y: 420 + rand() * 1080,
    rx: 60 + rand() * 160,
    ry: 20 + rand() * 46,
    dark: rand() < 0.4,
  }));
})();

export const CATTLE: Point[] = [P(1830, 790), P(1880, 830), P(1960, 800), P(2020, 870), P(1900, 900), P(1450, 900)];
