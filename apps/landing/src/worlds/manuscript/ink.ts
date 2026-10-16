import type { Point } from '../../data/worlds';
import { seeded, smoothOpen } from '../shared/sketch';

// Pen-and-ink helpers for the parchment map: double-walled corridors, torn
// paper edges, hatching. All seeded, so server and client draw the same lines.

export const INK = 'var(--w-ink)';
export const OXBLOOD = 'var(--w-accent)';
export const GOLD = 'var(--w-deco-1)';
export const WATER = 'var(--w-deco-2)';
export const MOSS = 'var(--w-deco-3)';
export const PAPER = '#EFE0BA';
export const PAPER_DARK = '#E2CC9B';

/** Offset a polyline sideways by `d` (positive = left of travel). */
export function offset(points: Point[], d: number): Point[] {
  return points.map((p, i) => {
    const a = points[Math.max(0, i - 1)]!;
    const b = points[Math.min(points.length - 1, i + 1)]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { x: p.x - ((b.y - a.y) / len) * d, y: p.y + ((b.x - a.x) / len) * d };
  });
}

/** Sample a few points along a polyline with a slight hand wobble, for an inked line. */
export function wobble(points: Point[], seed: number, amp = 2.5): Point[] {
  const rand = seeded(seed);
  return points.map((p, i) =>
    i === 0 || i === points.length - 1 ? p : { x: p.x + (rand() - 0.5) * 2 * amp, y: p.y + (rand() - 0.5) * 2 * amp }
  );
}

/** Both walls of a corridor following `points`, `width` apart. */
export function corridor(points: Point[], width: number, seed: number): [string, string] {
  return [smoothOpen(wobble(offset(points, width / 2), seed)), smoothOpen(wobble(offset(points, -width / 2), seed + 7))];
}

/** A torn paper outline inside the rectangle (inset by `inset`). Straight segments: paper tears, it doesn't curve. */
export function tornRect(w: number, h: number, inset: number, seed: number, amp = 9, step = 26): string {
  const rand = seeded(seed);
  const pts: Point[] = [];
  const jag = () => (rand() - 0.3) * amp;
  for (let x = inset; x < w - inset; x += step * (0.6 + rand() * 0.8)) pts.push({ x, y: inset + jag() });
  for (let y = inset; y < h - inset; y += step * (0.6 + rand() * 0.8)) pts.push({ x: w - inset - jag(), y });
  for (let x = w - inset; x > inset; x -= step * (0.6 + rand() * 0.8)) pts.push({ x, y: h - inset - jag() });
  for (let y = h - inset; y > inset; y -= step * (0.6 + rand() * 0.8)) pts.push({ x: inset + jag(), y });
  return `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}Z`;
}

/** Diagonal hatch strokes filling a box, clipped by whoever uses it. */
export function hatch(x: number, y: number, w: number, h: number, gap = 9, angle = 45): string {
  const t = Math.tan((angle * Math.PI) / 180);
  let d = '';
  for (let i = -h; i < w; i += gap) {
    d += `M${(x + i).toFixed(1)} ${(y + h).toFixed(1)}l${(h / t).toFixed(1)} ${(-h).toFixed(1)}`;
  }
  return d;
}

/** A row of crenellations along the top of a wall from (x, y), `w` wide. */
export function battlements(x: number, y: number, w: number, tooth = 12): string {
  let d = `M${x} ${y}`;
  for (let i = 0; i < w; i += tooth * 2) {
    const a = Math.min(tooth, w - i);
    d += `h${a}v${-tooth * 0.8}h${Math.min(tooth, w - i - a)}v${tooth * 0.8}`;
  }
  return d;
}
