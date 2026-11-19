import type { FogRenderer } from '../../engine/fog';
import { seeded } from '../shared/sketch';

// Unexplored parts of Vice City are sun-bleached map tiles that haven't loaded
// yet: a warm peach grid, a little uneven, that fills in as you drive.

export const viceFog: FogRenderer = {
  resolution: 5,
  className: 'vc-fog',
  paint(ctx, width, height) {
    ctx.fillStyle = 'rgba(255, 207, 178, 0.95)';
    ctx.fillRect(0, 0, width, height);
    const rand = seeded(1984);
    const tile = 20; // 100 world units at resolution 5
    for (let y = 0; y < height; y += tile) {
      for (let x = 0; x < width; x += tile) {
        ctx.fillStyle = `rgba(255, 240, 226, ${(0.12 + rand() * 0.28).toFixed(3)})`;
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
      }
    }
    ctx.strokeStyle = 'rgba(204, 20, 101, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += tile) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }
    for (let y = 0; y <= height; y += tile) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();
  },
  reveal(ctx, x, y, r) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
