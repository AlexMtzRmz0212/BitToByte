import type { WorldId } from '../../data/worlds';

// Live miniatures inside the Nexus portal rings. Each ring scopes its world's
// tokens onto itself (see PortalRing), so these draw with that world's palette
// through the usual theme classes. Motion is one small loop each, transform and
// opacity only, and stops under reduced motion (nexus.css).

export default function Miniature({ id }: { id: WorldId }) {
  switch (id) {
    case 'manuscript':
      return <ManuscriptMini />;
    case 'voxel':
      return <VoxelMini />;
    case 'noir':
      return <NoirMini />;
    case 'pop':
      return <PopMini />;
  }
}

const svgProps = {
  viewBox: '0 0 200 200',
  className: 'mini h-full w-full',
  'aria-hidden': true,
  focusable: false,
} as const;

/* ------------------------------------------------------------- Manuscript */

type Pt = [number, number];
const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];

const HILLS: [Pt, Pt, Pt][] = [
  [[6, 150], [38, 104], [72, 150]],
  [[52, 152], [96, 88], [140, 152]],
  [[118, 154], [152, 112], [194, 154]],
];

// Short ink strokes down the shaded (right) flank of each hill.
const HATCH = HILLS.flatMap(([a, c, b]) =>
  Array.from({ length: 7 }, (_, i) => {
    const [x, y] = quad(a, c, b, 0.56 + i * 0.055);
    return `M${x.toFixed(1)} ${(y + 2).toFixed(1)}l-4 ${(9 - i * 0.6).toFixed(1)}`;
  })
).join('');

function ManuscriptMini() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="mm-age" cx="50%" cy="46%" r="72%">
          <stop offset="58%" className="[stop-color:var(--w-ink)]" stopOpacity="0" />
          <stop offset="100%" className="[stop-color:var(--w-ink)]" stopOpacity="0.32" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" className="fill-bg" />
      <rect width="200" height="200" fill="url(#mm-age)" />

      {/* compass rose */}
      <g transform="translate(46 54)" className="stroke-ink" strokeWidth="0.9" strokeLinejoin="round">
        <circle r="17" fill="none" />
        <path d="M12-12L4 0 0-4ZM12 12L0 4 4 0ZM-12 12L-4 0 0 4ZM-12-12L0-4-4 0Z" className="fill-deco-1" />
        <path d="M0-24L-4-4 0 0ZM24 0L4-4 0 0ZM0 24L4 4 0 0ZM-24 0L-4 4 0 0Z" className="fill-surface" />
        <path d="M0-24L4-4 0 0ZM24 0L4 4 0 0ZM0 24L-4 4 0 0ZM-24 0L-4-4 0 0Z" className="fill-ink" />
      </g>

      {/* ink birds */}
      <g className="mini-drift stroke-ink" fill="none" strokeWidth="1.3" strokeLinecap="round">
        <path d="M96 40q4-4 8 0q4-4 8 0" />
        <path d="M120 56q3-3 6 0q3-3 6 0" />
      </g>

      {/* hills */}
      <g fill="none" className="stroke-ink" strokeWidth="1.6" strokeLinecap="round">
        {HILLS.map(([a, c, b]) => (
          <path key={a[0]} d={`M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`} />
        ))}
        <path d={HATCH} strokeWidth="0.9" opacity="0.8" />
      </g>

      {/* tower with a gold pennant */}
      <g className="stroke-ink" strokeWidth="1.4">
        <rect x="134" y="96" width="14" height="38" className="fill-surface" />
        <path d="M131 97l10-22 10 22z" className="fill-accent" />
        <path d="M141 75v-14" fill="none" />
        <path d="M141 61l11 4-11 4z" className="mini-flag fill-deco-1" />
        <path d="M139 112h4v8h-4z" className="fill-ink" />
        <rect x="112" y="118" width="12" height="16" className="fill-surface" />
        <path d="M110 119l8-8 8 8z" className="fill-surface" />
      </g>

      {/* dashed route to the tower */}
      <path
        d="M26 196C44 170 82 160 108 146S132 128 138 134"
        fill="none"
        className="stroke-route"
        strokeWidth="2.2"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />

      {/* river */}
      <path d="M0 176C38 160 62 192 102 176S162 158 200 170" fill="none" className="stroke-deco-2" strokeWidth="4" />
      <path d="M0 171C38 155 62 187 102 171S162 153 200 165" fill="none" className="stroke-ink" strokeWidth="0.7" opacity="0.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Voxel */

