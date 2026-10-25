import type { JSX } from 'react';
import { H, S, W, faceQuad, facePoint, isoBox, poly } from '../shared/iso';
import type { LandmarkProps } from '../types';

// Landmarks of Overworld: block buildings on level ground. Every
// shape is an isometric box or a patch on a box face, so they sit in the same
// light as the terrain (top bright, left mid, right dark).

type Box = ReturnType<typeof isoBox>;

function Block({ box, cls }: { box: Box; cls: string }) {
  return (
    <>
      <path d={box.left} className={`${cls}-left`} />
      <path d={box.right} className={`${cls}-right`} />
      <path d={box.top} className={`${cls}-top`} />
    </>
  );
}

/** A four-sided roof on top of a box (the two faces we can see). */
function Roof({ x, y, ni, nj, rise, cls }: { x: number; y: number; ni: number; nj: number; rise: number; cls: string }) {
  const ix = (W * ni) / 2;
  const iy = (H * ni) / 2;
  const jx = (W * nj) / 2;
  const jy = (H * nj) / 2;
  const front: [number, number] = [x + ix - jx, y + iy + jy];
  const right: [number, number] = [x + ix + jx, y + iy - jy];
  const left: [number, number] = [x - ix - jx, y - iy + jy];
  const apex: [number, number] = [x, y - rise];
  return (
    <>
      <path d={poly([left, front, apex])} className={`${cls}-left`} />
      <path d={poly([front, right, apex])} className={`${cls}-right`} />
    </>
  );
}

/** A disc lying on a vertical face, as an isometric ellipse (clock faces, dials). */
function faceDisc(x: number, y: number, ni: number, nj: number, nh: number, side: 'left' | 'right', cu: number, cv: number, ru: number) {
  const rv = (ru * (side === 'left' ? ni : nj) * W) / (S * nh);
  const pts = Array.from({ length: 20 }, (_, k) => {
    const a = (k / 20) * Math.PI * 2;
    return facePoint(x, y, ni, nj, nh, side, cu + Math.cos(a) * ru, cv + Math.sin(a) * rv);
  });
  return poly(pts);
}

export default function VoxelLandmark({ project, at }: LandmarkProps) {
  const Art = ART[project.district] ?? House;
  return (
    <g className="vx-landmark">
      <Art x={at.x} y={at.y} />
      <rect x={at.x - 120} y={at.y - 300} width="240" height="330" fill="transparent" />
    </g>
  );
}

type Art = (p: { x: number; y: number }) => JSX.Element;

/* ------------------------------------- AI Task Sorter: clock tower + board */

const ClockTower: Art = ({ x, y }) => {
  const base = isoBox(x, y, 1.7, 1.7, 1);
  const shaft = isoBox(x, y - S, 1.4, 1.4, 4.2);
  const crown = isoBox(x, y - S * 5.2, 1.7, 1.7, 0.5);
  const top = y - S * 5.7;
  const clockL = faceDisc(x, y - S, 1.4, 1.4, 4.2, 'left', 0.5, 0.74, 0.36);
  const centreL = facePoint(x, y - S, 1.4, 1.4, 4.2, 'left', 0.5, 0.74);
  const board = { x: x + W * 1.9, y: y + H * 0.2 };
  return (
    <g>
      <Block box={base} cls="vx-cobble" />
      <Block box={shaft} cls="vx-brick" />
      {[0.14, 0.38].map((v) => (
        <path key={v} d={faceQuad(x, y - S, 1.4, 1.4, 4.2, 'left', 0.4, 0.6, v, v + 0.1)} className="vx-window" />
      ))}
      {[0.14, 0.38, 0.62].map((v) => (
        <path key={`r${v}`} d={faceQuad(x, y - S, 1.4, 1.4, 4.2, 'right', 0.4, 0.6, v, v + 0.1)} className="vx-window" />
      ))}
      <path d={clockL} className="vx-clock" />
      <g className="vx-hands" style={{ transformOrigin: `${centreL[0]}px ${centreL[1]}px` }}>
        <path d={`M${centreL[0]} ${centreL[1]}l0 -14M${centreL[0]} ${centreL[1]}l9 4`} className="vx-hand" />
      </g>
      <Block box={crown} cls="vx-cobble" />
      <Roof x={x} y={top} ni={1.7} nj={1.7} rise={S * 2.2} cls="vx-roof" />
      {/* the notice board, four notes already sorted into a 2x2 grid */}
      <Block box={isoBox(board.x - W * 0.55, board.y - H * 0.25, 0.15, 0.15, 1.6)} cls="vx-plank" />
      <Block box={isoBox(board.x + W * 0.55, board.y - H * 0.85, 0.15, 0.15, 1.6)} cls="vx-plank" />
      <Block box={isoBox(board.x, board.y - S * 0.9, 0.18, 1.7, 1.1)} cls="vx-plank" />
      {[
        [0.12, 0.45, 0.55, 0.88, 'vx-note-a'],
        [0.55, 0.88, 0.55, 0.88, 'vx-note-b'],
        [0.12, 0.45, 0.12, 0.45, 'vx-note-c'],
        [0.55, 0.88, 0.12, 0.45, 'vx-note-d'],
      ].map(([u0, u1, v0, v1, cls]) => (
        <path key={cls as string} d={faceQuad(board.x, board.y - S * 0.9, 0.18, 1.7, 1.1, 'right', u0 as number, u1 as number, v0 as number, v1 as number)} className={cls as string} />
      ))}
    </g>
  );
};

