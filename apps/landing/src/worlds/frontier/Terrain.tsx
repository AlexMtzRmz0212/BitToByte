import type { MapLayout } from '../../data/worlds';
import { blob, smoothClosed, smoothOpen } from '../shared/sketch';
import {
  CATTLE,
  CHURCH,
  DEPOT,
  DEPTH,
  LAKE,
  MESAS,
  PATCHES,
  PEAKS,
  PEAK_BASE,
  PINES,
  RIVER,
  ROADS,
  SCRUB,
  SHOPS,
  TRESTLE,
  railY,
  type Mesa,
  type Pine,
  type Shop,
  type Tuft,
} from './land';

// Blackwater, painted at golden hour: the sun sits low in the west, so every
// left face is lit and every shadow falls east. Seen from a little above, the
// way the plains look from a ridge. Everything is original linework.

const f = (n: number) => Math.round(n * 10) / 10;

export default function FrontierTerrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  return (
    <>
      <defs>
        <linearGradient id="fr-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9C089" />
          <stop offset="0.55" stopColor="#CDB078" />
          <stop offset="1" stopColor="#B99863" />
        </linearGradient>
        <linearGradient id="fr-lake" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FA6B8" />
          <stop offset="0.6" stopColor="#4F7C94" />
          <stop offset="1" stopColor="#3D6379" />
        </linearGradient>
        <linearGradient id="fr-peak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A3928A" />
          <stop offset="0.5" stopColor="#857772" />
          <stop offset="0.5" stopColor="#6A5E5C" />
          <stop offset="1" stopColor="#5A4F4E" />
        </linearGradient>
        <linearGradient id="fr-mesa" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C8693A" />
          <stop offset="1" stopColor="#A04A28" />
        </linearGradient>
        <radialGradient id="fr-sun" cx="0" cy="0.18" r="0.9">
          <stop offset="0" stopColor="#FFE2A0" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FFCF7A" stopOpacity="0.16" />
          <stop offset="1" stopColor="#FFCF7A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fr-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6D9A2" stopOpacity="0.7" />
          <stop offset="1" stopColor="#F6D9A2" stopOpacity="0" />
        </linearGradient>
        <clipPath id="fr-lake-clip">
          <path d={smoothClosed(LAKE)} />
        </clipPath>
      </defs>

      <rect width={w} height={h} fill="url(#fr-ground)" />
      {PATCHES.map((p, k) => (
        <path key={k} d={blob(p.x, p.y, p.rx, p.ry, k + 3, 0.22, 10)} className={p.dark ? 'fr-patch-dark' : 'fr-patch'} />
      ))}

      <Mountains />
      <Roads />
      <Lake />
      <River />
      <Rail />
      <Fields />
      {MESAS.map((m, k) => (
        <MesaArt key={k} m={m} />
      ))}
      {SCRUB.map((t, k) => (
        <TuftArt key={k} t={t} />
      ))}
      {PINES.map((p, k) => (
        <PineArt key={k} p={p} />
      ))}
      <Town />

      <text x="760" y="168" textAnchor="middle" className="fr-label fr-label-snow">
        The Grizzlies
      </text>
      <text x="1900" y="960" textAnchor="middle" className="fr-label">
        Great Plains
      </text>
      <text x="700" y="1196" textAnchor="middle" className="fr-label fr-label-town">
        BLACKWATER
      </text>

      {/* the low western sun over everything */}
      <rect width={w} height={h} fill="url(#fr-sun)" className="fr-sunwash" />
    </>
  );
}

/* --------------------------------------------------------------- mountains */

function peakPath(p: { x: number; w: number; h: number }, base: number) {
  const l = p.x - p.w / 2;
  const r = p.x + p.w / 2;
  const top = base - p.h;
  return `M${l} ${base}L${p.x - p.w * 0.12} ${top + p.h * 0.18}L${p.x} ${top}L${p.x + p.w * 0.1} ${top + p.h * 0.12}L${r} ${base}Z`;
}