const W = 13.856; // edge 16 * cos(30deg)
const H = 8; // edge 16 * sin(30deg)
const S = 16;

type Block = { i: number; j: number; k: number; kind: 'grass' | 'sand' | 'water' };

const BLOCKS: Block[] = (() => {
  const heights = [
    [1, 2, 2, 1, 0],
    [1, 2, 3, 2, 0],
    [1, 1, 2, 1, 0],
    [0, 1, 1, 0, 0],
  ];
  const out: Block[] = [];
  heights.forEach((row, i) =>
    row.forEach((h, j) => {
      const kind = h === 0 ? 'water' : h === 1 && (i === 3 || j === 3) ? 'sand' : 'grass';
      for (let k = 0; k <= Math.max(0, h - 1); k++) out.push({ i, j, k, kind });
    })
  );
  // Painter's order: back to front, bottom to top.
  return out.sort((a, b) => a.i + a.j - (b.i + b.j) || a.k - b.k);
})();

const cubeFaces = (cx: number, cy: number) => ({
  top: `M${cx} ${cy - H}L${cx + W} ${cy}L${cx} ${cy + H}L${cx - W} ${cy}Z`,
  left: `M${cx - W} ${cy}L${cx} ${cy + H}L${cx} ${cy + H + S}L${cx - W} ${cy + S}Z`,
  right: `M${cx + W} ${cy}L${cx} ${cy + H}L${cx} ${cy + H + S}L${cx + W} ${cy + S}Z`,
});

