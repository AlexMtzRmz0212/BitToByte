import type { MapLayout } from '../../data/worlds';
import { seeded } from '../shared/sketch';
import { AVENUES, AVENUE_W, BUILDINGS, DEPTH, HARBOR_X, HARBOR_Y, STREETS, STREET_W, type Building } from './city';

// Noir Metropolis, drawn: wet streets and a black harbor, then towers back to
// front with their window grids, deco crowns, gothic pinnacles and the odd
// neon sign. One amber accent in a city of blues.

const f = (n: number) => Math.round(n * 10) / 10;

function faces(b: Building) {
  const dx = b.d * DEPTH.x;
  const dy = b.d * DEPTH.y;
  const { x, y, w, h } = b;
  return {
    front: `M${f(x)} ${f(y)}H${f(x + w)}V${f(y - h)}H${f(x)}Z`,
    side: `M${f(x + w)} ${f(y)}V${f(y - h)}L${f(x + w + dx)} ${f(y - h + dy)}V${f(y + dy)}Z`,
    top: `M${f(x)} ${f(y - h)}H${f(x + w)}L${f(x + w + dx)} ${f(y - h + dy)}H${f(x + dx)}Z`,
    dx,
    dy,
  };
}

function windows(b: Building) {
  const lit: string[] = [];
  const dark: string[] = [];
  const cw = (b.w - 16) / b.cols;
  const rh = (b.h - 24) / b.rows;
  const litSet = new Set(b.lit);
  for (let r = 0; r < b.rows; r++) {
    for (let c = 0; c < b.cols; c++) {
      const wx = b.x + 8 + c * cw + cw * 0.22;
      const wy = b.y - b.h + 14 + r * rh + rh * 0.2;
      const d = `M${f(wx)} ${f(wy)}h${f(cw * 0.56)}v${f(rh * 0.55)}h${f(-cw * 0.56)}Z`;
      (litSet.has(r * b.cols + c) ? lit : dark).push(d);
    }
  }
  return { lit: lit.join(''), dark: dark.join('') };
}

function Tower({ b }: { b: Building }) {
  const fc = faces(b);
  const win = windows(b);
  const rand = seeded(b.seed);
  const flicker = b.lit.length && rand() < 0.35 ? b.lit[Math.floor(rand() * b.lit.length)]! : -1;
  const cw = (b.w - 16) / b.cols;
  const rh = (b.h - 24) / b.rows;
  const top = b.y - b.h;
  return (
    <g>
      <path d={fc.side} className="nr-side" />
      <path d={fc.front} className={`nr-front nr-${b.style}`} />
      <path d={fc.top} className="nr-top" />
      <path d={win.dark} className="nr-win" />
      <path d={win.lit} className="nr-lit" />
      {flicker >= 0 && (
        <rect
          x={b.x + 8 + (flicker % b.cols) * cw + cw * 0.22}
          y={top + 14 + Math.floor(flicker / b.cols) * rh + rh * 0.2}
          width={cw * 0.56}
          height={rh * 0.55}
          className="nr-lit nr-flicker"
          style={{ animationDelay: `${-rand() * 6}s` }}
        />
      )}
      {b.style === 'deco' && (
        <path
          d={`M${f(b.x + b.w * 0.2)} ${f(top)}v-16h${f(b.w * 0.6)}v16M${f(b.x + b.w * 0.34)} ${f(top - 16)}v-14h${f(b.w * 0.32)}v14`}
          className="nr-crown"
        />
      )}
      {b.style === 'deco' && <path d={`M${f(b.x + b.w * 0.5)} ${f(b.y)}V${f(top)}`} className="nr-pilaster" />}
      {b.style === 'gothic' && (
        <path
          d={`M${f(b.x)} ${f(top)}l6 -26l6 26M${f(b.x + b.w - 12)} ${f(top)}l6 -26l6 26M${f(b.x + b.w / 2 - 10)} ${f(top)}l10 -40l10 40`}
          className="nr-crown"
        />
      )}
      {b.gargoyle && (
        <path
          d={`M${f(b.x - 4)} ${f(top + 2)}c4 -10 14 -12 18 -4c3 -6 9 -6 10 0l-4 6h-20z`}
          className="nr-gargoyle"
        />
      )}
      {b.spire && (
        <>
          <path d={`M${f(b.x + b.w / 2 + fc.dx / 2)} ${f(top + fc.dy / 2)}v-70`} className="nr-antenna" />
          <circle cx={b.x + b.w / 2 + fc.dx / 2} cy={top + fc.dy / 2 - 72} r="3.5" className="nr-aviation" />
        </>
      )}
      {b.neon && (
        <rect x={b.x + b.w * 0.18} y={b.y - 46} width={b.w * 0.64} height="18" rx="4" className="nr-neon" style={{ animationDelay: `${-rand() * 5}s` }} />
      )}
    </g>
  );
}

const LAMPS = (() => {
  const out: { x: number; y: number }[] = [];
  for (const sy of STREETS) for (let x = 120; x < 2160; x += 150) out.push({ x, y: sy - STREET_W / 2 + 4 });
  return out.filter((p) => !(p.x > HARBOR_X && p.y > HARBOR_Y));
})();

