import { describe, expect, it } from 'vitest';
import { projects } from '../data/projects';
import { MAPS, WORLD_IDS, arrivalPoint, departureGate, type PlaceId } from '../data/worlds';
import { clampView, readableZoom, screenToWorld, worldToScreen, zoomAround, zoomLimits, type Frame } from './camera';
import { placeProjects } from './lots';
import { buildRoute, travelDuration } from './route';

const frame = (vw: number, vh: number): Frame => ({ w: 2200, h: 1500, vw, vh, pad: 60, ...zoomLimits(2200, 1500, vw, vh) });

describe('camera math', () => {
  it('round-trips world and screen coordinates', () => {
    const view = { x: 700, y: 420, z: 0.8 };
    const p = { x: 1234, y: 567 };
    const back = screenToWorld(worldToScreen(p, view, 1440, 900), view, 1440, 900);
    expect(back.x).toBeCloseTo(p.x);
    expect(back.y).toBeCloseTo(p.y);
  });

  it('keeps the point under the cursor fixed while zooming', () => {
    const f = frame(1440, 900);
    const view = { x: 1100, y: 750, z: 0.8 };
    const cursor = { x: 300, y: 200 };
    const before = screenToWorld(cursor, view, f.vw, f.vh);
    const after = screenToWorld(cursor, zoomAround(view, 1.5, cursor.x, cursor.y, f), f.vw, f.vh);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('clamps zoom and always keeps the screen centre over the map', () => {
    for (const [vw, vh] of [[390, 844], [1440, 900], [2560, 1440]] as const) {
      const f = frame(vw, vh);
      for (const z of [0.01, f.minZ, 0.8, 50]) {
        for (const [x, y] of [[-9999, -9999], [1100, 750], [9999, 9999]] as const) {
          const out = clampView({ x, y, z }, f);
          expect(out.z).toBeGreaterThanOrEqual(f.minZ);
          expect(out.z).toBeLessThanOrEqual(f.maxZ);
          expect(out.x).toBeGreaterThanOrEqual(0);
          expect(out.x).toBeLessThanOrEqual(f.w);
          expect(out.y).toBeGreaterThanOrEqual(0);
          expect(out.y).toBeLessThanOrEqual(f.h);
        }
      }
    }
  });

  it('lets a big map pan right up to its edges, but not far past them', () => {
    const f = frame(390, 844);
    const z = 1;
    const out = clampView({ x: -9999, y: 750, z }, f);
    const voidPx = (0 - out.x) * z + f.vw / 2; // screen px left of the map's edge
    expect(voidPx).toBeGreaterThan(0);
    expect(voidPx).toBeLessThan(f.vw * 0.3);
  });

  it('starts at a readable zoom on phones and desktops', () => {
    for (const [vw, vh] of [[390, 844], [1440, 900]] as const) {
      const f = frame(vw, vh);
      const z = readableZoom(f);
      expect(z).toBeGreaterThanOrEqual(f.minZ);
      expect(z).toBeLessThanOrEqual(1.1);
    }
  });
});

describe('routes', () => {
  it('starts and ends where asked, with a sensible duration', () => {
    const r = buildRoute({ x: 0, y: 0 }, { x: 600, y: 300 });
    expect(r.d.startsWith('M0 0C')).toBe(true);
    expect(r.d.endsWith('600 300')).toBe(true);
    expect(r.length).toBeGreaterThan(Math.hypot(600, 300) - 1);
    expect(travelDuration(r.length)).toBeGreaterThanOrEqual(800);
    expect(travelDuration(100000)).toBe(2200);
  });

  it('handles a zero-length trip', () => {
    expect(buildRoute({ x: 5, y: 5 }, { x: 5, y: 5 }).length).toBe(0);
  });
});

describe('world maps', () => {
  it('places every project on its own world, on distinct spots inside the map', () => {
    for (const id of WORLD_IDS) {
      const placed = placeProjects(id);
      const map = MAPS[id];
      expect(placed.length).toBe(projects.filter((p) => p.world === id).length);
      expect(map.lots.length).toBeGreaterThanOrEqual(placed.length);
      const keys = new Set(placed.map((p) => `${p.at.x},${p.at.y}`));
      expect(keys.size).toBe(placed.length);
      for (const { at } of placed) {
        expect(at.x).toBeGreaterThan(0);
        expect(at.x).toBeLessThan(map.size.w);
        expect(at.y).toBeGreaterThan(0);
        expect(at.y).toBeLessThan(map.size.h);
      }
    }
  });

  it('connects every world to the hub and to two neighbours', () => {
    for (const id of WORLD_IDS) {
      expect(MAPS.nexus.gates[id]).toBeDefined();
      const gates = Object.keys(MAPS[id].gates);
      expect(gates).toContain('nexus');
      expect(gates.length).toBe(3);
      for (const key of gates) {
        const to = key as PlaceId;
        expect(departureGate(id, to)).toEqual(MAPS[id].gates[to]);
        // Arriving from here lands on the matching gate over there.
        expect(arrivalPoint(to, id)).toEqual(MAPS[to].gates[id]);
      }
    }
  });
});