/* ------------------------------------ ProjectsTracker: the command tower */

const HEAT = [3, 1, 0, 2, 3, 2, 1, 3, 2, 0, 1, 3, 3, 2, 2, 1, 0, 3, 2, 3, 1, 2, 3, 3];

const CommandTower: Art = ({ x, y }) => {
  const base = isoBox(x, y, 2, 2, 0.8);
  const body = isoBox(x, y - S * 0.8, 1.5, 1.5, 5);
  const deck = isoBox(x, y - S * 5.8, 2.1, 2.1, 0.4);
  const top = y - S * 6.2;
  const cols = 4;
  return (
    <g>
      <Block box={base} cls="vx-cobble" />
      <Block box={body} cls="vx-quartz" />
      {/* a year of work, as a heatmap on the facade */}
      {HEAT.map((v, k) => {
        const c = k % cols;
        const r = Math.floor(k / cols);
        const u0 = 0.1 + c * 0.21;
        const v0 = 0.12 + r * 0.13;
        return <path key={k} d={faceQuad(x, y - S * 0.8, 1.5, 1.5, 5, 'left', u0, u0 + 0.17, v0, v0 + 0.1)} className={`vx-heat vx-heat-${v}`} />;
      })}
      {[0.2, 0.5, 0.8].map((v) => (
        <path key={v} d={faceQuad(x, y - S * 0.8, 1.5, 1.5, 5, 'right', 0.3, 0.7, v - 0.06, v + 0.04)} className="vx-window" />
      ))}
      <Block box={deck} cls="vx-cobble" />
      {/* the timer ring on the roof */}
      <ellipse cx={x} cy={top - 10} rx={W * 0.9} ry={H * 0.9} className="vx-ring-back" />
      <ellipse cx={x} cy={top - 10} rx={W * 0.9} ry={H * 0.9} className="vx-ring" pathLength={1} />
      <path d={`M${x} ${top - 10}V${top - 120}`} className="vx-antenna" />
      <rect x={x - 5} y={top - 132} width="10" height="10" className="vx-beacon-light" />
    </g>
  );
};

/* -------------------------------- Hack the Hill III: arena with a beacon */

const Arena: Art = ({ x, y }) => {
  const hill1 = isoBox(x, y, 3.4, 3.4, 1);
  const hill2 = isoBox(x, y - S, 2.6, 2.6, 1);
  const top = y - S * 2;
  const seats = Array.from({ length: 14 }, (_, k) => {
    const a = (k / 14) * Math.PI * 2;
    const u = Math.cos(a) * 1.05;
    const v = Math.sin(a) * 1.05;
    return { x: x + (u - v) * W * 0.5, y: top + (u + v) * H * 0.5, back: Math.sin(a + Math.PI / 4) < 0 };
  });
  return (
    <g>
      <Block box={hill1} cls="vx-hill" />
      <Block box={hill2} cls="vx-hill" />
      {/* back seats, beacon, front seats */}
      {seats.filter((s) => s.back).map((s, k) => (
        <Block key={`b${k}`} box={isoBox(s.x, s.y, 0.4, 0.4, 0.45)} cls="vx-seat" />
      ))}
      <rect x={x - 10} y={top - 820} width="20" height="820" className="vx-beam" />
      <Block box={isoBox(x, top, 0.6, 0.6, 0.6)} cls="vx-beacon" />
      {seats.filter((s) => !s.back).map((s, k) => (
        <Block key={`f${k}`} box={isoBox(s.x, s.y, 0.4, 0.4, 0.45)} cls="vx-seat" />
      ))}
      <path d={faceQuad(x, y, 3.4, 3.4, 1, 'right', 0.12, 0.5, 0.25, 0.75)} className="vx-banner" />
    </g>
  );
};

/* ------------------------------------------ anything else: a plank house */

const House: Art = ({ x, y }) => {
  const body = isoBox(x, y, 1.6, 1.3, 1.6);
  return (
    <g>
      <Block box={body} cls="vx-plank" />
      <path d={faceQuad(x, y, 1.6, 1.3, 1.6, 'left', 0.4, 0.62, 0, 0.62)} className="vx-door" />
      <path d={faceQuad(x, y, 1.6, 1.3, 1.6, 'right', 0.3, 0.7, 0.45, 0.75)} className="vx-window" />
      <Roof x={x} y={y - S * 1.6} ni={1.8} nj={1.5} rise={S * 1.5} cls="vx-roof" />
    </g>
  );
};

const ART: Record<string, Art> = {
  clocktower: ClockTower,
  tower: CommandTower,
  arena: Arena,
};
