import type { MapLayout } from '../../data/worlds';
import { H, S, W, isoBox } from '../shared/iso';
import { seeded } from '../shared/sketch';
import { ROWS, tileAtIJ, type Tile } from './island';

// Draws the island back to front, one row of tiles at a time. Each row's faces
// are merged into one path per material, so ~1,400 blocks cost a few hundred
// DOM nodes, and the painter's order keeps every overlap correct.

type Bucket = Map<string, string[]>;

const f = (n: number) => Math.round(n * 10) / 10;
const quad = (a: number[], b: number[], c: number[], d: number[]) =>
  `M${f(a[0]!)} ${f(a[1]!)}L${f(b[0]!)} ${f(b[1]!)}L${f(c[0]!)} ${f(c[1]!)}L${f(d[0]!)} ${f(d[1]!)}Z`;

function add(bucket: Bucket, key: string, d: string) {
  const list = bucket.get(key);
  if (list) list.push(d);
  else bucket.set(key, [d]);
}

/** Top-of-level y for a tile's centre. */
const yAt = (t: Tile, level: number) => t.y - (level - 2) * S;

function drawTile(t: Tile, bucket: Bucket) {
  const { x } = t;
  const rand = seeded(t.seed);
  const top = yAt(t, t.h);

  // Top face.
  const topKey = t.mat === 'water' ? 'vx-water-top' : `vx-${t.mat}-top`;
  add(bucket, topKey, quad([x, top - H], [x + W, top], [x, top + H], [x - W, top]));

  // Texture speckles on the top.
  if (t.mat !== 'water') {
    for (let k = 0; k < 2; k++) {
      const sx = x + (rand() - 0.5) * W * 1.1;
      const sy = top + (rand() - 0.5) * H * 1.1;
      add(bucket, `vx-${t.mat}-speck`, quad([sx, sy - 3.5], [sx + 7, sy], [sx, sy + 3.5], [sx - 7, sy]));
    }
    if (t.flower) {
      const sx = x + (rand() - 0.5) * W * 0.8;
      const sy = top + (rand() - 0.5) * H * 0.8;
      add(bucket, t.flower === 1 ? 'vx-flower-red' : 'vx-flower-yellow', quad([sx, sy - 4], [sx + 4, sy - 8], [sx + 8, sy - 4], [sx + 4, sy]));
    }
  } else if (rand() < 0.35) {
    const sx = x + (rand() - 0.5) * W;
    const sy = top + (rand() - 0.5) * H * 0.6;
    add(bucket, 'vx-ripple', `M${f(sx - 10)} ${f(sy)}l10 5l10 -5`);
  }

  // Side faces where the neighbour in front is lower (or missing: then hang below the island).
  const sides: ['left' | 'right', Tile | undefined][] = [
    ['left', tileAtIJ(t.i, t.j + 1)],
    ['right', tileAtIJ(t.i + 1, t.j)],
  ];
  for (const [side, n] of sides) {
    const floor = n ? n.h : 2 - t.hang;
    if (floor >= t.h) continue;
    for (let level = t.h; level > floor; level--) {
      const y0 = yAt(t, level);
      const face =
        side === 'left'
          ? quad([x - W, y0], [x, y0 + H], [x, y0 + H + S], [x - W, y0 + S])
          : quad([x, y0 + H], [x + W, y0], [x + W, y0 + S], [x, y0 + H + S]);
      const material = t.mat === 'water' ? 'water' : level === t.h ? t.mat : level >= 1 ? 'dirt' : 'stone';
      add(bucket, `vx-${material}-${side}`, face);
      // Grass blocks: a fringe of green over the dirt, the way turf hangs over an edge.
      if (material === 'grass') {
        const fr = S * 0.28;
        add(
          bucket,
          `vx-fringe-${side}`,
          side === 'left'
            ? quad([x - W, y0], [x, y0 + H], [x, y0 + H + fr], [x - W, y0 + fr * 1.4])
            : quad([x, y0 + H], [x + W, y0], [x + W, y0 + fr * 1.4], [x, y0 + H + fr])
        );
      }
      if (material !== 'water' && rand() < 0.6) {
        const u = 0.2 + rand() * 0.6;
        const v = 0.3 + rand() * 0.5;
        const px = side === 'left' ? x - W + u * W : x + u * W;
        const py = (side === 'left' ? y0 + u * H : y0 + H - u * H) + v * S;
        add(bucket, `vx-${material === 'grass' ? 'dirt' : material}-speck`, quad([px, py], [px + 7, py + 3.5], [px + 7, py + 10.5], [px, py + 7]));
      }
    }
  }

  // A block tree: a short trunk under a cube of leaves.
  if (t.tree) {
    const trunk = isoBox(x, top, 0.26, 0.26, 1.3);
    add(bucket, 'vx-trunk-left', trunk.left);
    add(bucket, 'vx-trunk-right', trunk.right);
    const leaves = isoBox(x, top - S * 1.05, 1.15, 1.15, 1.25);
    add(bucket, 'vx-leaf-top', leaves.top);
    add(bucket, 'vx-leaf-left', leaves.left);
    add(bucket, 'vx-leaf-right', leaves.right);
    const cap = isoBox(x, top - S * 2.3, 0.6, 0.6, 0.5);
    add(bucket, 'vx-leaf-top', cap.top);
    add(bucket, 'vx-leaf-left', cap.left);
    add(bucket, 'vx-leaf-right', cap.right);
  }
}

