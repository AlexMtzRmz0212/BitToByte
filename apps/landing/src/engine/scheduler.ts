// One requestAnimationFrame loop for everything that animates per frame
// (starfield, camera inertia, traveler, particles). It stops when nothing is
// registered and pauses while the tab is hidden, so a background tab costs
// nothing. Callbacks write to the DOM or a canvas, never to React state.

export type Tick = (now: number, dt: number) => void;

const ticks = new Set<Tick>();
let raf = 0;
let last = 0;

const hidden = () => typeof document !== 'undefined' && document.hidden;

function frame(now: number) {
  // Clamp dt so a long pause (tab switch, breakpoint) doesn't teleport things.
  const dt = last ? Math.min(64, now - last) : 16;
  last = now;
  for (const tick of ticks) tick(now, dt);
  raf = ticks.size && !hidden() ? requestAnimationFrame(frame) : 0;
}

function start() {
  if (raf || hidden() || !ticks.size) return;
  last = 0;
  raf = requestAnimationFrame(frame);
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

/** Run `tick` every frame until the returned function is called. */
export function addTick(tick: Tick): () => void {
  ticks.add(tick);
  start();
  return () => {
    ticks.delete(tick);
    if (!ticks.size) stop();
  };
}

/** Run once the main thread is idle (or after `timeout` ms). Returns a cancel function. */
export function onIdle(fn: () => void, timeout = 800): () => void {
  if (typeof window === 'undefined') return () => {};
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}
