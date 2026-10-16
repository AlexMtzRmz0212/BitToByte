import type { FogRenderer } from '../../engine/fog';
import { seeded } from '../shared/sketch';

/** Unexplored ground is a bank of square cloud chunks that dissolve block by block. */
export const chunkFog: FogRenderer = {
  resolution: 50,
  className: 'vx-fog',
  paint(ctx, width, height) {
    const rand = seeded(7);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const shade = 232 + Math.floor(rand() * 18);
        ctx.fillStyle = `rgba(${shade}, ${shade + 3}, ${Math.min(255, shade + 8)}, 0.9)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  },
  reveal(ctx, x, y, r) {
    const x0 = Math.floor(x - r - 1);
    const x1 = Math.ceil(x + r + 1);
    const y0 = Math.floor(y - r - 1);
    const y1 = Math.ceil(y + r + 1);
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const d = Math.hypot(cx + 0.5 - x, cy + 0.5 - y);
        if (d <= r) ctx.clearRect(cx, cy, 1, 1);
        // A ragged block edge: every third chunk on the rim goes too.
        else if (d <= r + 1 && (cx * 7 + cy * 13) % 3 === 0) ctx.clearRect(cx, cy, 1, 1);
      }
    }
  },
};
