import { MAPS, type Point } from '../../data/worlds';
import { seeded } from '../shared/sketch';
import { H, S, W } from '../shared/iso';

// Blockport as data: a floating island of blocks, generated once
// from a seed. Heights come from smooth value noise; a river and two pools are
// carved in; the ground is flattened around every landmark, gate and the
// arrival point so buildings stand level. Rendering (Terrain.tsx) walks this
// grid back to front.

export const OX = 1100;
export const OY = 0;

export type Material = 'grass' | 'sand' | 'water' | 'stone';

export interface Tile {
  i: number;
  j: number;
  x: number; // ground-level centre (world-map coordinates)
  y: number;
  h: number; // top level: 1 = water, 2 = ground, 3+ = hills
  mat: Material;
  tree: boolean;
  flower: 0 | 1 | 2;
  /** How far the underside hangs below an exposed edge, in blocks. */
  hang: number;
  seed: number;
}

const map = MAPS.voxel;
const CX = 1100;
const CY = 760;

// Smooth value noise.
function noise2(seed: number) {
  const rand = seeded(seed);
  const size = 16;
  const grid = Array.from({ length: size * size }, () => rand());
  const at = (x: number, y: number) => grid[((y % size) + size) % size * size + (((x % size) + size) % size)]!;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const fx = smooth(x - xi);
    const fy = smooth(y - yi);
    const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * fx;
    const b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * fx;
    return a + (b - a) * fy;
  };
}

const hills = noise2(11);
const edge = noise2(23);

const RIVER: Point[] = [
  { x: 830, y: 120 },
  { x: 910, y: 330 },
  { x: 850, y: 560 },
  { x: 620, y: 860 },
  { x: 460, y: 1070 },
];
const POOLS = [
  { x: 420, y: 1130, r: 150 },
  { x: 1790, y: 1120, r: 110 },
];

function distToPolyline(p: Point, line: Point[]) {
  let best = Infinity;
  for (let k = 1; k < line.length; k++) {
    const a = line[k - 1]!;
    const b = line[k]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t)));
  }
  return best;
}

/** Places that must be level ground: lots, gates, the arrival point. */
const LEVEL: { at: Point; r: number }[] = [
  ...map.lots.map((at) => ({ at, r: 170 })),
  ...Object.values(map.gates).map((at) => ({ at: at!, r: 150 })),
  { at: map.spawn, r: 140 },
];

function inside(x: number, y: number) {
  const dx = Math.abs(x - CX) / 1010;
  const dy = Math.abs(y - CY) / 650;
  const wobble = (edge(x / 160, y / 160) - 0.5) * 0.16;
  return dx ** 2.4 + dy ** 2.4 <= 1 + wobble;
}

function build(): Tile[][] {
  const rand = seeded(5);
  const byKey = new Map<string, Tile>();
  for (let i = -4; i < 60; i++) {
    for (let j = -4; j < 60; j++) {
      const x = OX + (i - j) * W;
      const y = OY + (i + j) * H;
      if (x < 40 || x > map.size.w - 40 || y < 60 || y > map.size.h - 60 || !inside(x, y)) continue;
      const p = { x, y };
      const n = hills(x / 330, y / 330);
      let h = 2 + (n > 0.6 ? 1 : 0) + (n > 0.74 ? 1 : 0) + (n > 0.86 ? 1 : 0);
      let mat: Material = h >= 5 ? 'stone' : 'grass';
      const wet = distToPolyline(p, RIVER) < 52 || POOLS.some((q) => Math.hypot(x - q.x, y - q.y) < q.r);
      if (wet) {
        h = 1;
        mat = 'water';
      }
      const level = LEVEL.find((l) => Math.hypot(x - l.at.x, y - l.at.y) < l.r);
      if (level) {
        h = 2;
        mat = 'grass';
      }
      const clear = !LEVEL.some((l) => Math.hypot(x - l.at.x, y - l.at.y) < l.r + 50);
      byKey.set(`${i},${j}`, {
        i,
        j,
        x,
        y,
        h,
        mat,
        tree: mat === 'grass' && clear && h <= 3 && rand() < 0.1,
        flower: mat === 'grass' && rand() < 0.14 ? (rand() < 0.5 ? 1 : 2) : 0,
        hang: 0,
        seed: Math.floor(rand() * 1e6),
      });
    }
  }
  // Shores: ground next to water turns to sand. Exposed edges hang below the island.
  for (const t of byKey.values()) {
    const n = (di: number, dj: number) => byKey.get(`${t.i + di},${t.j + dj}`);
    if (t.mat === 'grass' && t.h === 2) {
      const wetNear = [n(1, 0), n(-1, 0), n(0, 1), n(0, -1)].some((m) => m?.mat === 'water');
      if (wetNear) {
        t.mat = 'sand';
        t.tree = false;
        t.flower = 0;
      }
    }
    if (!n(0, 1) || !n(1, 0)) t.hang = 2 + Math.floor(((t.seed % 97) / 97) * 4);
  }
  // Rows back to front (i + j), left to right within a row.
  const rows: Tile[][] = [];
  for (const t of byKey.values()) (rows[t.i + t.j + 8] ??= []).push(t);
  return rows.filter(Boolean).map((row) => row.sort((a, b) => a.i - b.i));
}

export const ROWS = build();

const byPos = new Map<string, Tile>();
for (const row of ROWS) for (const t of row) byPos.set(`${t.i},${t.j}`, t);

export const tileAtIJ = (i: number, j: number) => byPos.get(`${i},${j}`);

/** Top-face centre of a tile, at its own height. */
export const topOf = (t: Tile) => ({ x: t.x, y: t.y - (t.h - 2) * S });
