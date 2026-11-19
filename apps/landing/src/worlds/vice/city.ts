import { MAPS, type Point } from '../../data/worlds';
import { seeded } from '../shared/sketch';

// Vice City's geometry, all seeded so the server and the client draw the same
// city. North is up. A mainland on the west, a bay, and a barrier island (Ocean
// Beach) with the Atlantic beyond it on the east; the airport and the highway to
// Leonida at the top, downtown in the middle, the port and Little Cuba in the
// south, mangroves in the south-west.

const P = (x: number, y: number): Point => ({ x, y });
const map = MAPS.sunset;

/** The mainland's east coast, north to south. */
export const COAST: Point[] = [
  P(1430, -30), P(1412, 200), P(1388, 380), P(1418, 520), P(1378, 700),
  P(1398, 860), P(1458, 1000), P(1428, 1150), P(1472, 1300), P(1512, 1530),
];
/** The island's west (bay) shore, north to south. */
export const ISLAND_W: Point[] = [
  P(1604, 300), P(1566, 430), P(1556, 620), P(1576, 820), P(1562, 1000), P(1592, 1160), P(1652, 1290),
];
/** Its east (ocean) shore, north to south. */
export const ISLAND_E: Point[] = [P(1746, 360), P(1782, 500), P(1802, 700), P(1772, 900), P(1796, 1100), P(1772, 1250)];
export const ISLAND_CAP = P(1672, 262);

/** The x of a polyline (sorted by y) at height `y`. */
export function xAt(points: Point[], y: number): number {
  const first = points[0]!;
  const last = points[points.length - 1]!;
  if (y <= first.y) return first.x;
  if (y >= last.y) return last.x;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    if (y <= b.y) return a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
  }
  return last.x;
}

/** The north-south highway (to Leonida) and the expressway that leaves it for downtown. */
export const HWY_X = 560;
export const EXPRESS_Y = 560;
/** Ocean Drive runs straight down the island. */
export const OCEAN_DRIVE_X = 1672;
export const OCEAN_DRIVE_TOP = 330;
export const OCEAN_DRIVE_BOTTOM = 1260;
/** The two causeways across the bay: [y on the mainland, y on the island]. */
export const CAUSEWAYS: [number, number][] = [
  [478, 492],
  [930, 934],
];

export const GRID = 120;
export const AIRPORT = { x0: 700, x1: 1300, y0: 110, y1: 370 };
export const STOCKYARD = { x0: 100, x1: 520, y0: 190, y1: 480 };
export const DOWNTOWN = { x0: 1080, x1: 1380, y0: 600, y1: 940 };
export const PORT = { x0: 1380, x1: 1610, y0: 1090, y1: 1270 };
export const SWAMP = { cx: 280, cy: 1360, rx: 520, ry: 210 };
/** Small mangrove islets in the bay. */
export const ISLETS = [
  { x: 1486, y: 610, r: 30 },
  { x: 1500, y: 716, r: 24 },
  { x: 1492, y: 812, r: 28 },
];

type Rect = { x0: number; x1: number; y0: number; y1: number };
const inRect = (x: number, y: number, r: Rect, pad = 0) =>
  x > r.x0 - pad && x < r.x1 + pad && y > r.y0 - pad && y < r.y1 + pad;
const inSwamp = (x: number, y: number, k = 1) => ((x - SWAMP.cx) / SWAMP.rx) ** 2 + ((y - SWAMP.cy) / SWAMP.ry) ** 2 < k * k;

export const onMainland = (x: number, y: number) => x < xAt(COAST, y) - 40;
export const onIsland = (x: number, y: number) =>
  y > OCEAN_DRIVE_TOP && y < OCEAN_DRIVE_BOTTOM && x > xAt(ISLAND_W, y) + 28 && x < xAt(ISLAND_E, y) - 58;

// What the art keeps clear: every landmark lot, gate, the spawn, the landing point and the secret.
const CLEAR: { x: number; y: number; r: number }[] = [
  ...map.lots.map((p) => ({ ...p, r: 150 })),
  ...(Object.values(map.gates).filter(Boolean) as Point[]).map((p) => ({ ...p, r: 130 })),
  { ...map.spawn, r: 90 },
  { ...(map.airport ?? map.spawn), r: 90 },
  { ...map.secret!, r: 90 },
];
export const isClear = (x: number, y: number, pad = 0) => CLEAR.every((c) => Math.hypot(x - c.x, y - c.y) > c.r + pad);

/** On a road or a district that has its own art (so blocks, trees and towers stay off it). */
const reserved = (x: number, y: number, pad = 0) =>
  inRect(x, y, AIRPORT, 50 + pad) ||
  inRect(x, y, STOCKYARD, 40 + pad) ||
  inRect(x, y, DOWNTOWN, 30 + pad) ||
  inRect(x, y, PORT, pad) ||
  inSwamp(x, y, 1 + pad / 300) ||
  Math.abs(x - HWY_X) < 64 + pad ||
  (x > HWY_X - 40 && Math.abs(y - EXPRESS_Y) < 66 + pad);

