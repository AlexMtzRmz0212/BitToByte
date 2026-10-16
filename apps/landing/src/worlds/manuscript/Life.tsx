import { useEffect, useRef } from 'react';
import type { MapLayout, Point } from '../../data/worlds';
import type { MapController } from '../../engine/controller';
import { prefersReducedMotion } from '../../engine/motion';
import { addTick } from '../../engine/scheduler';
import Particles, { type ParticleKind } from '../shared/Particles';

// Life on the parchment. Footprints appear wherever the traveler walks, and a
// couple of other residents (only ever seen as labelled footprints) keep their
// rounds through the corridors. Dust motes drift in the lamplight.

export const FOOT =
  'M0 -9c3.2 0 4.6 3 4.4 6.4C4.2 1 3 5.4 0 5.4S-4.2 1-4.4-2.6C-4.6-6 -3.2-9 0-9zM-2.7 7.2a2.6 2.3 0 1 0 5.4 0a2.6 2.3 0 1 0-5.4 0z';

const P = (x: number, y: number): Point => ({ x, y });

const WANDERERS = [
  {
    name: 'the archivist',
    speed: 0.042,
    path: [P(850, 630), P(1110, 630), P(1110, 850), P(850, 850)],
    loop: true,
  },
  {
    name: 'a night porter',
    speed: 0.05,
    path: [P(330, 360), P(420, 420), P(560, 520), P(700, 640), P(830, 720), P(700, 640), P(560, 520), P(420, 420)],
    loop: true,
  },
  {
    name: 'a lost visitor',
    speed: 0.036,
    path: [P(1540, 400), P(1680, 370), P(1820, 360), P(1680, 370)],
    loop: true,
  },
];

interface Track {
  pts: Point[];
  cum: number[];
  total: number;
}

function track(pts: Point[], loop: boolean): Track {
  const all = loop ? [...pts, pts[0]!] : pts;
  const cum = [0];
  for (let i = 1; i < all.length; i++) {
    cum.push(cum[i - 1]! + Math.hypot(all[i]!.x - all[i - 1]!.x, all[i]!.y - all[i - 1]!.y));
  }
  return { pts: all, cum, total: cum[cum.length - 1]! };
}

function pointAt(t: Track, d: number): { at: Point; heading: number } {
  const dd = ((d % t.total) + t.total) % t.total;
  let i = 1;
  while (i < t.cum.length - 1 && t.cum[i]! < dd) i++;
  const a = t.pts[i - 1]!;
  const b = t.pts[i]!;
  const seg = t.cum[i]! - t.cum[i - 1]! || 1;
  const k = (dd - t.cum[i - 1]!) / seg;
  return {
    at: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k },
    heading: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

const NS = 'http://www.w3.org/2000/svg';

function stamp(layer: SVGGElement, at: Point, heading: number, side: number, className: string, scale: number, life: number) {
  const rad = (heading * Math.PI) / 180;
  const x = at.x - Math.sin(rad) * side;
  const y = at.y + Math.cos(rad) * side;
  const print = document.createElementNS(NS, 'path');
  print.setAttribute('d', FOOT);
  print.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(heading + 90).toFixed(0)}) scale(${scale})`);
  print.setAttribute('class', className);
  layer.appendChild(print);
  if (layer.childElementCount > 160) layer.firstElementChild?.remove();
  setTimeout(() => print.remove(), life);
}

/** World-space layer: the traveler's prints and the residents' rounds. */
export function ManuscriptLife({ controller, layout }: { controller: MapController; layout: MapLayout }) {
  const prints = useRef<SVGGElement>(null);
  const residents = useRef<SVGGElement>(null);

  // The traveler's footprints.
  useEffect(() => {
    const layer = prints.current;
    if (!layer) return;
    let last: Point | null = null;
    let left = true;
    return controller.onStep(({ at, heading }) => {
      if (last && Math.hypot(at.x - last.x, at.y - last.y) < 30) return;
      last = at;
      stamp(layer, at, heading, left ? -8 : 8, 'ms-print', 1.5, 9000);
      left = !left;
    });
  }, [controller]);

  // The residents.
  useEffect(() => {
    const layer = prints.current;
    const labels = residents.current;
    if (!layer || !labels || prefersReducedMotion()) return;
    const walkers = WANDERERS.map((w, i) => {
      const t = track(w.path, w.loop);
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'ms-resident');
      const text = document.createElementNS(NS, 'text');
      text.textContent = w.name;
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('y', '-20');
      g.appendChild(text);
      labels.appendChild(g);
      return { ...w, t, g, d: (t.total * i) / 3, since: 0, left: true };
    });
    const stop = addTick((_now, dt) => {
      for (const w of walkers) {
        w.d += w.speed * dt;
        w.since += w.speed * dt;
        const { at, heading } = pointAt(w.t, w.d);
        w.g.setAttribute('transform', `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`);
        if (w.since >= 24) {
          w.since = 0;
          stamp(layer, at, heading, w.left ? -6 : 6, 'ms-print ms-print-npc', 1.15, 6500);
          w.left = !w.left;
        }
      }
    });
    return () => {
      stop();
      walkers.forEach((w) => w.g.remove());
    };
  }, []);

  return (
    <svg className="map-overlay" width={layout.size.w} height={layout.size.h} viewBox={`0 0 ${layout.size.w} ${layout.size.h}`} aria-hidden="true" focusable="false">
      <g ref={prints} />
      <g ref={residents} />
    </svg>
  );
}

const dust: ParticleKind = {
  density: 3,
  max: 70,
  spawn: (rand, w, h) => ({
    x: rand() * w,
    y: rand() * h,
    vx: (rand() - 0.5) * 0.008,
    vy: -0.004 - rand() * 0.01,
    size: 0.6 + rand() * 1.6,
    phase: rand() * Math.PI * 2,
    life: 0,
  }),
  step: (p, dt, _w, h) => {
    p.x += p.vx * dt + Math.sin((p.life += dt) * 0.0009 + p.phase) * 0.05;
    p.y += p.vy * dt;
    return p.y > -10 && p.y < h + 10;
  },
  draw: (ctx, p, now) => {
    ctx.globalAlpha = 0.18 + 0.18 * Math.sin(now * 0.0015 + p.phase);
    ctx.fillStyle = '#B8892E';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  },
};

/** Screen-space dust in the lamplight. */
export function ManuscriptDust() {
  return <Particles kind={dust} />;
}
