import type { FogRenderer } from '../../engine/fog';

// Unexplored ground is an unprinted plate: newsprint under a heavy halftone
// screen. Revealing prints the page.

export const halftoneFog: FogRenderer = {
  resolution: 4,
  className: 'pp-fog',
  paint(ctx, width, height) {
    ctx.fillStyle = 'rgba(242, 239, 230, 0.92)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(27, 79, 216, 0.45)';
    const step = 6;
    for (let y = 0; y < height + step; y += step) {
      for (let x = (y / step) % 2 ? step / 2 : 0; x < width + step; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  reveal(ctx, x, y, r) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const g = ctx.createRadialGradient(x, y, r * 0.55, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