const STREAKS = (() => {
  const rand = seeded(29);
  return Array.from({ length: 70 }, () => {
    const street = STREETS[Math.floor(rand() * STREETS.length)]!;
    return { x: rand() * 2100, y: street - STREET_W / 2 + 8 + rand() * (STREET_W - 16), w: 20 + rand() * 60, amber: rand() < 0.4 };
  });
})();

export default function NoirTerrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  return (
    <>
      <defs>
        <radialGradient id="nr-lamp">
          <stop offset="0" stopColor="#FFD89A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD89A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nr-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1628" />
          <stop offset="1" stopColor="#050B16" />
        </linearGradient>
      </defs>

      <rect width={w} height={h} className="nr-ground" />

      {/* harbor */}
      <rect x={HARBOR_X} y={HARBOR_Y} width={w - HARBOR_X} height={h - HARBOR_Y} fill="url(#nr-water)" />
      {Array.from({ length: 9 }, (_, k) => (
        <path key={k} d={`M${HARBOR_X + 30 + (k % 3) * 40} ${HARBOR_Y + 30 + k * 26}h${700 - (k % 4) * 90}`} className="nr-wave" />
      ))}
      <rect x="1520" y={HARBOR_Y - 4} width="46" height="220" className="nr-pier" />
      <rect x="1930" y={HARBOR_Y - 4} width="46" height="190" className="nr-pier" />
      <path d={`M1590 ${HARBOR_Y + 2}h230l26 70h-280z`} className="nr-jetty" />

      {/* streets and avenues */}
      {STREETS.map((sy) => (
        <g key={sy}>
          <rect x="0" y={sy - STREET_W / 2} width={sy > HARBOR_Y - 60 ? w : w} height={STREET_W} className="nr-street" />
          <path d={`M0 ${sy}H${w}`} className="nr-lane" />
        </g>
      ))}
      {AVENUES.map((ax) => (
        <g key={ax}>
          <rect x={ax - AVENUE_W / 2} y="0" width={AVENUE_W} height={ax > HARBOR_X ? HARBOR_Y : h} className="nr-street" />
          <path d={`M${ax} 0V${ax > HARBOR_X ? HARBOR_Y : h}`} className="nr-lane" />
        </g>
      ))}
      {STREETS.flatMap((sy) =>
        AVENUES.map((ax) => (
          <path
            key={`${sy}-${ax}`}
            d={Array.from({ length: 6 }, (_, k) => `M${ax - AVENUE_W / 2 - 18} ${sy - STREET_W / 2 + 6 + k * 10}h14`).join('')}
            className="nr-crosswalk"
          />
        ))
      )}
      {STREAKS.map((s, k) => (
        <path key={k} d={`M${f(s.x)} ${f(s.y)}h${f(s.w)}`} className={s.amber ? 'nr-streak nr-streak-amber' : 'nr-streak'} />
      ))}
      {LAMPS.map((p, k) => (
        <g key={k}>
          <circle cx={p.x} cy={p.y} r="46" fill="url(#nr-lamp)" />
          <circle cx={p.x} cy={p.y} r="3" className="nr-lamp" />
        </g>
      ))}

      {BUILDINGS.map((b, k) => (
        <Tower key={k} b={b} />
      ))}

      {/* steam from the grates */}
      {[
        [760, 560],
        [1240, 900],
        [300, 900],
        [1720, 560],
      ].map(([x, y], k) => (
        <g key={k} className="nr-steam" style={{ animationDelay: `${-k * 1.3}s` }}>
          <circle cx={x} cy={y! - 10} r="14" />
          <circle cx={x! + 8} cy={y! - 34} r="18" />
          <circle cx={x! - 4} cy={y! - 60} r="22" />
        </g>
      ))}
    </>
  );
}

/** World-space movement over the city: headlights on the streets, a blimp overhead. */
export function NoirTraffic({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  return (
    <svg className="map-overlay" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      {STREETS.map((sy, k) => (
        <g key={sy}>
          <g className="nr-car nr-car-east" style={{ animationDelay: `${-k * 4.2}s`, animationDuration: `${14 + k * 3}s` }}>
            <circle cx="0" cy={sy + 12} r="4" className="nr-headlight" />
            <circle cx="-14" cy={sy + 12} r="4" className="nr-headlight" />
            <path d={`M4 ${sy + 12}l60 -12v24z`} className="nr-beam" />
          </g>
          <g className="nr-car nr-car-west" style={{ animationDelay: `${-k * 6.1}s`, animationDuration: `${17 + k * 2}s` }}>
            <circle cx={w} cy={sy - 12} r="3.5" className="nr-taillight" />
            <circle cx={w + 14} cy={sy - 12} r="3.5" className="nr-taillight" />
          </g>
        </g>
      ))}
      <g className="nr-blimp">
        <ellipse cx="0" cy="140" rx="120" ry="34" className="nr-blimp-body" />
        <path d="M-118 140l-34 -26v52z" className="nr-blimp-body" />
        <rect x="-26" y="168" width="52" height="14" rx="4" className="nr-blimp-body" />
        <circle cx="70" cy="132" r="4" className="nr-aviation" />
      </g>
    </svg>
  );
}
