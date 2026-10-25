import { WORLDS, type MapLayout, type Point } from '../../data/worlds';
import { blob, burst, seeded, smoothOpen } from '../shared/sketch';
import Estate from './Estate';
import { INK, OXBLOOD, GOLD, WATER, MOSS, PAPER, PAPER_DARK, battlements, corridor, hatch, tornRect, wobble } from './ink';

// Hogwarts: an inked survey of a rambling estate, drawn as a floor
// plan on folded, torn parchment. Corridors link the landmarks and gates; the
// rooms, woods, lake and notes are scenery. Everything is original linework.

const P = (x: number, y: number): Point => ({ x, y });

const CORRIDORS: Point[][] = [
  [P(330, 1250), P(480, 1180), P(640, 1110), P(780, 1000), P(870, 890)],
  [P(300, 330), P(420, 420), P(560, 520), P(700, 640), P(830, 720)],
  [P(1120, 700), P(1220, 630), P(1316, 560)],
  [P(1120, 860), P(1250, 940), P(1390, 1000), P(1470, 1040)],
  [P(1540, 400), P(1680, 370), P(1820, 360), P(1880, 360)],
];

const ROOMS = [
  { x: 470, y: 740, w: 200, h: 130, label: 'The Scriptorium', kind: 'desks' },
  { x: 590, y: 1236, w: 270, h: 70, label: 'Quill Gallery', kind: 'columns' },
  { x: 1236, y: 730, w: 130, h: 100, label: 'Ink Cellar', kind: 'barrels' },
  { x: 1690, y: 570, w: 150, h: 110, label: 'Seal Room', kind: 'seals' },
  { x: 1300, y: 1190, w: 320, h: 64, label: 'Long Gallery', kind: 'columns' },
  { x: 1690, y: 1180, w: 170, h: 110, label: 'Cartographers’ Hall', kind: 'desks' },
] as const;

function trees(x0: number, y0: number, x1: number, y1: number, count: number, seed: number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const x = x0 + rand() * (x1 - x0);
    const y = y0 + rand() * (y1 - y0);
    const r = 10 + rand() * 8;
    return { x, y, r, s: Math.floor(rand() * 1000) };
  }).sort((a, b) => a.y - b.y);
}

const WOODS = [...trees(470, 110, 780, 270, 22, 4), ...trees(1960, 520, 2140, 760, 16, 9)];

const PAPER_SPECKS = (() => {
  const rand = seeded(77);
  return Array.from({ length: 46 }, () => ({ x: rand() * 220, y: rand() * 220, r: 0.6 + rand() * 1.6, o: 0.08 + rand() * 0.18 }));
})();

