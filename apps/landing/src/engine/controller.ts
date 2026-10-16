import type { Point } from '../data/worlds';
import {
  clamp,
  clampView,
  easeInOut,
  lerp,
  panBy,
  readableZoom,
  screenToWorld,
  worldToScreen,
  zoomAround,
  zoomLimits,
  type Frame,
  type View,
} from './camera';
import { buildRoute, travelDuration } from './route';
import { addTick } from './scheduler';

// One controller per mounted map. It owns the camera, the gestures and the
// traveler, and writes straight to the DOM (a transform on the world layer and
// on the traveler) so nothing re-renders React per frame. React hears about
// arrivals through callbacks and about camera moves through onView().

export interface MapDom {
  /** The gesture surface: fills the screen, receives pointer, wheel and keys. */
  viewport: HTMLElement;
  /** The layer that pans and zooms (art, markers, route, traveler live inside). */
  world: HTMLElement;
  traveler: HTMLElement;
  /** The styled route line and the solid path that reveals it as it draws. */
  route: SVGPathElement;
  reveal: SVGPathElement;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Step {
  at: Point;
  /** Direction of travel in degrees (0 = east, 90 = south). */
  heading: number;
  /** Trip progress 0..1. */
  progress: number;
}

interface Trip {
  length: number;
  elapsed: number;
  duration: number;
  done: () => void;
}

interface Flight {
  from: View;
  to: View;
  elapsed: number;
  duration: number;
}

const DRAG_SLOP = 6;

export class MapController {
  view: View = { x: 0, y: 0, z: 1 };
  traveler: Point;
  heading = 0;
  private frame: Frame;
  private insets: Insets = { top: 0, right: 0, bottom: 0, left: 0 };
  private dom: MapDom;
  private reduced: boolean;
  private stopLoop: (() => void) | null = null;
  private trip: Trip | null = null;
  private flight: Flight | null = null;
  private following = false;
  private velocity = { x: 0, y: 0 };
  private viewListeners = new Set<() => void>();
  private stepListeners = new Set<(step: Step) => void>();
  private teardown: (() => void)[] = [];
  private moving = false;

  constructor(dom: MapDom, size: { w: number; h: number }, start: Point, reduced: boolean) {
    this.dom = dom;
    this.reduced = reduced;
    this.traveler = { ...start };
    this.frame = { w: size.w, h: size.h, vw: 1, vh: 1, pad: 80, minZ: 0.1, maxZ: 2.4 };
    this.measure();
    dom.world.style.transformOrigin = '0 0';
    dom.world.style.left = '0px';
    dom.world.style.top = '0px';
    dom.world.dataset.live = 'true';
    this.view = clampView({ ...start, z: readableZoom(this.frame) }, this.frame);
    this.centerOn(start);
    this.bind();
  }

  // ---------------------------------------------------------------- public

  onView(fn: () => void): () => void {
    this.viewListeners.add(fn);
    return () => this.viewListeners.delete(fn);
  }

  onStep(fn: (step: Step) => void): () => void {
    this.stepListeners.add(fn);
    return () => this.stepListeners.delete(fn);
  }

  get size() {
    return { vw: this.frame.vw, vh: this.frame.vh };
  }

  /** Screen areas covered by panels, so "centre" means the centre of what's visible. */
  setInsets(insets: Partial<Insets>): void {
    this.insets = { ...this.insets, ...insets };
  }

  setReducedMotion(reduced: boolean): void {
    this.reduced = reduced;
  }

  toScreen(p: Point): Point {
    return worldToScreen(p, this.view, this.frame.vw, this.frame.vh);
  }

  /** The visible (unobscured) rectangle, in screen px. */
  visibleRect() {
    const { top, right, bottom, left } = this.insets;
    return { x: left, y: top, w: this.frame.vw - left - right, h: this.frame.vh - top - bottom };
  }

  /** Put a world point at the centre of the visible area, instantly or with a short flight. */
  centerOn(p: Point, z = this.view.z, duration = 0): void {
    const target = this.viewCentering(p, z);
    if (duration && !this.reduced) this.flyTo(target, duration);
    else this.setView(target);
  }

