import { PLACES } from '../../data/worlds';
import { spiralArm } from '../shared/sketch';
import type { GateProps } from '../types';
import { INK, PAPER, PAPER_DARK } from './ink';

const ARMS = [0, 1, 2].map((i) => spiralArm(0, 0, 50, 1.1, (i * Math.PI * 2) / 3, 30));

/**
 * A portal, as the cartographer would draw one: a stone archway whose opening
 * is a slow whirl of ink. The swirl is tinted with the destination's accent.
 */
export default function ManuscriptGate({ to, at }: GateProps) {
  const id = `ms-arch-${to}`;
  const tint = PLACES[to].tokens.accent;
  return (
    <g transform={`translate(${at.x} ${at.y})`} data-target={`gate:${to}`} className="ms-gate">
      <defs>
        <clipPath id={id}>
          <path d="M-40 60V-60Q-40 -112 0 -120Q40 -112 40 -60V60Z" />
        </clipPath>
      </defs>
      <ellipse cy="64" rx="80" ry="12" fill={INK} opacity="0.1" />
      {/* the opening */}
      <path d="M-40 60V-60Q-40 -112 0 -120Q40 -112 40 -60V60Z" fill={PAPER_DARK} />
      <g clipPath={`url(#${id})`}>
        <circle cy="-20" r="90" fill={tint} opacity="0.16" />
        <g className="ms-swirl" style={{ transformOrigin: '0px -20px' }}>
          {ARMS.map((d, i) => (
            <path key={i} d={d} transform="translate(0 -20)" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          ))}
          {ARMS.map((d, i) => (
            <path key={`t${i}`} d={d} transform="translate(0 -20) rotate(60)" fill="none" stroke={tint} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>
      </g>
      {/* stonework */}
      <g stroke={INK} strokeLinejoin="round">
        <path d="M-62 60V-60Q-62 -134 0 -144Q62 -134 62 -60V60H40V-60Q40 -112 0 -120Q-40 -112 -40 -60V60Z" fill={PAPER} strokeWidth="2.6" />
        <path d="M-62 -10h22M-62 30h22M40 -10h22M40 30h22M-55 -96l16 10M55 -96l-16 10M-24 -132l6 15M24 -132l-6 15" strokeWidth="1.3" />
        <path d="M-9 -146l9 -12 9 12 -4 18h-10z" fill={PAPER} strokeWidth="2" />
        <path d="M-70 60H70" strokeWidth="2.6" />
      </g>
      <rect x="-76" y="-160" width="152" height="240" fill="transparent" />
    </g>
  );
}