export default function ManuscriptTerrain({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  const paper = tornRect(w, h, 24, 3);
  return (
    <>
      <defs>
        <pattern id="ms-specks" width="220" height="220" patternUnits="userSpaceOnUse">
          {PAPER_SPECKS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#6B4A2A" opacity={s.o} />
          ))}
        </pattern>
        <radialGradient id="ms-age" cx="50%" cy="50%" r="70%">
          <stop offset="0.55" stopColor="#8A6A3A" stopOpacity="0" />
          <stop offset="1" stopColor="#8A6A3A" stopOpacity="0.38" />
        </radialGradient>
        <radialGradient id="ms-stain">
          <stop offset="0" stopColor="#B88B4A" stopOpacity="0.22" />
          <stop offset="0.7" stopColor="#B88B4A" stopOpacity="0.1" />
          <stop offset="1" stopColor="#B88B4A" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ms-paper">
          <path d={paper} />
        </clipPath>
        <clipPath id="ms-lake">
          <path d={blob(980, 1335, 200, 88, 5, 0.12, 12)} />
        </clipPath>
      </defs>

      {/* the sheet */}
      {/* a soft shadow under the sheet: two offset copies, no blur filter (cheap to re-rasterize) */}
      <path d={paper} fill="#5B3E22" opacity="0.08" transform="translate(4 9)" />
      <path d={paper} fill="#5B3E22" opacity="0.06" transform="translate(9 18)" />
      <path d={paper} fill={PAPER} />
      <g clipPath="url(#ms-paper)">
        <rect width={w} height={h} fill="url(#ms-specks)" />
        <ellipse cx="1820" cy="300" rx="140" ry="110" fill="url(#ms-stain)" />
        <ellipse cx="420" cy="980" rx="190" ry="130" fill="url(#ms-stain)" />
        <ellipse cx="1500" cy="1400" rx="120" ry="80" fill="url(#ms-stain)" />

        {/* fold creases: the sheet was folded in six */}
        {[733, 1466].map((x) => (
          <g key={x}>
            <rect x={x - 26} y="0" width="26" height={h} fill="#6B4A2A" opacity="0.045" />
            <path d={`M${x} 0V${h}`} stroke="#5B3E22" strokeOpacity="0.22" strokeWidth="2.5" />
            <path d={`M${x + 3} 0V${h}`} stroke="#FFF8E6" strokeOpacity="0.5" strokeWidth="2" />
          </g>
        ))}
        <rect x="0" y={750 - 26} width={w} height="26" fill="#6B4A2A" opacity="0.04" />
        <path d={`M0 750H${w}`} stroke="#5B3E22" strokeOpacity="0.2" strokeWidth="2.5" />
        <path d={`M0 753H${w}`} stroke="#FFF8E6" strokeOpacity="0.45" strokeWidth="2" />

        <Lake />
        <Hills />
        <Woods />

        {/* corridors */}
        <g fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round">
          {CORRIDORS.map((pts, i) => {
            const [a, b] = corridor(pts, 34, 20 + i * 3);
            return (
              <g key={i}>
                <path d={a} />
                <path d={b} />
                <path d={smoothOpen(wobble(pts, 50 + i))} strokeWidth="1" strokeDasharray="2 10" strokeOpacity="0.45" />
              </g>
            );
          })}
        </g>

        <Estate />
        <Keep />
        <GardenWalls />
        <CurtainWall />
        <Stair />
        <BellTower />

        {ROOMS.map((room, i) => (
          <Room key={room.label} {...room} seed={i + 30} />
        ))}

        <Compass at={P(2030, 1180)} />
        <Cartouche />
        <ScaleBar />

        <text x="128" y="590" transform="rotate(-9 128 590)" className="ms-note">
          here be deadlines
        </text>
        <text x="1196" y="1452" transform="rotate(4 1196 1452)" className="ms-note">
          mind the wet ink
        </text>
        <path d="M1862 286c8-6 18-2 16 8-3 12-20 10-22 0" fill={INK} opacity="0.55" />
        <circle cx="1890" cy="300" r="3.5" fill={INK} opacity="0.5" />
        <circle cx="1848" cy="276" r="2" fill={INK} opacity="0.5" />

        <rect width={w} height={h} fill="url(#ms-age)" />
      </g>
      <path d={paper} fill="none" stroke="#7A5A32" strokeOpacity="0.45" strokeWidth="2" />
    </>
  );
}

