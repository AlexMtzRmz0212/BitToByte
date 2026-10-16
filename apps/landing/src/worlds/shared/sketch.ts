import type { Point } from '../../data/worlds';

// Hand-drawn geometry helpers. Every map is code-drawn SVG; these add the small
// irregularities (a wobbly ring, a lumpy rock, an inked line that isn't ruler
// straight) that keep it from looking like clip art. All of it is seeded, so the
// server and the client draw exactly the same shapes.

export function seeded(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A smooth closed curve through the points (Catmull-Rom as cubic Beziers). */
export function smoothClosed(points: Point[], tension = 1): string {
  const n = points.length;
  if (n < 3) return '';
  const at = (i: number) => points[(i + n) % n]!;
  let d = `M${r1(at(0).x)} ${r1(at(0).y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * tension, y: p1.y + ((p2.y - p0.y) / 6) * tension };
    const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * tension, y: p2.y - ((p3.y - p1.y) / 6) * tension };
    d += `C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p2.x)} ${r1(p2.y)}`;
  }
  return `${d}Z`;
}

/** A smooth open curve through the points. */
export function smoothOpen(points: Point[]): string {
  const n = points.length;
  if (n < 2) return '';
  const at = (i: number) => points[Math.max(0, Math.min(n - 1, i))]!;
  let d = `M${r1(at(0).x)} ${r1(at(0).y)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p2.x)} ${r1(p2.y)}`;
  }
  return d;
}

/** A ring that isn't quite round. `amp` is the wobble as a fraction of the radius. */
export function wobblyCircle(cx: number, cy: number, r: number, seed = 1, amp = 0.035, points = 16): string {
  const rand = seeded(seed);
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (1 + (rand() - 0.5) * 2 * amp);
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr };
  });
  return smoothClosed(pts);
}

/** An ellipse with a lumpy outline: rocks, islands, clouds. */
export function blob(cx: number, cy: number, rx: number, ry: number, seed = 1, amp = 0.16, points = 12): string {
  const rand = seeded(seed);
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const k = 1 + (rand() - 0.5) * 2 * amp;
    return { x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k };
  });
  return smoothClosed(pts);
}

/** An inked line between two points with a slight hand tremor. */
export function inkLine(a: Point, b: Point, seed = 1, amp = 3, segments = 4): string {
  const rand = seeded(seed);
  const pts: Point[] = [a];
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const nx = -(b.y - a.y) / len;
  const ny = (b.x - a.x) / len;
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const off = (rand() - 0.5) * 2 * amp;
    pts.push({ x: a.x + (b.x - a.x) * t + nx * off, y: a.y + (b.y - a.y) * t + ny * off });
  }
  pts.push(b);
  return smoothOpen(pts);
}

/** Points of a regular star / burst, as an SVG points attribute. */
export function burst(cx: number, cy: number, outer: number, inner: number, spikes: number, rotate = 0): string {
  return Array.from({ length: spikes * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (i / (spikes * 2)) * Math.PI * 2 + rotate;
    return `${r1(cx + Math.cos(a) * r)},${r1(cy + Math.sin(a) * r)}`;
  }).join(' ');
}

/** An Archimedean spiral arm from the centre outwards. */
export function spiralArm(cx: number, cy: number, r: number, turns: number, phase: number, steps = 28): string {
  const pts = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const a = phase + t * turns * Math.PI * 2;
    const rr = r * (0.12 + 0.88 * t);
    return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr };
  });
  return smoothOpen(pts);
}