  /** Fit a world rectangle into the visible area. */
  fitBox(box: { x: number; y: number; w: number; h: number }, duration = 0): void {
    const rect = this.visibleRect();
    const z = Math.min(rect.w / box.w, rect.h / box.h) * 0.92;
    this.centerOn({ x: box.x + box.w / 2, y: box.y + box.h / 2 }, z, duration);
  }

  /** Walk the traveler to `to` along a self-drawing route; the camera follows. */
  travelTo(to: Point, done: () => void): void {
    this.trip = null;
    const route = buildRoute(this.traveler, to);
    this.dom.route.setAttribute('d', route.d);
    this.dom.reveal.setAttribute('d', route.d);
    this.dom.route.parentElement?.setAttribute('data-state', 'drawing');
    if (this.reduced || route.length < 2) {
      this.dom.reveal.style.strokeDashoffset = '0';
      this.placeTraveler(to, this.headingTo(to));
      this.centerOn(to);
      this.dom.route.parentElement?.setAttribute('data-state', 'done');
      done();
      return;
    }
    const length = this.dom.route.getTotalLength();
    this.dom.reveal.style.strokeDashoffset = '1';
    this.trip = { length, elapsed: 0, duration: travelDuration(length), done };
    this.flight = null;
    this.velocity = { x: 0, y: 0 };
    this.following = true;
    this.dom.traveler.dataset.moving = 'true';
    this.wake();
  }

  /** Teleport the traveler (deep links, arriving through a portal). */
  placeAt(p: Point): void {
    this.trip = null;
    this.placeTraveler(p, this.heading);
  }

  get travelling(): boolean {
    return this.trip !== null;
  }

  zoomBy(factor: number): void {
    const { x, y, w, h } = this.visibleRect();
    const target = zoomAround(this.view, factor, x + w / 2, y + h / 2, this.frame);
    if (this.reduced) this.setView(target);
    else this.flyTo(target, 240);
  }

  /** Fly the camera back to the traveler. */
  recenter(): void {
    this.centerOn(this.traveler, this.view.z, 420);
  }

  destroy(): void {
    this.stopLoop?.();
    this.stopLoop = null;
    this.teardown.forEach((fn) => fn());
    this.viewListeners.clear();
    this.stepListeners.clear();
  }

  // --------------------------------------------------------------- private

  private measure() {
    const rect = this.dom.viewport.getBoundingClientRect();
    const vw = Math.max(1, rect.width);
    const vh = Math.max(1, rect.height);
    this.frame = { ...this.frame, vw, vh, ...zoomLimits(this.frame.w, this.frame.h, vw, vh) };
  }

  private viewCentering(p: Point, z: number): View {
    const zz = clamp(z, this.frame.minZ, this.frame.maxZ);
    const { x, y, w, h } = this.visibleRect();
    // Offset so `p` lands in the middle of the visible rect, not the whole screen.
    const fx = x + w / 2 - this.frame.vw / 2;
    const fy = y + h / 2 - this.frame.vh / 2;
    return clampView({ x: p.x - fx / zz, y: p.y - fy / zz, z: zz }, this.frame);
  }

  private setView(view: View) {
    this.view = clampView(view, this.frame);
    this.apply();
  }

  private flyTo(to: View, duration: number) {
    this.flight = { from: { ...this.view }, to: clampView(to, this.frame), elapsed: 0, duration };
    this.following = false;
    this.wake();
  }

  private apply() {
    const { x, y, z } = this.view;
    const tx = this.frame.vw / 2 - x * z;
    const ty = this.frame.vh / 2 - y * z;
    this.dom.world.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${z.toFixed(4)})`;
    this.dom.world.style.setProperty('--inv-z', (1 / z).toFixed(4));
    this.dom.world.style.setProperty('--z', z.toFixed(4));
    const zoom = z < 0.42 ? 'far' : 'near';
    if (this.dom.world.dataset.zoom !== zoom) this.dom.world.dataset.zoom = zoom;
    this.placeTraveler(this.traveler, this.heading);
    this.viewListeners.forEach((fn) => fn());
  }

  private headingTo(p: Point) {
    const dx = p.x - this.traveler.x;
    const dy = p.y - this.traveler.y;
    return Math.hypot(dx, dy) > 0.5 ? (Math.atan2(dy, dx) * 180) / Math.PI : this.heading;
  }

  private placeTraveler(p: Point, heading: number) {
    this.traveler = { x: p.x, y: p.y };
    this.heading = heading;
    const el = this.dom.traveler;
    el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) scale(${(1 / this.view.z).toFixed(4)})`;
    el.style.setProperty('--heading', `${heading.toFixed(1)}deg`);
  }