function Lake() {
  const d = blob(980, 1335, 200, 88, 5, 0.12, 12);
  return (
    <g>
      <path d={d} fill={WATER} fillOpacity="0.16" stroke={INK} strokeWidth="2.4" />
      <g clipPath="url(#ms-lake)" stroke={WATER} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8">
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${820 + (i % 2) * 30} ${1290 + i * 14}q14 -7 28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0`} />
        ))}
      </g>
      <path d="M1180 1500C1170 1460 1140 1430 1120 1390" fill="none" stroke={WATER} strokeWidth="5" strokeOpacity="0.5" />
      <path d="M1180 1500C1170 1460 1140 1430 1120 1390" fill="none" stroke={INK} strokeWidth="1.4" />
      <text x="980" y="1345" textAnchor="middle" className="ms-label ms-label-water">
        The Black Lake
      </text>
    </g>
  );
}

function Hills() {
  const hills = [
    [1570, 230, 70],
    [1660, 210, 90],
    [1770, 236, 64],
    [1840, 214, 52],
  ] as const;
  return (
    <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round">
      {hills.map(([x, y, r], i) => (
        <g key={i}>
          <path d={`M${x - r} ${y}Q${x} ${y - r * 1.1} ${x + r} ${y}`} />
          <path d={hatch(x + r * 0.1, y - r * 0.5, r * 0.8, r * 0.5, 8, 60)} strokeWidth="1" opacity="0.55" />
        </g>
      ))}
    </g>
  );
}

function Woods() {
  return (
    <g stroke={INK} strokeWidth="1.8">
      {WOODS.map((t, i) => (
        <g key={i}>
          <path d={`M${t.x} ${t.y + t.r * 0.6}v${t.r * 0.9}`} />
          <path d={blob(t.x, t.y, t.r, t.r * 0.9, t.s, 0.18, 8)} fill={MOSS} fillOpacity="0.28" />
        </g>
      ))}
    </g>
  );
}

function Keep() {
  return (
    <g fill="none" stroke={INK} strokeLinejoin="round">
      <rect x="820" y="600" width="320" height="280" strokeWidth="3" />
      <rect x="836" y="616" width="288" height="248" strokeWidth="1.4" />
      {[850, 1110].map((x) =>
        [630, 850].map((y) => <rect key={`${x}-${y}`} x={x - 14} y={y - 14} width="28" height="28" fill={PAPER} strokeWidth="2.2" />)
      )}
      <path d="M836 820H1124" strokeDasharray="3 9" strokeWidth="1.2" opacity="0.6" />
      <text x="980" y="910" textAnchor="middle" className="ms-label" stroke="none">
        Hall of Records
      </text>
    </g>
  );
}

function GardenWalls() {
  return (
    <g fill="none" stroke={INK}>
      <circle cx="1430" cy="470" r="150" strokeWidth="3" />
      <circle cx="1430" cy="470" r="136" strokeWidth="1.3" />
      <circle cx="1430" cy="470" r="122" strokeWidth="9" stroke={MOSS} strokeOpacity="0.35" strokeDasharray="10 7" />
      <text x="1430" y="652" textAnchor="middle" className="ms-label" stroke="none">
        The Physic Garden
      </text>
    </g>
  );
}

function CurtainWall() {
  return (
    <g fill="none" stroke={INK} strokeLinejoin="round">
      <path d="M1250 1062H1900" strokeWidth="3" />
      <path d="M1250 1078H1900" strokeWidth="1.4" />
      <path d={battlements(1250, 1062, 650, 12)} strokeWidth="1.6" />
      <circle cx="1250" cy="1070" r="22" fill={PAPER} strokeWidth="2.6" />
      <circle cx="1900" cy="1070" r="22" fill={PAPER} strokeWidth="2.6" />
    </g>
  );
}

function Stair() {
  return (
    <g transform="translate(600 560) rotate(40)" fill="none" stroke={INK}>
      <rect x="-30" y="-58" width="60" height="116" strokeWidth="2.4" fill={PAPER} />
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M-30 ${-58 + i * 11.6}h60`} strokeWidth="1.3" />
      ))}
      <path d="M0 -50V48M-6 40L0 50 6 40" strokeWidth="1.4" />
      <text x="0" y="86" textAnchor="middle" className="ms-label ms-label-small" stroke="none" transform="rotate(-40)">
        Lantern Stair
      </text>
    </g>
  );
}

function BellTower() {
  return (
    <g fill="none" stroke={INK}>
      <circle cx="1290" cy="250" r="46" strokeWidth="3" fill={PAPER} />
      <circle cx="1290" cy="250" r="34" strokeWidth="1.3" />
      <path d="M1276 262q0-24 14-26q14 2 14 26zM1272 264h36" strokeWidth="1.8" />
      <circle cx="1290" cy="268" r="3" fill={INK} />
      <text x="1290" y="328" textAnchor="middle" className="ms-label ms-label-small" stroke="none">
        Bell Tower
      </text>
    </g>
  );
}