function VoxelMini() {
  return (
    <svg {...svgProps}>
      <rect width="200" height="200" className="fill-bg" />
      <rect width="200" height="200" className="mini-dusk" fill="#F2A65A" />
      <rect width="200" height="200" className="mini-night" fill="#14213D" />
      <rect x="34" y="34" width="20" height="20" className="fill-deco-2" />

      {/* cuboid cloud */}
      <g className="mini-drift-slow fill-surface" opacity="0.92">
        <rect x="108" y="40" width="44" height="10" />
        <rect x="118" y="32" width="22" height="8" />
      </g>

      <g transform="translate(96 92)" className="vx-edge">
        {BLOCKS.map(({ i, j, k, kind }) => {
          const f = cubeFaces((i - j) * W, (i + j) * H - k * S);
          return (
            <g key={`${i}-${j}-${k}`} className={`vx-${kind}`}>
              <path d={f.left} className="vx-left" />
              <path d={f.right} className="vx-right" />
              <path d={f.top} className="vx-top" />
            </g>
          );
        })}
      </g>

      {/* floating cube drone */}
      <g className="mini-bob">
        <g transform="translate(150 70)">
          <path d="M0-7L7-3 0 1-7-3Z" className="fill-accent-ink" />
          <path d="M-7-3L0 1V9L-7 5Z" className="fill-accent" />
          <path d="M7-3L0 1V9L7 5Z" className="fill-accent" opacity="0.8" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------- Noir */

const FAR = 'M0 150V112h14V96h12v18h10V84h16v30h8V104h14v-20h10v30h12V92h18v24h10V100h14v20h12V96h16v54Z';
const NEAR = 'M0 200V138h22V118h18v26h12V126h20v-22h16v30h14V120h18v24h10V112h22v34h12V130h20v70Z';
const WINDOWS: Pt[] = [
  [26, 124], [32, 132], [62, 132], [78, 112], [84, 120], [80, 134], [118, 128],
  [124, 140], [148, 120], [154, 128], [148, 136], [176, 138], [182, 146],
];

function NoirMini() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="nm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="[stop-color:var(--w-bg)]" />
          <stop offset="1" className="[stop-color:var(--w-raised)]" />
        </linearGradient>
        <linearGradient id="nm-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" className="[stop-color:var(--w-deco-3)]" stopOpacity="0.4" />
          <stop offset="1" className="[stop-color:var(--w-deco-3)]" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#nm-sky)" />
      <g className="mini-sweep">
        <path d="M70 160L46 0h22z" fill="url(#nm-beam)" />
      </g>
      <path d={FAR} className="fill-surface" />
      <path d={NEAR} className="fill-[color-mix(in_oklab,var(--w-bg)_70%,black)]" />
      <g className="fill-deco-1">
        {WINDOWS.map(([x, y], n) => (
          <rect key={n} x={x} y={y} width="3" height="4" className={n % 4 === 1 ? 'mini-flicker' : undefined} style={{ animationDelay: `${n * -0.7}s` }} />
        ))}
      </g>
      <rect x="92" y="118" width="20" height="7" fill="none" className="mini-neon stroke-accent" strokeWidth="1.6" />
      {/* wet street and headlights */}
      <rect y="186" width="200" height="14" className="fill-[color-mix(in_oklab,var(--w-bg)_80%,black)]" />
      <g className="mini-drive fill-accent">
        <circle cx="0" cy="192" r="1.6" />
        <circle cx="7" cy="192" r="1.6" />
      </g>
      <g className="mini-rain stroke-deco-3" strokeWidth="0.8" opacity="0.4">
        {Array.from({ length: 18 }, (_, n) => (
          <path key={n} d={`M${(n * 37) % 200} ${(n * 53) % 200}l-3 10M${(n * 37) % 200} ${((n * 53) % 200) - 200}l-3 10`} />
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------- Pop */

const BURST = Array.from({ length: 20 }, (_, n) => {
  const r = n % 2 ? 13 : 26;
  const a = (n / 20) * Math.PI * 2;
  return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
}).join(' ');

function PopMini() {
  return (
    <svg {...svgProps}>
      <defs>
        <pattern id="pm-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.7" className="fill-deco-1" />
        </pattern>
      </defs>
      <rect width="200" height="200" className="fill-bg" />
      <rect width="200" height="200" fill="url(#pm-dots)" opacity="0.4" />

      <g className="stroke-ink" strokeWidth="4" strokeLinejoin="round">
        <rect x="18" y="26" width="88" height="74" transform="rotate(-3 62 63)" className="fill-deco-2" />
        <rect x="112" y="32" width="72" height="62" transform="rotate(2 148 63)" className="fill-deco-1" />
        <rect x="24" y="110" width="150" height="66" transform="rotate(1 99 143)" className="fill-surface" />
      </g>

      {/* speed lines */}
      <g className="stroke-ink" strokeWidth="2" strokeLinecap="round">
        <path d="M30 50h30M26 62h40M32 74h24" />
      </g>

      {/* flat buildings in the bottom panel */}
      <g className="fill-ink">
        <rect x="40" y="140" width="16" height="30" />
        <rect x="60" y="128" width="20" height="42" />
        <rect x="84" y="146" width="14" height="24" />
      </g>

      <g transform="translate(146 140)">
        <polygon points={BURST} className="mini-pop fill-accent stroke-ink" strokeWidth="2.5" />
      </g>

      {/* word balloon */}
      <g transform="translate(148 62)" className="stroke-ink" strokeWidth="2.5">
        <path d="M-22 0a22 15 0 1 1 18 14l-8 8 2-10a22 15 0 0 1-12-12z" className="fill-surface" />
        <g className="fill-ink" stroke="none">
          <circle cx="-8" cy="0" r="2.4" />
          <circle cx="0" cy="0" r="2.4" />
          <circle cx="8" cy="0" r="2.4" />
        </g>
      </g>

      {/* paper plane */}
      <g className="mini-fly">
        <path d="M60 98l26-10-10 22-4-8z" className="fill-surface stroke-ink" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
