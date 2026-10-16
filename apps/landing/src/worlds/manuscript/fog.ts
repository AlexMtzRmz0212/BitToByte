import type { FogRenderer } from '../../engine/fog';
import { seeded } from '../shared/sketch';
import { PAPER } from './ink';

// Unexplored ground is blank parchment: the ink simply hasn't been drawn there
// yet. Revealing erases the blank sheet with a soft, slightly ragged edge, so the
// map seems to ink itself in as you walk.

export const inkFog: FogRenderer = {
  resolution: 4,
  className: 'ms-fog',
  paint(ctx, width, height) {
    ctx.globalCompositeOperation = 'source-over';
    // Not quite opaque: the map shows through faintly, like ink still soaking in.
    ctx.globalAlpha = 0.84;
    ctx.fillStyle = PAPER;
    // Only over the sheet itself (it sits 24 world units in from the map edge).
    const m = 30 / this.resolution;
    ctx.fillRect(m, m, width - 2 * m, height - 2 * m);
    ctx.globalAlpha = 1;
    // A little grain so the blank sheet matches the paper beneath it.
    const rand = seeded(91);
    ctx.fillStyle = '#6B4A2A';
    for (let i = 0; i < (width * height) / 90; i++) {
      ctx.globalAlpha = 0.05 + rand() * 0.08;
      ctx.fillRect(m + rand() * (width - 2 * m), m + rand() * (height - 2 * m), 0.6 + rand(), 0.6 + rand());
    }
    // Faint ruled guide lines, as if the surveyor had only just begun.
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#5B3E22';
    ctx.lineWidth = 0.5;
    for (let y = 40; y < height - m; y += 40) {
      ctx.beginPath();
      ctx.moveTo(m, y);
      ctx.lineTo(width - m, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  },
  reveal(ctx, x, y, r) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const rand = seeded(Math.round(x * 31 + y * 17));
    // A few overlapping soft blots read as ink bleeding outward, not a perfect circle.
    for (let i = 0; i < 4; i++) {
      const ox = (rand() - 0.5) * r * 0.35;
      const oy = (rand() - 0.5) * r * 0.35;
      const rr = r * (0.7 + rand() * 0.35);
      const g = ctx.createRadialGradient(x + ox, y + oy, rr * 0.35, x + ox, y + oy, rr);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.7, 'rgba(0,0,0,0.85)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, rr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
};
