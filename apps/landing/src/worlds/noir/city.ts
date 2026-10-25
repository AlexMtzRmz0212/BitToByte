import { MAPS, type Point } from '../../data/worlds';
import { seeded } from '../shared/sketch';

// Gotham as data: a night city seen from above at an angle. Streets
// run east-west, avenues north-south, the harbor fills the south-east. Each
// block holds rows of towers, drawn back to front; the ground is kept clear
// around landmarks and gates so they stand on open plazas.

export const STREETS = [230, 560, 900, 1210];
export const AVENUES = [300, 760, 1240, 1720];
export const STREET_W = 64;
export const AVENUE_W = 74;
/** The harbor: water south of this line, east of HARBOR_X. */
export const HARBOR_Y = 1240;
export const HARBOR_X = 1300;

/** Oblique depth: a building's top is offset by this per unit of depth. */
export const DEPTH = { x: 0.55, y: -0.5 };

export interface Building {
  x: number; // front-bottom-left corner
  y: number;
  w: number;
  h: number;
  d: number;
  style: 'deco' | 'gothic' | 'slab';
  lit: number[]; // indices of lit windows
  cols: number;
  rows: number;
  spire: boolean;
  gargoyle: boolean;
  neon: boolean;
  seed: number;
}

const map = MAPS.noir;

const CLEAR: { at: Point; r: number }[] = [
  ...map.lots.map((at) => ({ at, r: 175 })),
  ...Object.values(map.gates).map((at) => ({ at: at!, r: 150 })),
  { at: map.spawn, r: 110 },
];

const onStreet = (x: number, w: number, y: number) =>
  AVENUES.some((ax) => x < ax + AVENUE_W / 2 && x + w > ax - AVENUE_W / 2) ||
  STREETS.some((sy) => Math.abs(y - sy) < STREET_W / 2 + 6);

const inHarbor = (x: number, y: number) => x > HARBOR_X - 40 && y > HARBOR_Y - 40;

function build(): Building[] {
  const rand = seeded(17);
  const out: Building[] = [];
  // Rows of building fronts, a little north of each street (and the map's south edge).
  const fronts = [...STREETS.map((s) => s - STREET_W / 2 - 4), 1490];
  for (const front of fronts) {
    for (let k = 0; k < 3; k++) {
      const y = front - k * 74;
      if (y < 90) continue;
      let x = 30 + rand() * 40;
      while (x < map.size.w - 60) {
        const w = 70 + Math.floor(rand() * 90);
        const ok =
          !onStreet(x, w, y) &&
          !inHarbor(x + w / 2, y) &&
          !CLEAR.some((c) => Math.hypot(c.at.x - (x + w / 2), c.at.y - y) < c.r);
        if (ok) {
          const tall = k === 2 ? 1.35 : k === 1 ? 1.1 : 0.85;
          const h = Math.round((90 + rand() * 230) * tall);
          const cols = Math.max(2, Math.floor((w - 16) / 18));
          const rows = Math.max(3, Math.floor((h - 24) / 22));
          const lit: number[] = [];
          for (let i = 0; i < cols * rows; i++) if (rand() < 0.22) lit.push(i);
          out.push({
            x,
            y,
            w,
            h,
            d: 40 + rand() * 30,
            style: rand() < 0.4 ? 'deco' : rand() < 0.6 ? 'gothic' : 'slab',
            lit,
            cols,
            rows,
            spire: rand() < 0.22,
            gargoyle: rand() < 0.3,
            neon: k === 0 && rand() < 0.18,
            seed: Math.floor(rand() * 1e6),
          });
        }
        x += w + 8 + rand() * 26;
      }
    }
  }
  // Back to front: higher on the map (smaller y) is farther away.
  return out.sort((a, b) => a.y - b.y || a.x - b.x);
}

export const BUILDINGS = build();
