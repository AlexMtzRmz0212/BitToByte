import type { Point } from '../../data/worlds';
import { seeded } from '../shared/sketch';

// Los Santos as data: a sunny coastal city seen from straight above, like an
// atlas page at sunset. Hills along the north with the sign, downtown towers
// in the middle, two freeways crossing at a cloverleaf, the beach and a pier
// along the south-west coast, the marina and the airport at either end.

const P = (x: number, y: number): Point => ({ x, y });

export const COAST: Point[] = [
  P(-20, 870),
  P(140, 930),
  P(260, 1010),
  P(380, 1110),
  P(520, 1176),
  P(700, 1228),
  P(900, 1262),
  P(1150, 1292),
  P(1400, 1330),
  P(1650, 1368),
  P(1900, 1398),
  P(2220, 1420),
];

export const HILLS: Point[] = [
  P(-20, 320),
  P(200, 268),
  P(400, 304),
  P(600, 246),
  P(800, 292),
  P(1000, 236),
  P(1200, 286),
  P(1400, 226),
  P(1600, 262),
  P(1800, 214),
  P(2000, 270),
  P(2220, 240),
];

/** Freeways: one east-west, one north-south, crossing at a cloverleaf. */
export const FWY_Y = 880;
export const FWY_X = 1560;
export const FWY_TOP = 300;
/** Where the east-west freeway leaves the coast highway. */
export const FWY_WEST = 150;
/** Where the north-south freeway meets the coast highway. */
export const FWY_BOTTOM = 1330;

/** A local street grid every GRID px, clipped to the land. */
export const GRID = 120;

/** Places the scenery keeps clear of: lots, gates, the secret, the stadium's car park. */
const CLEAR: [number, number, number][] = [
  [1380, 760, 170],
  [720, 1040, 200],
  [1720, 1020, 170],
  [860, 650, 170],
  [1820, 600, 170],
  [1180, 1060, 170],
  [1120, 240, 130],
  [1960, 330, 130],
  [260, 330, 130],
];
export const isClear = (x: number, y: number, pad = 0) =>
  CLEAR.every(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 > (r + pad) ** 2);

/** The coast's y at x, by straight lines between the coast points. */
export function coastY(x: number): number {
  for (let i = 0; i < COAST.length - 1; i++) {
    const a = COAST[i]!;
    const b = COAST[i + 1]!;
    if (x >= a.x && x <= b.x) return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
  }
  return COAST[COAST.length - 1]!.y;
}

export function hillY(x: number): number {
  for (let i = 0; i < HILLS.length - 1; i++) {
    const a = HILLS[i]!;
    const b = HILLS[i + 1]!;
    if (x >= a.x && x <= b.x) return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
  }
  return HILLS[HILLS.length - 1]!.y;
}

const DOWNTOWN = { x0: 990, x1: 1330, y0: 380, y1: 740 };
const AIRPORT = { x0: 1800, x1: 2220, y0: 1170, y1: 1390 };
export { AIRPORT, DOWNTOWN };

const onFreeway = (x: number, y: number, w: number, h: number, pad = 34) =>
  (y < FWY_Y + pad && y + h > FWY_Y - pad) || (x < FWY_X + pad && x + w > FWY_X - pad && y + h > FWY_TOP);

export interface Tower {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Height, as the length of the shadow it casts east. */
  z: number;
  tone: number;
}

/** Downtown, roof by roof. */
export const TOWERS: Tower[] = (() => {
  const rand = seeded(2013);
  const out: Tower[] = [];
  for (let gy = DOWNTOWN.y0; gy < DOWNTOWN.y1; gy += GRID) {
    for (let gx = DOWNTOWN.x0; gx < DOWNTOWN.x1; gx += GRID) {
      for (const [ox, oy] of [
        [14, 14],
        [62, 14],
        [14, 62],
        [62, 62],
      ] as const) {
        if (rand() < 0.25) continue;
        const w = 34 + rand() * 12;
        const h = 34 + rand() * 12;
        const x = gx + ox;
        const y = gy + oy;
        if (!isClear(x + w / 2, y + h / 2, 10) || onFreeway(x, y, w, h)) continue;
        out.push({ x, y, w, h, z: 30 + rand() * 90, tone: Math.floor(rand() * 3) });
      }
    }
  }
  return out;
})();

export interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'house-a' | 'house-b' | 'house-c' | 'pool' | 'park';
}

/** Low-rise blocks: houses with the odd pool, and parks. Merged into a few paths when drawn. */
export const BLOCKS: Block[] = (() => {
  const rand = seeded(2008);
  const out: Block[] = [];
  for (let gy = 300; gy < 1400; gy += GRID) {
    for (let gx = 0; gx < 2200; gx += GRID) {
      const inDowntown = gx >= DOWNTOWN.x0 - 10 && gx < DOWNTOWN.x1 && gy >= DOWNTOWN.y0 - 10 && gy < DOWNTOWN.y1;
      const inAirport = gx + GRID > AIRPORT.x0 && gy + GRID > AIRPORT.y0;
      if (inDowntown || inAirport) continue;
      if (rand() < 0.07) {
        const x = gx + 12;
        const y = gy + 12;
        if (gy + GRID < coastY(gx + GRID / 2) - 40 && gy > hillY(gx) + 30 && !onFreeway(x, y, 96, 96, 20))
          out.push({ x, y, w: 96, h: 96, kind: 'park' });
        continue;
      }
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const x = gx + 14 + c * 24;
          const y = gy + 14 + r * 32;
          const cx = x + 8;
          const cy = y + 10;
          if (cy < hillY(cx) + 24 || cy > coastY(cx) - 50) continue;
          if (!isClear(cx, cy) || onFreeway(x, y, 18, 20, 30)) continue;
          if (rand() < 0.12) continue;
          const roll = rand();
          out.push({ x, y, w: 16, h: 18, kind: roll < 0.4 ? 'house-a' : roll < 0.75 ? 'house-b' : 'house-c' });
          if (rand() < 0.14) out.push({ x: x + 1, y: y + 21, w: 12, h: 7, kind: 'pool' });
        }
      }
    }
  }
  return out;
})();

/** Palms along the beach road and the boulevards. */
export const PALMS: Point[] = (() => {
  const out: Point[] = [];
  for (let x = 120; x < 2160; x += 70) {
    const y = coastY(x) - 74;
    if (isClear(x, y) && !(x > AIRPORT.x0 - 20 && y > AIRPORT.y0 - 40) && Math.abs(x - FWY_X) > 50) out.push(P(x, y));
  }
  for (let y = 360; y < 1150; y += 64) {
    for (const x of [600, 2000]) if (isClear(x, y) && Math.abs(y - FWY_Y) > 40 && y < coastY(x) - 80) out.push(P(x, y));
  }
  return out;
})();
