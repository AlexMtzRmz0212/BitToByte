import type { FogRenderer } from '../../engine/fog';
import { seeded } from '../shared/sketch';

// Unexplored streets lie under a low, slow mist. It thins softly where you go.

export const mistFog: FogRenderer = {
  resolution: 5,
  className: 'nr-fog',
  paint(ctx, width, height) {
    ctx.fillStyle = 'rgba(18, 27, 46, 0.86)';
    ctx.fillRect(0, 0, width, height);
    const rand = seeded(41);
    // Banks of thicker mist.
    for (let i = 0; i < 60; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 20 + rand() * 60;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(60, 76, 108, 0.22)');
      g.addColorStop(1, 'rgba(60, 76, 108, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  },
  reveal(ctx, x, y, r) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.75, 'rgba(0,0,0,0.75)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
