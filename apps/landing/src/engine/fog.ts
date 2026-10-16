// Fog of war, as data. A coarse grid over the map remembers which cells have
// been seen; each world decides how unexplored cells look (blank parchment,
// blocks, mist, halftone). It is only ever visual: everything under the fog
// stays clickable, labelled and in the travel list.

export class FogField {
  readonly cols: number;
  readonly rows: number;
  readonly cell: number;
  private bits: Uint8Array;

  constructor(width: number, height: number, cell: number) {
    this.cell = cell;
    this.cols = Math.ceil(width / cell);
    this.rows = Math.ceil(height / cell);
    this.bits = new Uint8Array(Math.ceil((this.cols * this.rows) / 8));
  }

  private index(c: number, r: number) {
    return r * this.cols + c;
  }

  isClear(c: number, r: number): boolean {
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return true;
    const i = this.index(c, r);
    return (this.bits[i >> 3]! & (1 << (i & 7))) !== 0;
  }

  /** Is the world point (x, y) in explored territory? */
  isClearAt(x: number, y: number): boolean {
    return this.isClear(Math.floor(x / this.cell), Math.floor(y / this.cell));
  }

  /** Mark every cell whose centre is within `r` of (x, y). Returns how many were new. */
  clearCircle(x: number, y: number, r: number): number {
    const { cell } = this;
    let added = 0;
    const c0 = Math.max(0, Math.floor((x - r) / cell));
    const c1 = Math.min(this.cols - 1, Math.floor((x + r) / cell));
    const r0 = Math.max(0, Math.floor((y - r) / cell));
    const r1 = Math.min(this.rows - 1, Math.floor((y + r) / cell));
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        const cx = (col + 0.5) * cell;
        const cy = (row + 0.5) * cell;
        if ((cx - x) ** 2 + (cy - y) ** 2 > r * r) continue;
        const i = this.index(col, row);
        const mask = 1 << (i & 7);
        if (!(this.bits[i >> 3]! & mask)) {
          this.bits[i >> 3]! |= mask;
          added++;
        }
      }
    }
    return added;
  }

  /** Every explored cell, as world-space centres. */
  *clearedCentres(): Generator<{ x: number; y: number }> {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.isClear(col, row)) yield { x: (col + 0.5) * this.cell, y: (row + 0.5) * this.cell };
      }
    }
  }

  get clearedCount(): number {
    let n = 0;
    for (const byte of this.bits) {
      let b = byte;
      while (b) {
        n += b & 1;
        b >>= 1;
      }
    }
    return n;
  }

  /** Compact text form for storage. */
  encode(): string {
    let binary = '';
    for (const byte of this.bits) binary += String.fromCharCode(byte);
    return `${this.cols}x${this.rows}:${btoa(binary)}`;
  }

  /** Restore from encode(); ignores data from a different grid size. */
  decode(text: string | undefined): void {
    if (!text) return;
    const [dims, data] = text.split(':');
    if (dims !== `${this.cols}x${this.rows}` || !data) return;
    try {
      const binary = atob(data);
      for (let i = 0; i < Math.min(binary.length, this.bits.length); i++) this.bits[i] = binary.charCodeAt(i);
    } catch {
      /* corrupt: start fresh */
    }
  }
}

/** How a world draws its fog on the canvas layer. */
export interface FogRenderer {
  /** World units per canvas pixel (coarser is cheaper; the canvas is CSS-scaled up). */
  resolution: number;
  /** Extra class on the canvas, e.g. for pixelated scaling or a drifting animation. */
  className?: string;
  /** Paint the whole map as unexplored. Canvas units = world units / resolution. */
  paint(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  /** Reveal a disc. Coordinates and radius are in canvas units. */
  reveal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void;
}