function snowPath(p: { x: number; w: number; h: number }, base: number) {
  const top = base - p.h;
  const s = p.h * 0.28;
  return `M${p.x - p.w * 0.12} ${top + p.h * 0.18}L${p.x} ${top}L${p.x + p.w * 0.1} ${top + p.h * 0.12}L${p.x + p.w * 0.16} ${top + s}l-26 -16 -22 22 -20 -26 -24 20 -22 -14Z`;
}

function Mountains() {
  return (
    <g>
      <rect width="2200" height="300" fill="url(#fr-haze)" />
      {PEAKS.map((row, r) => (
        <g key={r} opacity={r === 0 ? 0.82 : 1}>
          {row.map((p, k) => (
            <g key={k}>
              <path d={peakPath(p, PEAK_BASE[r]!)} fill="url(#fr-peak)" className="fr-peak" />
              <path d={snowPath(p, PEAK_BASE[r]!)} className="fr-snow" />
            </g>
          ))}
        </g>
      ))}
      {/* foothills at the mountains' feet */}
      <path
        d="M0 360C160 300 320 330 480 300S820 280 980 320 1300 290 1480 310 1840 300 2000 320 2200 310 2200 310V420H0Z"
        className="fr-foothill"
      />
    </g>
  );
}

/* ------------------------------------------------------------------- water */

function Lake() {
  const d = smoothClosed(LAKE);
  return (
    <g>
      <path d={d} className="fr-shore" />
      <path d={d} fill="url(#fr-lake)" />
      <g clipPath="url(#fr-lake-clip)">
        {/* the sun's road across the water */}
        <path d="M120 760L560 900L520 960L100 820Z" className="fr-glare" />
        {Array.from({ length: 16 }, (_, k) => (
          <path
            key={k}
            d={`M${200 + ((k * 137) % 640)} ${770 + ((k * 61) % 300)}h${30 + ((k * 13) % 40)}`}
            className={k % 3 ? 'fr-ripple' : 'fr-ripple fr-ripple-gold'}
            style={{ animationDelay: `${-k * 0.7}s` }}
          />
        ))}
        {/* far shore reflected */}
        <path d="M150 800C300 770 500 760 700 772" className="fr-reflect" />
      </g>
      <path d={d} className="fr-lake-edge" />
      {/* reeds and a jetty with a rowboat */}
      {[
        [210, 1040],
        [262, 1060],
        [880, 1010],
        [912, 960],
        [180, 870],
      ].map(([x, y], k) => (
        <path key={k} d={`M${x} ${y}q-4 -22 -10 -30M${x! + 6} ${y}q0 -24 4 -34M${x! + 12} ${y}q4 -18 12 -24`} className="fr-reed" />
      ))}
      <path d="M930 1004L842 980" className="fr-jetty" />
      <path d="M842 980l-6 14M870 988l-6 14M900 996l-6 14" className="fr-jetty-post" />
      <g transform="translate(800 1006) rotate(-14)">
        <path d="M-34 0Q0 14 34 0L28 -8H-28Z" className="fr-boat" />
        <path d="M-12 -4l-18 -14M10 -4l20 -12" className="fr-oar" />
      </g>
    </g>
  );
}

function River() {
  const d = smoothOpen(RIVER);
  return (
    <g>
      <path d={d} className="fr-river-bank" />
      <path d={d} className="fr-river" />
      <path d={d} className="fr-river-shine" />
    </g>
  );
}

/* ---------------------------------------------------------- roads and rail */

function Roads() {
  return (
    <g>
      {ROADS.map((pts, k) => {
        const d = smoothOpen(pts);
        return (
          <g key={k}>
            <path d={d} className="fr-road" />
            <path d={d} className="fr-rut" />
          </g>
        );
      })}
    </g>
  );
}

