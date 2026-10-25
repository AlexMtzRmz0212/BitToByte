import type { FogRenderer } from '../../engine/fog';
import { seeded } from '../shared/sketch';

// Unexplored country lies under a warm haze of trail dust, grainy like an old
// photograph. Riding through settles it.

export const dustFog: FogRenderer = {
  resolution: 5,
  className: 'fr-fog',
  paint(ctx, width, height) {
    ctx.fillStyle = 'rgba(196, 160, 112, 0.9)';
    ctx.fillRect(0, 0, width, height);
    const rand = seeded(1849);
    // Drifts of thicker dust.
    for (let i = 0; i < 50; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 24 + rand() * 70;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(150, 110, 68, 0.22)');
      g.addColorStop(1, 'rgba(150, 110, 68, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // Film grain.
    for (let i = 0; i < (width * height) / 18; i++) {
      ctx.fillStyle = rand() < 0.5 ? 'rgba(90, 63, 43, 0.16)' : 'rgba(255, 236, 200, 0.18)';
      ctx.fillRect(rand() * width, rand() * height, 1, 1);
    }
  },
  reveal(ctx, x, y, r) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(x, y, r * 0.35, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.8)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
