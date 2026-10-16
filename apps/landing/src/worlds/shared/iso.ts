// Isometric geometry for the block world. A tile is a 2W x 2H diamond on the
// ground; a block is S tall. Ground level is "level 2" so that the ground of a
// tile sits exactly at its world-map coordinates (routes and lots line up).

export const W = 56;
export const H = 28;
export const S = 32;

const f = (n: number) => Math.round(n * 10) / 10;

/** Screen (world-map) position of the centre of tile (i, j)'s top at `level`. */
export function tileCentre(i: number, j: number, level: number, ox: number, oy: number) {
  return { x: ox + (i - j) * W, y: oy + (i + j) * H - (level - 2) * S };
}

/** Inverse: which tile is under a world-map point at ground level. */
export function tileAt(x: number, y: number, ox: number, oy: number) {
  const a = (y - oy) / H;
  const b = (x - ox) / W;
  return { i: Math.round((a + b) / 2), j: Math.round((a - b) / 2) };
}

export const poly = (pts: [number, number][]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;

/**
 * An isometric box standing with its base centred on (x, y): `ni` tiles along
 * one axis, `nj` along the other, `nh` blocks tall. Returns the three visible
 * faces as path strings.
 */
export function isoBox(x: number, y: number, ni: number, nj: number, nh: number) {
  const ix = (W * ni) / 2;
  const iy = (H * ni) / 2;
  const jx = (W * nj) / 2;
  const jy = (H * nj) / 2;
  const up = S * nh;
  // Footprint corners: front (lowest on screen), right, back, left.
  const front: [number, number] = [x + ix - jx, y + iy + jy];
  const right: [number, number] = [x + ix + jx, y + iy - jy];
  const back: [number, number] = [x - ix + jx, y - iy - jy];
  const left: [number, number] = [x - ix - jx, y - iy + jy];
  const lift = (p: [number, number]): [number, number] => [p[0], p[1] - up];
  return {
    top: poly([lift(front), lift(right), lift(back), lift(left)]),
    left: poly([left, front, lift(front), lift(left)]),
    right: poly([front, right, lift(right), lift(front)]),
    /** Useful anchors. */
    topCentre: { x, y: y - up },
    frontTop: { x: front[0], y: front[1] - up },
  };
}

/**
 * A point on a visible face of the box from isoBox(x, y, ni, nj, nh).
 * `u` runs across the face (0 = its left edge, 1 = its right edge), `v` up it (0 = ground, 1 = top).
 */
export function facePoint(
  x: number, y: number, ni: number, nj: number, nh: number,
  side: 'left' | 'right', u: number, v: number
): [number, number] {
  const ix = (W * ni) / 2;
  const iy = (H * ni) / 2;
  const jx = (W * nj) / 2;
  const jy = (H * nj) / 2;
  const front: [number, number] = [x + ix - jx, y + iy + jy];
  const right: [number, number] = [x + ix + jx, y + iy - jy];
  const left: [number, number] = [x - ix - jx, y - iy + jy];
  const [a, b] = side === 'left' ? [left, front] : [front, right];
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - v * S * nh];
}

/** A quad on a face of a box (windows, doors, signs, clock faces). */
export function faceQuad(
  x: number, y: number, ni: number, nj: number, nh: number,
  side: 'left' | 'right', u0: number, u1: number, v0: number, v1: number
): string {
  const p = (u: number, v: number) => facePoint(x, y, ni, nj, nh, side, u, v);
  return poly([p(u0, v0), p(u1, v0), p(u1, v1), p(u0, v1)]);
}