/** Little Cuba and the rest of the mainland: low blocks on a grid. */
export interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: number;
  pool: boolean;
}
export const BLOCKS: Block[] = (() => {
  const rand = seeded(2026);
  const out: Block[] = [];
  for (let gy = 0; gy < 1500; gy += GRID) {
    for (let gx = 0; gx < 1420; gx += GRID) {
      const cx = gx + GRID / 2;
      const cy = gy + GRID / 2;
      if (!onMainland(cx, cy) || cx > xAt(COAST, cy) - 90) continue;
      if (reserved(cx, cy) || !isClear(cx, cy, 20)) continue;
      if (rand() < 0.2) continue;
      out.push({
        x: gx + 14 + rand() * 6,
        y: gy + 14 + rand() * 6,
        w: GRID - 28 - rand() * 14,
        h: GRID - 28 - rand() * 14,
        tone: Math.floor(rand() * 5),
        pool: rand() < 0.12,
      });
    }
  }
  return out;
})();

/** Downtown's towers. `h` is how far each throws its shadow. */
export interface Tower {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  tone: number;
}
export const TOWERS: Tower[] = (() => {
  const rand = seeded(2013);
  const out: Tower[] = [];
  for (let x = DOWNTOWN.x0; x < DOWNTOWN.x1; x += 54) {
    for (let y = DOWNTOWN.y0; y < DOWNTOWN.y1; y += 54) {
      const tx = x + rand() * 8;
      const ty = y + rand() * 8;
      if (!isClear(tx, ty, 10) || tx > xAt(COAST, ty) - 76) continue;
      if (rand() < 0.12) continue;
      out.push({ x: tx, y: ty, w: 28 + rand() * 14, d: 28 + rand() * 14, h: 30 + rand() * rand() * 120, tone: Math.floor(rand() * 3) });
    }
  }
  return out.sort((a, b) => a.y - b.y);
})();

/** Ocean Beach: art-deco low-rises down both sides of Ocean Drive. */
export interface Hotel {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: number;
}
export const HOTELS: Hotel[] = (() => {
  const rand = seeded(1996);
  const out: Hotel[] = [];
  for (let y = OCEAN_DRIVE_TOP + 24; y < OCEAN_DRIVE_BOTTOM - 40; y += 62) {
    for (const side of [-1, 1]) {
      const w = 40 + rand() * 12;
      const h = 34 + rand() * 14;
      const x = side < 0 ? OCEAN_DRIVE_X - 26 - w : OCEAN_DRIVE_X + 26;
      const cy = y + rand() * 8;
      if (!isClear(x + w / 2, cy, 0) || !onIsland(x + w / 2, cy)) continue;
      if (rand() < 0.1) continue;
      out.push({ x, y: cy, w, h, tone: Math.floor(rand() * 4) });
    }
  }
  return out;
})();

/** The port's stacked containers. */
export interface Container {
  x: number;
  y: number;
  tone: number;
}
export const CONTAINERS: Container[] = (() => {
  const rand = seeded(1977);
  const out: Container[] = [];
  for (let x = 1424; x < 1530; x += 26) {
    for (let y = 1112; y < 1250; y += 16) {
      if (rand() < 0.22) continue;
      out.push({ x, y, tone: Math.floor(rand() * 5) });
    }
  }
  return out;
})();

/** The Stockyard's warehouses. */
export interface Warehouse {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: number;
}
export const WAREHOUSES: Warehouse[] = (() => {
  const rand = seeded(1989);
  const out: Warehouse[] = [];
  for (let i = 0; i < 40 && out.length < 11; i++) {
    const w = 64 + rand() * 40;
    const h = 44 + rand() * 24;
    const x = STOCKYARD.x0 + 10 + rand() * (STOCKYARD.x1 - STOCKYARD.x0 - w - 20);
    const y = STOCKYARD.y0 + 10 + rand() * (STOCKYARD.y1 - STOCKYARD.y0 - h - 20);
    // Off the rails (two tracks across the yard) and the noir gate.
    if (y + h > 392 && y < 452) continue;
    if (!isClear(x + w / 2, y + h / 2, 0)) continue;
    if (out.some((o) => x < o.x + o.w + 14 && x + w + 14 > o.x && y < o.y + o.h + 14 && y + h + 14 > o.y)) continue;
    out.push({ x, y, w, h, tone: Math.floor(rand() * 3) });
  }
  return out;
})();

/** Palms along Ocean Drive and the mainland's streets. */
export const PALMS: Point[] = (() => {
  const rand = seeded(1985);
  const out: Point[] = [];
  for (let y = OCEAN_DRIVE_TOP + 10; y < OCEAN_DRIVE_BOTTOM; y += 56) {
    for (const [dx, off] of [[-34, 0], [34, 28]] as const) {
      const p = P(OCEAN_DRIVE_X + dx, y + off + rand() * 10);
      if (isClear(p.x, p.y, -40)) out.push(p);
    }
  }
  for (let i = 0; i < 160; i++) {
    const p = P(rand() * 1400, 40 + rand() * 1440);
    if (onMainland(p.x, p.y) && p.x < xAt(COAST, p.y) - 70 && !reserved(p.x, p.y, 10) && isClear(p.x, p.y, 10)) out.push(p);
  }
  return out;
})();