  private setMoving(moving: boolean) {
    if (moving === this.moving) return;
    this.moving = moving;
    // Promote the layer only while it moves; afterwards the SVG re-rasterizes crisply.
    this.dom.world.dataset.moving = moving ? 'true' : 'false';
  }

  private wake() {
    this.setMoving(true);
    if (!this.stopLoop) this.stopLoop = addTick(this.tick);
  }

  private sleep() {
    this.stopLoop?.();
    this.stopLoop = null;
    this.setMoving(false);
  }

  private tick = (_now: number, dt: number) => {
    let changed = false;

    if (this.trip) {
      const trip = this.trip;
      trip.elapsed += dt;
      const t = Math.min(1, trip.elapsed / trip.duration);
      const e = easeInOut(t);
      const p = this.dom.route.getPointAtLength(e * trip.length);
      const heading = this.headingTo(p);
      this.placeTraveler(p, heading);
      this.dom.reveal.style.strokeDashoffset = String(Math.max(0, 1 - Math.min(1, e * 1.06 + 0.03)));
      this.stepListeners.forEach((fn) => fn({ at: p, heading, progress: t }));
      if (t >= 1) {
        this.trip = null;
        this.dom.traveler.dataset.moving = 'false';
        this.dom.route.parentElement?.setAttribute('data-state', 'done');
        trip.done();
      }
    }

    if (this.flight) {
      const f = this.flight;
      f.elapsed += dt;
      const t = easeInOut(Math.min(1, f.elapsed / f.duration));
      this.view = {
        x: lerp(f.from.x, f.to.x, t),
        y: lerp(f.from.y, f.to.y, t),
        z: lerp(f.from.z, f.to.z, t),
      };
      changed = true;
      if (f.elapsed >= f.duration) this.flight = null;
    } else if (this.following) {
      const target = this.viewCentering(this.traveler, this.view.z);
      const k = 1 - Math.exp(-dt / 180);
      this.view = { x: lerp(this.view.x, target.x, k), y: lerp(this.view.y, target.y, k), z: this.view.z };
      changed = true;
      if (!this.trip && Math.hypot(target.x - this.view.x, target.y - this.view.y) < 0.5) {
        this.following = false;
      }
    } else if (Math.hypot(this.velocity.x, this.velocity.y) > 0.01) {
      this.view = clampView(panBy(this.view, this.velocity.x * dt, this.velocity.y * dt), this.frame);
      const decay = Math.exp(-dt / 260);
      this.velocity = { x: this.velocity.x * decay, y: this.velocity.y * decay };
      changed = true;
    }

    if (changed) {
      this.view = clampView(this.view, this.frame);
      this.apply();
    }
    const idle =
      !this.trip && !this.flight && !this.following && Math.hypot(this.velocity.x, this.velocity.y) <= 0.01;
    if (idle) this.sleep();
  };

  private stopMotion() {
    this.flight = null;
    this.following = false;
    this.velocity = { x: 0, y: 0 };
  }

  // -------------------------------------------------------------- gestures