function Rail() {
  const ties: string[] = [];
  for (let x = -10; x <= 2210; x += 22) {
    if (x > TRESTLE.x0 && x < TRESTLE.x1) continue;
    const y = railY(x);
    ties.push(`M${f(x - 3)} ${f(y - 7)}l6 14`);
  }
  const posts: string[] = [];
  for (let x = TRESTLE.x0 + 8; x < TRESTLE.x1; x += 32) {
    const y = railY(x);
    posts.push(`M${f(x)} ${f(y + 4)}v46M${f(x)} ${f(y + 4)}l16 46M${f(x + 16)} ${f(y + 4)}l-16 46`);
  }
  return (
    <g>
      <path d={posts.join('')} className="fr-trestle" />
      <path d={`M${TRESTLE.x0} ${f(railY(TRESTLE.x0) + 6)}L${TRESTLE.x1} ${f(railY(TRESTLE.x1) + 6)}`} className="fr-trestle-deck" />
      <path d={ties.join('')} className="fr-tie" />
      <path d={`M-10 ${f(railY(-10) - 4)}L2210 ${f(railY(2210) - 4)}M-10 ${f(railY(-10) + 4)}L2210 ${f(railY(2210) + 4)}`} className="fr-rail" />
      <Depot />
      {/* telegraph poles alongside the line */}
      {Array.from({ length: 12 }, (_, k) => {
        const x = 90 + k * 190;
        if (x > 920 && x < 1180) return null;
        const y = railY(x) - 22;
        return <path key={k} d={`M${x} ${y}v-50M${x - 10} ${y - 44}h20`} className="fr-pole" />;
      })}
      <path d={`M80 ${f(railY(90) - 66)}L2200 ${f(railY(2200) - 66)}`} className="fr-wire" />
    </g>
  );
}

function Depot() {
  const { x, w, h } = DEPOT;
  const base = railY(x + w / 2) - 16;
  return (
    <g>
      <path d={`M${x + w} ${base}V${base - h}l${DEPTH.x} ${DEPTH.y}V${base + DEPTH.y}Z`} className="fr-side" />
      <path d={`M${x - 10} ${base - h}L${x + w / 2} ${base - h - 30}L${x + w + 10} ${base - h}Z`} className="fr-roof" />
      <rect x={x} y={base - h} width={w} height={h} className="fr-front fr-paint-2" />
      <rect x={x + 16} y={base - h + 16} width="20" height="24" className="fr-window" />
      <rect x={x + w - 36} y={base - h + 16} width="20" height="24" className="fr-window" />
      <rect x={x + w / 2 - 12} y={base - 40} width="24" height="40" className="fr-door" />
      {/* water tower */}
      <g transform={`translate(${x + w + 70} ${base})`}>
        <path d="M-22 0l6 -60M22 0l-6 -60M-18 -20h36M-16 -40h32" className="fr-pole" />
        <path d="M-26 -60h52v-38q-26 -12 -52 0Z" className="fr-tank" />
        <path d="M-26 -74h52M-26 -88h52" className="fr-hoop" />
      </g>
    </g>
  );
}

/* ----------------------------------------------------------- plains, mesas */

function Fields() {
  const fence = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 46));
    let posts = '';
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      posts += `M${f(x)} ${f(y)}v-18`;
    }
    return (
      <g>
        <path d={posts} className="fr-fence-post" />
        <path d={`M${x0} ${y0 - 14}L${x1} ${y1 - 14}M${x0} ${y0 - 6}L${x1} ${y1 - 6}`} className="fr-fence-rail" />
      </g>
    );
  };
  return (
    <g>
      {fence(1360, 1000, 1780, 1000)}
      {fence(1880, 1000, 2160, 1000)}
      {fence(2160, 1000, 2160, 720)}
      {fence(1800, 720, 2160, 720)}
      {CATTLE.map((c, k) => (
        <g key={k} transform={`translate(${c.x} ${c.y}) scale(${k % 2 ? -1 : 1} 1)`} className="fr-cow">
          <ellipse cx="0" cy="0" rx="16" ry="8" />
          <path d="M12 -4l10 -2 4 6 -8 4z" />
          <path d="M-12 6v8M-6 7v8M8 7v8M12 6v8" className="fr-cow-legs" />
        </g>
      ))}
    </g>
  );
}