// Order inside a row: draw the farther faces first so seams stay clean.
const ORDER = [
  'vx-stone-left', 'vx-stone-right', 'vx-stone-speck',
  'vx-dirt-left', 'vx-dirt-right', 'vx-dirt-speck',
  'vx-water-left', 'vx-water-right', 'vx-water-top', 'vx-ripple',
  'vx-sand-left', 'vx-sand-right', 'vx-sand-top', 'vx-sand-speck',
  'vx-grass-left', 'vx-grass-right', 'vx-fringe-left', 'vx-fringe-right',
  'vx-grass-top', 'vx-grass-speck', 'vx-flower-red', 'vx-flower-yellow',
  'vx-trunk-left', 'vx-trunk-right', 'vx-leaf-left', 'vx-leaf-right', 'vx-leaf-top',
];

const ROW_PATHS = ROWS.map((row) => {
  const bucket: Bucket = new Map();
  for (const t of row) drawTile(t, bucket);
  return ORDER.filter((k) => bucket.has(k)).map((k) => ({ key: k, d: bucket.get(k)!.join('') }));
});

const CLOUDS = [
  { x: 380, y: 160, ni: 4, nj: 2, d: 0 },
  { x: 1500, y: 120, ni: 5, nj: 3, d: -9 },
  { x: 1960, y: 760, ni: 3, nj: 2, d: -21 },
  { x: 700, y: 1360, ni: 4, nj: 2, d: -14 },
  { x: 160, y: 700, ni: 3, nj: 2, d: -30 },
];

export default function VoxelTerrain({ layout }: { layout: MapLayout }) {
  return (
    <>
      {/* the island's shadow on the sky below */}
      <ellipse cx="1100" cy={layout.size.h - 30} rx="760" ry="34" fill="#1B2A41" opacity="0.08" />
      {ROW_PATHS.map((paths, r) => (
        <g key={r}>
          {paths.map((p) => (
            <path key={p.key} className={p.key} d={p.d} />
          ))}
        </g>
      ))}
    </>
  );
}

/** Cuboid clouds, drawn above everything else on the map. */
export function VoxelClouds() {
  return (
    <g className="vx-clouds" pointerEvents="none">
      {CLOUDS.map((c, k) => {
        const box = isoBox(c.x, c.y, c.ni, c.nj, 0.45);
        return (
          <g key={k} className="vx-cloud" style={{ animationDelay: `${c.d}s` }}>
            <path d={box.left} className="vx-cloud-side" />
            <path d={box.right} className="vx-cloud-side2" />
            <path d={box.top} className="vx-cloud-top" />
          </g>
        );
      })}
    </g>
  );
}

/** World-space layer above landmarks and routes: the drifting clouds. */
export function CloudLayer({ layout }: { layout: MapLayout }) {
  return (
    <svg className="map-overlay" width={layout.size.w} height={layout.size.h} viewBox={`0 0 ${layout.size.w} ${layout.size.h}`} aria-hidden="true" focusable="false">
      <VoxelClouds />
    </svg>
  );
}
