import type { JSX } from 'react';
import type { LandmarkProps } from '../types';
import { burst } from '../shared/sketch';
import { GOLD, INK, MOSS, OXBLOOD, PAPER, PAPER_DARK, battlements, hatch } from './ink';

// Landmarks of the Manuscript Realm, drawn as small inked elevations standing
// on the plan (old maps do this for anything worth a visit). Each sits on its
// lot with its base at `at`. Found ones get a wax seal.

const stroke = { stroke: INK, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export default function ManuscriptLandmark({ project, at, discovered }: LandmarkProps) {
  const Art = ART[project.district] ?? Hall;
  return (
    <g transform={`translate(${at.x} ${at.y})`} className="ms-landmark">
      <ellipse cx="0" cy="6" rx="120" ry="16" fill={INK} opacity="0.08" />
      <Art name={project.name} />
      {discovered && <Seal />}
      {/* generous hit area */}
      <rect x="-130" y="-210" width="260" height="240" fill="transparent" />
    </g>
  );
}

function Seal() {
  return (
    <g transform="translate(96 -10)" className="ms-seal">
      <circle r="17" fill={OXBLOOD} stroke="#4E1212" strokeWidth="2" />
      <circle r="11" fill="none" stroke="#F6EBD3" strokeOpacity="0.5" strokeWidth="1.2" />
      <polygon points={burst(0, 0, 8, 3, 4)} fill="#F6EBD3" opacity="0.85" />
    </g>
  );
}

/* --------------------------------------------- FedEthics: the courthouse */

function Courthouse() {
  const cols = [-72, -36, 0, 36, 72];
  return (
    <g {...stroke}>
      {/* steps */}
      <rect x="-110" y="-14" width="220" height="14" fill={PAPER} strokeWidth="2.2" />
      <rect x="-100" y="-26" width="200" height="12" fill={PAPER} strokeWidth="2" />
      <rect x="-90" y="-36" width="180" height="10" fill={PAPER} strokeWidth="2" />
      {/* body behind the columns, shaded */}
      <rect x="-86" y="-120" width="172" height="84" fill={PAPER_DARK} strokeWidth="1.6" />
      <path d={hatch(-86, -120, 172, 84, 10, 60)} strokeWidth="0.9" opacity="0.35" />
      {/* columns */}
      {cols.map((x) => (
        <g key={x}>
          <rect x={x - 8} y="-116" width="16" height="80" fill={PAPER} strokeWidth="2" />
          <path d={`M${x - 3} -112v72M${x + 3} -112v72`} strokeWidth="0.8" opacity="0.6" />
          <rect x={x - 11} y="-122" width="22" height="7" fill={PAPER} strokeWidth="1.8" />
          <rect x={x - 11} y="-42" width="22" height="6" fill={PAPER} strokeWidth="1.8" />
        </g>
      ))}
      {/* entablature and pediment */}
      <rect x="-100" y="-138" width="200" height="16" fill={PAPER} strokeWidth="2.2" />
      <path d="M-104 -138L0 -192 104 -138Z" fill={PAPER} strokeWidth="2.4" />
      <path d="M-80 -142L0 -182 80 -142Z" fill="none" strokeWidth="1" opacity="0.7" />
      <circle cy="-158" r="9" fill={GOLD} fillOpacity="0.7" strokeWidth="1.4" />
      {/* the scales on the roof */}
      <g transform="translate(0 -192)">
        <path d="M0 0V-40" strokeWidth="2.4" />
        <circle cy="-42" r="3" fill={INK} />
        <g className="ms-scales">
          <path d="M-40 -38H40" strokeWidth="2.4" />
          <path d="M-40 -38l-12 22M-40 -38l12 22M40 -38l-12 22M40 -38l12 22" strokeWidth="1.2" />
          <path d="M-56 -16q16 10 32 0zM24 -16q16 10 32 0z" fill={GOLD} fillOpacity="0.75" strokeWidth="1.6" />
        </g>
      </g>
    </g>
  );
}

/* ------------------------------------------- Express Entry: the gatehouse */

function Gatehouse() {
  return (
    <g {...stroke}>
      {/* towers */}
      {[-70, 70].map((x) => (
        <g key={x}>
          <rect x={x - 30} y="-150" width="60" height="150" fill={PAPER} strokeWidth="2.4" />
          <path d={battlements(x - 30, -150, 60, 10)} fill="none" strokeWidth="2" />
          <path d={`M${x - 4} -118v16M${x + 4} -118v16`} strokeWidth="2.2" />
          <path d={`M${x} -158V-196`} strokeWidth="2" />
          <path d={`M${x} -196l${x < 0 ? -26 : 26} 8l${x < 0 ? 26 : -26} 8`} fill={OXBLOOD} strokeWidth="1.6" className="ms-pennant" />
        </g>
      ))}
      {/* arch and portcullis */}
      <path d="M-40 0V-80Q0 -122 40 -80V0" fill={PAPER_DARK} strokeWidth="2.4" />
      <g strokeWidth="1.2" opacity="0.75">
        {[-28, -14, 0, 14, 28].map((x) => (
          <path key={x} d={`M${x} -96V-10`} />
        ))}
        {[-80, -60, -40, -20].map((y) => (
          <path key={y} d={`M-36 ${y}H36`} />
        ))}
      </g>
      {/* the barrier */}
      <g className="ms-barrier">
        <path d="M-58 -26H58" stroke={INK} strokeWidth="7" />
        <path d="M-58 -26H58" stroke={PAPER} strokeWidth="4" strokeDasharray="10 10" />
      </g>
      {/* the posted ledger */}
      <g transform="translate(118 -112)">
        <path d="M0 0v112" strokeWidth="2.2" />
        <rect x="-40" y="-18" width="80" height="62" fill={PAPER} strokeWidth="2.2" />
        <text x="0" y="-2" textAnchor="middle" className="ms-board-title" stroke="none">
          Draws
        </text>
        <path d="M-30 12h46M-30 22h36M-30 32h50" strokeWidth="1.4" opacity="0.8" />
        <path d="M22 12h8M22 22h8" strokeWidth="2.4" stroke={OXBLOOD} />
      </g>
    </g>
  );
}

/* ---------------------------------------------- Habits: the physic garden */

function Garden() {
  // A habit-tracker grid of flower beds: a few weeks of good days in bloom.
  const beds = Array.from({ length: 21 }, (_, i) => ({
    x: -60 + (i % 7) * 20,
    y: 34 + Math.floor(i / 7) * 18,
    on: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17, 18, 19].includes(i),
  }));
  return (
    <g {...stroke} transform="translate(0 -40)">
      {beds.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="6" fill={b.on ? (i % 3 ? MOSS : OXBLOOD) : PAPER} fillOpacity={b.on ? 0.65 : 1} strokeWidth="1.2" />
      ))}
      {/* the sundial */}
      <path d="M-14 0h28l-6 -46h-16z" fill={PAPER} strokeWidth="2.2" />
      <ellipse cx="0" cy="-48" rx="44" ry="14" fill={PAPER} strokeWidth="2.4" />
      {Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI + (i / 10) * Math.PI;
        return (
          <path key={i} d={`M${Math.cos(a) * 32} ${-48 + Math.sin(a) * 9}L${Math.cos(a) * 40} ${-48 + Math.sin(a) * 12}`} strokeWidth="1" />
        );
      })}
      <path d="M0 -48L-30 -50" stroke={INK} strokeOpacity="0.45" strokeWidth="5" className="ms-shadow" />
      <path d="M0 -48L18 -84V-48Z" fill={GOLD} fillOpacity="0.7" strokeWidth="1.8" />
      {/* the diary on its lectern */}
      <g transform="translate(-92 -8)">
        <path d="M0 0V-34" strokeWidth="2" />
        <path d="M-22 -40L0 -34 22 -40 22 -52 0 -46 -22 -52Z" fill={PAPER} strokeWidth="1.8" />
        <path d="M-16 -45l12 3M-16 -41l12 3M4 -42l12-3M4 -46l12-3" strokeWidth="0.9" />
      </g>
      {/* a little potted bush */}
      <g transform="translate(92 -6)">
        <path d="M-10 0h20l-3 -14h-14z" fill={OXBLOOD} fillOpacity="0.5" strokeWidth="1.6" />
        <circle cy="-24" r="14" fill={MOSS} fillOpacity="0.5" strokeWidth="1.6" />
      </g>
    </g>
  );
}

/* ----------------------------------------- any other project: a town hall */

function Hall({ name }: { name: string }) {
  return (
    <g {...stroke}>
      <rect x="-70" y="-100" width="140" height="100" fill={PAPER} strokeWidth="2.4" />
      <path d="M-82 -100L0 -160 82 -100Z" fill={PAPER} strokeWidth="2.4" />
      <path d={hatch(-70, -100, 140, 100, 12, 60)} strokeWidth="0.8" opacity="0.25" />
      <circle cy="-124" r="12" fill="none" strokeWidth="1.8" />
      <path d="M-16 0V-44Q0 -60 16 -44V0" fill={PAPER_DARK} strokeWidth="2" />
      <path d="M0 -160V-196" strokeWidth="2" />
      <path d="M0 -196l26 8l-26 8" fill={OXBLOOD} strokeWidth="1.6" />
      <title>{name}</title>
    </g>
  );
}

const ART: Record<string, (props: { name: string }) => JSX.Element> = {
  courthouse: Courthouse,
  gate: Gatehouse,
  garden: Garden,
};