function MesaArt({ m }: { m: Mesa }) {
  const { x0, x1, top, base } = m;
  const lip = 14;
  const d = `M${x0} ${base}L${x0 + 30} ${top + lip}L${x0 + 46} ${top}H${x1 - 40}L${x1 - 20} ${top + lip}L${x1} ${base}Z`;
  const shade = `M${x1 - 40} ${top}L${x1 - 20} ${top + lip}L${x1} ${base}H${x1 - 70}L${x1 - 60} ${top + 40}Z`;
  return (
    <g>
      <ellipse cx={(x0 + x1) / 2 + 60} cy={base} rx={(x1 - x0) / 2 + 40} ry="16" className="fr-shadow" />
      <path d={d} fill="url(#fr-mesa)" className="fr-mesa" />
      <path d={shade} className="fr-mesa-shade" />
      <path d={`M${x0 + 46} ${top}H${x1 - 40}l-8 10H${x0 + 40}Z`} className="fr-mesa-top" />
      {[0.3, 0.5, 0.72].map((t) => (
        <path key={t} d={`M${f(x0 + 30 + t * 8)} ${f(top + (base - top) * t)}H${f(x1 - 20 - t * 8)}`} className="fr-strata" />
      ))}
    </g>
  );
}

function TuftArt({ t }: { t: Tuft }) {
  const { x, y } = t;
  if (t.kind === 'cactus') {
    return (
      <g className="fr-cactus">
        <path d={`M${x} ${y}v-34M${x} ${y - 16}h-10v-12M${x} ${y - 22}h9v-10`} />
      </g>
    );
  }
  if (t.kind === 'rock') {
    return <path d={blob(x, y - 6, 12, 8, Math.round(x), 0.25, 8)} className="fr-rock" />;
  }
  return <path d={blob(x, y - 6, 14, 8, Math.round(y), 0.35, 9)} className="fr-sage" />;
}

function PineArt({ p }: { p: Pine }) {
  const { x, y, s } = p;
  const h = 70 * s;
  const w = 26 * s;
  return (
    <g>
      <ellipse cx={f(x + w * 0.9)} cy={f(y)} rx={f(w * 1.1)} ry={f(w * 0.28)} className="fr-shadow" />
      <path d={`M${f(x)} ${f(y)}v${f(-h * 0.2)}`} className="fr-trunk" />
      <path
        d={`M${f(x)} ${f(y - h)}L${f(x + w * 0.6)} ${f(y - h * 0.55)}H${f(x + w * 0.3)}L${f(x + w)} ${f(y - h * 0.15)}H${f(x - w)}L${f(x - w * 0.3)} ${f(y - h * 0.55)}H${f(x - w * 0.6)}Z`}
        className="fr-pine"
      />
      <path
        d={`M${f(x)} ${f(y - h)}L${f(x - w * 0.6)} ${f(y - h * 0.55)}H${f(x - w * 0.3)}L${f(x - w)} ${f(y - h * 0.15)}H${f(x)}Z`}
        className="fr-pine-lit"
      />
    </g>
  );
}

/* -------------------------------------------------------------------- town */

