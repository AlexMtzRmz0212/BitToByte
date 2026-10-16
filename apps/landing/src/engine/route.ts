import type { Point } from '../data/worlds';

// The traveler's route: a gentle curve from where it stands to where it's going.
// The SVG path string drives both the drawn line and (through getPointAtLength)
// the traveler's position, so the two always agree.

export interface Route {
  d: string;
  from: Point;
  to: Point;
  length: number;
}

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** A cubic curve that bows to one side, more for longer trips, never wildly. */
export function buildRoute(from: Point, to: Point): Route {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) {
    return { d: `M${from.x} ${from.y}L${to.x} ${to.y}`, from, to, length: 0 };
  }
  // Bow left or right depending on direction, so routes look hand-planned rather than random.
  const side = dx >= 0 ? 1 : -1;
  const bend = Math.min(length * 0.22, 160) * side;
  const nx = (-dy / length) * bend;
  const ny = (dx / length) * bend;
  const c1 = { x: from.x + dx * 0.3 + nx, y: from.y + dy * 0.3 + ny };
  const c2 = { x: from.x + dx * 0.7 + nx, y: from.y + dy * 0.7 + ny };
  const f = (n: number) => Math.round(n * 10) / 10;
  return {
    d: `M${f(from.x)} ${f(from.y)}C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(to.x)} ${f(to.y)}`,
    from,
    to,
    // Chord plus control polygon over two: a close, cheap estimate of the arc length.
    length: (dist(from, to) + dist(from, c1) + dist(c1, c2) + dist(c2, to)) / 2,
  };
}

/** Trip time in ms: brisk for short hops, capped for long ones. */
export const travelDuration = (length: number) => Math.round(Math.min(2200, Math.max(800, 380 + length * 0.9)));
