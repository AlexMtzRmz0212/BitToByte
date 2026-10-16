import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../engine/motion';
import { addTick } from '../../engine/scheduler';
import { seeded } from './sketch';

// A small screen-space particle layer for ambient life (dust, fireflies, rain,
// snowing ash...). One canvas, capped pixel ratio, scaled count, paused with
// the tab (the shared scheduler does that) and absent under reduced motion.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  life: number;
}

export interface ParticleKind {
  /** Particles per 100k square px of screen. */
  density: number;
  max: number;
  spawn: (rand: () => number, w: number, h: number) => Particle;
  /** Advance one particle; return false to respawn it. */
  step: (p: Particle, dt: number, w: number, h: number, now: number) => boolean;
  draw: (ctx: CanvasRenderingContext2D, p: Particle, now: number) => void;
  /** Composite mode for the whole layer. */
  blend?: GlobalCompositeOperation;
}

export default function Particles({ kind, className = '' }: { kind: ParticleKind; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || prefersReducedMotion()) return;
    const rand = seeded(Math.floor(Math.random() * 1e6) + 1);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(kind.max, Math.round(((w * h) / 100000) * kind.density));
      particles = Array.from({ length: count }, () => kind.spawn(rand, w, h));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stop = addTick((now, dt) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = kind.blend ?? 'source-over';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        if (!kind.step(p, dt, w, h, now)) particles[i] = kind.spawn(rand, w, h);
        else kind.draw(ctx, p, now);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    });

    return () => {
      stop();
      ro.disconnect();
    };
  }, [kind]);

  return <canvas ref={ref} className={`map-particles ${className}`} aria-hidden="true" />;
}