function ShopArt({ s }: { s: Shop }) {
  const { x, base, w, h } = s;
  const front = `M${x} ${base}V${base - h + 18}H${x + 10}V${base - h}H${x + w - 10}V${base - h + 18}H${x + w}V${base}Z`;
  const side = `M${x + w} ${base}V${base - h + 30}l${DEPTH.x} ${DEPTH.y}V${base + DEPTH.y}Z`;
  const roof = `M${x + w} ${base - h + 30}l${DEPTH.x} ${DEPTH.y}l-18 -16H${x + w - 4}Z`;
  const rows = s.storeys === 2 ? [base - h + 34, base - 92] : [base - 76];
  return (
    <g>
      <ellipse cx={x + w / 2 + 50} cy={base + 2} rx={w / 2 + 30} ry="10" className="fr-shadow" />
      <path d={side} className="fr-side" />
      <path d={roof} className="fr-roof" />
      <path d={front} className={`fr-front fr-${s.tone}`} />
      {rows.map((wy) => (
        <g key={wy}>
          <rect x={x + 12} y={wy} width="16" height="22" className="fr-window" />
          <rect x={x + w - 28} y={wy} width="16" height="22" className="fr-window" />
        </g>
      ))}
      {s.storeys === 2 && <path d={`M${x - 4} ${base - 66}h${w + 8}M${x - 4} ${base - 66}v-12M${x + w + 4} ${base - 66}v-12`} className="fr-balcony" />}
      <path d={`M${x - 6} ${base - 56}h${w + 12}l-6 8H${x}Z`} className="fr-awning" />
      <path d={`M${x + 2} ${base - 48}V${base}M${x + w - 2} ${base - 48}V${base}`} className="fr-post" />
      <rect x={x + w / 2 - 10} y={base - 40} width="20" height="40" className="fr-door" />
      {s.sign && (
        <>
          <rect x={x + 8} y={base - h + 4} width={w - 16} height="18" className="fr-signboard" />
          <text x={x + w / 2} y={base - h + 17} textAnchor="middle" className="fr-sign">
            {s.sign}
          </text>
        </>
      )}
      <path d={`M${x - 8} ${base + 4}h${w + 16}`} className="fr-boardwalk" />
    </g>
  );
}

function Church() {
  const { x, base, w, h } = CHURCH;
  const mid = x + w / 2;
  return (
    <g>
      <ellipse cx={mid + 60} cy={base + 2} rx={w / 2 + 40} ry="10" className="fr-shadow" />
      <path d={`M${x + w} ${base}V${base - h}l${DEPTH.x} ${DEPTH.y}V${base + DEPTH.y}Z`} className="fr-side" />
      <path d={`M${x - 6} ${base - h}L${mid} ${base - h - 40}L${x + w + 6} ${base - h}Z`} className="fr-roof" />
      <rect x={x} y={base - h} width={w} height={h} className="fr-front fr-white" />
      {/* steeple */}
      <rect x={mid - 14} y={base - h - 70} width="28" height="40" className="fr-front fr-white" />
      <path d={`M${mid - 18} ${base - h - 70}L${mid} ${base - h - 128}L${mid + 18} ${base - h - 70}Z`} className="fr-roof" />
      <path d={`M${mid} ${base - h - 128}v-18M${mid - 7} ${base - h - 140}h14`} className="fr-cross" />
      <path d={`M${mid - 8} ${base - h - 40}v-16a8 8 0 0 1 16 0v16Z`} className="fr-door" />
      <path d={`M${x + 14} ${base - 70}v-22a6 6 0 0 1 12 0v22ZM${x + w - 26} ${base - 70}v-22a6 6 0 0 1 12 0v22Z`} className="fr-window" />
      <path d={`M${mid - 12} ${base}v-36a12 12 0 0 1 24 0v36Z`} className="fr-door" />
    </g>
  );
}

function Town() {
  const north = SHOPS.filter((s) => s.base < 1100);
  const south = SHOPS.filter((s) => s.base >= 1100);
  return (
    <g>
      <Church />
      {north.map((s, k) => (
        <ShopArt key={k} s={s} />
      ))}
      {/* hitching rails and barrels on the street */}
      <path d="M1110 1086h46M1112 1086v10M1154 1086v10M1350 1086h40M1352 1086v10M1388 1086v10" className="fr-post" />
      {[
        [1080, 1100],
        [1420, 1098],
        [1600, 1094],
      ].map(([x, y], k) => (
        <g key={k}>
          <rect x={x! - 8} y={y! - 18} width="16" height="18" rx="4" className="fr-barrel" />
          <path d={`M${x! - 8} ${y! - 12}h16M${x! - 8} ${y! - 6}h16`} className="fr-hoop" />
        </g>
      ))}
      {south.map((s, k) => (
        <ShopArt key={k} s={s} />
      ))}
    </g>
  );
}
