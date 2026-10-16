import { useEffect, useRef } from 'react';
import { addTick, onIdle } from '../../engine/scheduler';
import { prefersReducedMotion } from '../../engine/motion';

// The Nexus sky: a few hundred stars in three depth layers that twinkle and
// drift upward very slowly. Starts once the page is idle, pauses with the tab,
// and draws a single still frame under reduced motion. Without JS, a CSS dot
// field (.starfield-fallback) stands in.

interface Star {
  x: number;
  y: number;
  r: number;
  depth: number;
  phase: number;
}

// Deterministic, so the sky doesn't reshuffle on resize.
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let stopLoop = () => {};

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rand = seeded(42);
      const count = Math.min(420, Math.round((width * height) / 5200));
      stars = Array.from({ length: count }, () => {
        const depth = rand();
        return {
          x: rand() * width,
          y: rand() * height,
          r: 0.35 + depth * depth * 1.25,
          depth,
          phase: rand() * Math.PI * 2,
        };
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(now * 0.0011 * (0.4 + star.depth) + star.phase);
        const y = (((star.y - now * 0.004 * (0.2 + star.depth)) % height) + height) % height;
        ctx.globalAlpha = (0.25 + star.depth * 0.6) * twinkle;
        ctx.fillStyle = star.depth > 0.82 ? '#cfe0ff' : '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      layout();
      canvas.dataset.ready = 'true';
      if (prefersReducedMotion()) draw(0);
      else stopLoop = addTick((now) => draw(now));
    };

    const cancelIdle = onIdle(start);
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        layout();
        if (prefersReducedMotion()) draw(0);
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelIdle();
      stopLoop();
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="starfield-fallback pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <canvas ref={ref} className="starfield h-full w-full" />
    </div>
  );
}