function Room({ x, y, w, h, label, kind, seed }: { x: number; y: number; w: number; h: number; label: string; kind: string; seed: number }) {
  const rand = seeded(seed);
  return (
    <g fill="none" stroke={INK}>
      <rect x={x} y={y} width={w} height={h} strokeWidth="2.6" fill={PAPER} fillOpacity="0.5" />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} strokeWidth="1" opacity="0.7" />
      {kind === 'desks' &&
        Array.from({ length: Math.floor((w - 40) / 36) * 2 }, (_, i) => {
          const cols = Math.floor((w - 40) / 36);
          return <rect key={i} x={x + 22 + (i % cols) * 36} y={y + 24 + Math.floor(i / cols) * (h - 64)} width="22" height="14" strokeWidth="1.3" />;
        })}
      {kind === 'columns' &&
        Array.from({ length: Math.floor(w / 40) }, (_, i) => (
          <circle key={i} cx={x + 24 + i * 40} cy={y + h / 2} r="5" fill={INK} stroke="none" opacity="0.7" />
        ))}
      {kind === 'barrels' &&
        Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx={x + 26 + (i % 3) * 38} cy={y + 30 + Math.floor(i / 3) * 38} r={12 + rand() * 3} strokeWidth="1.4" />
        ))}
      {kind === 'seals' &&
        Array.from({ length: 4 }, (_, i) => (
          <circle key={i} cx={x + 32 + i * 30} cy={y + h / 2} r="9" fill={OXBLOOD} fillOpacity="0.55" strokeWidth="1.2" />
        ))}
      <text x={x + w / 2} y={y + h + 34} textAnchor="middle" className="ms-label ms-label-small" stroke="none">
        {label}
      </text>
    </g>
  );
}

function Compass({ at }: { at: Point }) {
  return (
    <g transform={`translate(${at.x} ${at.y})`} stroke={INK} strokeLinejoin="round">
      <circle r="78" fill="none" strokeWidth="2" />
      <circle r="70" fill="none" strokeWidth="1" />
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2;
        const r0 = i % 4 === 0 ? 58 : 64;
        return <path key={i} d={`M${Math.cos(a) * r0} ${Math.sin(a) * r0}L${Math.cos(a) * 70} ${Math.sin(a) * 70}`} strokeWidth="1" />;
      })}
      <polygon points={burst(0, 0, 40, 9, 4, Math.PI / 4)} fill={GOLD} fillOpacity="0.8" strokeWidth="1.4" />
      <polygon points={burst(0, 0, 62, 11, 4, 0)} fill={PAPER} strokeWidth="1.8" />
      <path d="M0 -62L11 -11 0 0ZM62 0L11 11 0 0ZM0 62L-11 11 0 0ZM-62 0L-11 -11 0 0Z" fill={INK} stroke="none" />
      <circle r="6" fill={OXBLOOD} strokeWidth="1.5" />
      <text y="-90" textAnchor="middle" className="ms-label" stroke="none">
        N
      </text>
    </g>
  );
}

function Cartouche() {
  const x = 1100;
  const y = 120;
  return (
    <g>
      <path
        d={`M${x - 300} ${y - 40}Q${x - 316} ${y} ${x - 300} ${y + 40}L${x - 330} ${y + 58}Q${x - 340} ${y + 20} ${x - 330} ${y - 22}Z`}
        fill={PAPER_DARK}
        stroke={INK}
        strokeWidth="2"
      />
      <path
        d={`M${x + 300} ${y - 40}Q${x + 316} ${y} ${x + 300} ${y + 40}L${x + 330} ${y + 58}Q${x + 340} ${y + 20} ${x + 330} ${y - 22}Z`}
        fill={PAPER_DARK}
        stroke={INK}
        strokeWidth="2"
      />
      <path
        d={`M${x - 300} ${y - 48}Q${x} ${y - 70} ${x + 300} ${y - 48}V${y + 44}Q${x} ${y + 22} ${x - 300} ${y + 44}Z`}
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.6"
      />
      <text x={x} y={y + 2} textAnchor="middle" className="ms-title">
        {WORLDS.manuscript.name}
      </text>
      <text x={x} y={y + 34} textAnchor="middle" className="ms-subtitle">
        a faithful survey of works in ink
      </text>
      <path d={`M${x - 120} ${y + 70}q60 16 120 0t120 0`} fill="none" stroke={INK} strokeWidth="1.6" />
      <circle cx={x} cy={y + 76} r="4" fill={OXBLOOD} />
    </g>
  );
}

function ScaleBar() {
  const x = 90;
  const y = 1430;
  return (
    <g stroke={INK}>
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={x + i * 50} y={y} width="50" height="10" fill={i % 2 ? PAPER : INK} strokeWidth="1.2" />
      ))}
      <text x={x} y={y - 12} className="ms-label ms-label-small" stroke="none">
        Furlongs, roughly
      </text>
    </g>
  );
}
