import type { Point } from '../data/worlds';

// Camera math for the maps. A view is the world point at the centre of the
// screen plus a zoom factor (screen px per world unit). Everything here is pure,
// so it is unit-tested; CameraController (below) owns the per-frame state.

export interface View {
  x: number;
  y: number;
  z: number;
}

export interface Frame {
  /** Map size in world units. */
  w: number;
  h: number;
  /** Viewport size in CSS px. */
  vw: number;
  vh: number;
  /** World units of slack allowed past each map edge. */
  pad: number;
  minZ: number;
  maxZ: number;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Zoom limits: zoomed out, the whole map fits even beside open panels; zoomed in up to 2.4x. */
export function zoomLimits(w: number, h: number, vw: number, vh: number) {
  const fit = Math.min(vw / w, vh / h);
  const minZ = fit * 0.55;
  const maxZ = Math.max(2.4, minZ * 2);
  return { minZ, maxZ };
}

/**
 * Keep the map on screen. A map bigger than the screen can be panned only a
 * little past its edges; one smaller than the screen can slide around (enough
 * to clear a panel) but always stays mostly visible.
 */
export function clampView(view: View, f: Frame): View {
  const z = clamp(view.z, f.minZ, f.maxZ);
  const halfW = f.vw / (2 * z);
  const halfH = f.vh / (2 * z);
  const axis = (value: number, size: number, half: number) => {
    if (size >= 2 * half) {
      const reach = Math.max(20, half * 0.22);
      return clamp(value, half - reach, size - half + reach);
    }
    // At most a quarter of a small map may slide off screen.
    const give = Math.min(half * 0.3, size * 0.25);
    return clamp(value, size - half - give, half + give);
  };
  return { x: axis(view.x, f.w, halfW), y: axis(view.y, f.h, halfH), z };
}

export function worldToScreen(p: Point, v: View, vw: number, vh: number): Point {
  return { x: (p.x - v.x) * v.z + vw / 2, y: (p.y - v.y) * v.z + vh / 2 };
}

export function screenToWorld(p: Point, v: View, vw: number, vh: number): Point {
  return { x: (p.x - vw / 2) / v.z + v.x, y: (p.y - vh / 2) / v.z + v.y };
}

/** Zoom by `factor` keeping the world point under screen point (sx, sy) fixed. */
export function zoomAround(v: View, factor: number, sx: number, sy: number, f: Frame): View {
  const z = clamp(v.z * factor, f.minZ, f.maxZ);
  const anchor = screenToWorld({ x: sx, y: sy }, v, f.vw, f.vh);
  return {
    x: anchor.x - (sx - f.vw / 2) / z,
    y: anchor.y - (sy - f.vh / 2) / z,
    z,
  };
}

/** Pan by a screen-space delta (drag direction: the map follows the finger). */
export const panBy = (v: View, dx: number, dy: number): View => ({
  x: v.x - dx / v.z,
  y: v.y - dy / v.z,
  z: v.z,
});

/** A comfortable starting zoom: roughly `span` world units across (more on wide screens). */
export function readableZoom(f: Frame, span = f.vw < 700 ? 900 : 1900): number {
  return clamp(Math.min(f.vw, f.vh * 1.4) / span, f.minZ, Math.min(1.1, f.maxZ));
}

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