  private bind() {
    const vp = this.dom.viewport;
    const pointers = new Map<number, { x: number; y: number }>();
    let drag: {
      id: number;
      sx: number;
      sy: number;
      lx: number;
      ly: number;
      lt: number;
      vx: number;
      vy: number;
      dragging: boolean;
    } | null = null;
    let pinch: { dist: number; cx: number; cy: number } | null = null;
    let suppressClick = false;

    const local = (cx: number, cy: number) => {
      const r = vp.getBoundingClientRect();
      return { x: cx - r.left, y: cy - r.top };
    };

    const twoFinger = () => {
      const [a, b] = [...pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
      return { dist: Math.hypot(b.x - a.x, b.y - a.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.stopMotion();
      if (pointers.size === 1) {
        drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, lt: e.timeStamp, vx: 0, vy: 0, dragging: false };
      } else if (pointers.size === 2) {
        pinch = twoFinger();
        if (drag) drag.dragging = true;
        for (const id of pointers.keys()) {
          try {
            vp.setPointerCapture(id);
          } catch {
            /* pointer already gone */
          }
        }
        this.setMoving(true);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size >= 2 && pinch) {
        const now = twoFinger();
        const at = local(now.cx, now.cy);
        let view = zoomAround(this.view, now.dist / Math.max(1, pinch.dist), at.x, at.y, this.frame);
        view = panBy(view, now.cx - pinch.cx, now.cy - pinch.cy);
        this.setView(view);
        pinch = now;
        return;
      }
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.dragging && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > DRAG_SLOP) {
        drag.dragging = true;
        this.following = false;
        try {
          vp.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        this.setMoving(true);
        vp.dataset.dragging = 'true';
      }
      if (drag.dragging) {
        const dx = e.clientX - drag.lx;
        const dy = e.clientY - drag.ly;
        const dt = Math.max(1, e.timeStamp - drag.lt);
        this.setView(panBy(this.view, dx, dy));
        // Smoothed release velocity in px/ms.
        drag.vx = drag.vx * 0.6 + (dx / dt) * 0.4;
        drag.vy = drag.vy * 0.6 + (dy / dt) * 0.4;
      }
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      drag.lt = e.timeStamp;
    };

    const onUp = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (drag && drag.id === e.pointerId) {
        if (drag.dragging) {
          suppressClick = true;
          setTimeout(() => (suppressClick = false), 0);
          const fresh = e.timeStamp - drag.lt < 90;
          if (fresh && !this.reduced) {
            this.velocity = { x: clamp(drag.vx, -3, 3), y: clamp(drag.vy, -3, 3) };
            this.wake();
          }
        }
        drag = null;
      }
      if (pointers.size === 1) {
        // Lifting one finger of a pinch: continue as a drag from where the other one is.
        const [id, p] = [...pointers.entries()][0]!;
        drag = { id, sx: p.x, sy: p.y, lx: p.x, ly: p.y, lt: e.timeStamp, vx: 0, vy: 0, dragging: true };
      }
      if (pointers.size === 0) {
        delete vp.dataset.dragging;
        if (!this.stopLoop) this.setMoving(false);
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.stopMotion();
      const at = local(e.clientX, e.clientY);
      const unit = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 400 : 1;
      const speed = e.ctrlKey ? 0.01 : 0.0016;
      const factor = Math.exp(-e.deltaY * unit * speed);
      this.setView(zoomAround(this.view, factor, at.x, at.y, this.frame));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      const step = 140;
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [step, 0],
        ArrowRight: [-step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };
      const move = moves[e.key];
      if (move) {
        e.preventDefault();
        const target = panBy(this.view, move[0], move[1]);
        if (this.reduced) this.setView(target);
        else this.flyTo(target, 200);
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        this.zoomBy(1.25);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        this.zoomBy(0.8);
      } else if (e.key === '0' || e.key === 'Home') {
        e.preventDefault();
        this.recenter();
      }
    };

    const ro = new ResizeObserver(() => {
      this.measure();
      this.setView(this.view);
    });
    ro.observe(vp);

    vp.addEventListener('pointerdown', onDown);
    vp.addEventListener('pointermove', onMove);
    vp.addEventListener('pointerup', onUp);
    vp.addEventListener('pointercancel', onUp);
    vp.addEventListener('click', onClickCapture, true);
    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('keydown', onKey);
    this.teardown.push(() => {
      ro.disconnect();
      vp.removeEventListener('pointerdown', onDown);
      vp.removeEventListener('pointermove', onMove);
      vp.removeEventListener('pointerup', onUp);
      vp.removeEventListener('pointercancel', onUp);
      vp.removeEventListener('click', onClickCapture, true);
      vp.removeEventListener('wheel', onWheel);
      vp.removeEventListener('keydown', onKey);
    });
  }

  /** Exposed for tests and the compass. */
  screenToWorld(p: Point): Point {
    return screenToWorld(p, this.view, this.frame.vw, this.frame.vh);
  }
}
