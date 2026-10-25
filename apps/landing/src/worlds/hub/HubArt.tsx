import { WORLDS, isWorldId, type MapLayout, type Point } from '../../data/worlds';
import { tokenStyle } from '../../theme/tokens';
import { blob, burst, inkLine, smoothClosed, spiralArm, wobblyCircle } from '../shared/sketch';
import type { GateProps } from '../types';
import MiniatureArt from './MiniatureArt';

// The Citadel: a scrappy workshop on a rock adrift in deep space, with six green
// swirling portals on little rocks of their own. Thick, slightly wobbly cartoon
// outlines; everything else is the starfield behind (screen space, Starfield.tsx).

const OUTLINE = '#04060C';
const PORTAL_R = 100;

export function HubTerrain({ layout }: { layout: MapLayout }) {
  const home = layout.home ?? { x: layout.size.w / 2, y: layout.size.h / 2 };
  const gates = Object.values(layout.gates) as Point[];
  return (
    <>
      <defs>
        <radialGradient id="hub-portal-disc">
          <stop offset="0" stopColor="#F2FFE4" />
          <stop offset="0.35" stopColor="#B6F27A" />
          <stop offset="0.72" stopColor="#6FD13D" />
          <stop offset="1" stopColor="#3A9A22" />
        </radialGradient>
        <radialGradient id="hub-portal-glow">
          <stop offset="0.55" stopColor="#8EE04B" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8EE04B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hub-window-shine" cx="0.32" cy="0.28" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="hub-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A4263" />
          <stop offset="1" stopColor="#161B2E" />
        </linearGradient>
        <linearGradient id="hub-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B6890" />
          <stop offset="1" stopColor="#323B5A" />
        </linearGradient>
        <linearGradient id="hub-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A5F3FC" />
          <stop offset="1" stopColor="#1E6F78" />
        </linearGradient>
        <radialGradient id="hub-nebula-purple">
          <stop offset="0" stopColor="#7C3AED" stopOpacity="0.26" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hub-nebula-teal">
          <stop offset="0" stopColor="#14B8A6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hub-nebula-green">
          <stop offset="0" stopColor="#65A30D" stopOpacity="0.16" />
          <stop offset="1" stopColor="#65A30D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hub-comet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E0F2FE" stopOpacity="0" />
          <stop offset="1" stopColor="#E0F2FE" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* nebulae */}
      <ellipse cx="300" cy="900" rx="520" ry="360" fill="url(#hub-nebula-purple)" />
      <ellipse cx="1300" cy="260" rx="480" ry="320" fill="url(#hub-nebula-teal)" />
      <ellipse cx="820" cy="620" rx="560" ry="420" fill="url(#hub-nebula-green)" />

      <DistantBodies />

      {/* the orbit the portals sit on, and the dotted lanes out to each */}
      <ellipse
        cx={home.x}
        cy={600}
        rx={422}
        ry={372}
        fill="none"
        stroke="#8EE04B"
        strokeOpacity="0.22"
        strokeWidth="3"
        strokeDasharray="2 18"
        strokeLinecap="round"
      />
      {gates.map((g, i) => (
        <path
          key={i}
          d={inkLine({ x: home.x, y: 600 }, g, 30 + i, 10, 5)}
          fill="none"
          stroke="#8EE04B"
          strokeOpacity="0.5"
          strokeWidth="6"
          strokeDasharray="1 20"
          strokeLinecap="round"
        />
      ))}

      {/* rocks the portals float on */}
      {gates.map((g, i) => (
        <PortalRock key={i} at={g} seed={i + 3} />
      ))}

      <Island home={home} />

      {/* drifting debris */}
      {[
        [610, 250, 22, 1],
        [1000, 250, 16, 2],
        [1010, 1010, 26, 3],
        [600, 1010, 18, 4],
        [1380, 600, 12, 5],
        [220, 600, 14, 6],
      ].map(([x, y, r, s]) => (
        <path
          key={s}
          d={blob(x!, y!, r!, r! * 0.8, s!, 0.28, 9)}
          fill="url(#hub-rock)"
          stroke={OUTLINE}
          strokeWidth="4"
          className={`hub-drift hub-drift-${s! % 3}`}
        />
      ))}

      <Satellite cx={home.x} cy={600} />
    </>
  );
}

function DistantBodies() {
  return (
    <g>
      {/* ringed planet */}
      <g transform="translate(205 210)">
        <ellipse rx="128" ry="28" transform="rotate(-16)" fill="none" stroke="#C4B5FD" strokeOpacity="0.55" strokeWidth="8" />
        <circle r="70" fill="#4C3D8F" stroke={OUTLINE} strokeWidth="5" />
        <path d="M-66 -18Q0 -32 66 -14M-70 8Q0 -6 69 12M-60 34Q0 22 58 40" fill="none" stroke="#6D5BB8" strokeWidth="9" strokeLinecap="round" />
        <path d="M-124 30A128 28 0 0 0 124 -26" transform="rotate(-16)" fill="none" stroke="#C4B5FD" strokeOpacity="0.85" strokeWidth="8" />
        <circle cx="-26" cy="-30" r="16" fill="#ffffff" opacity="0.08" />
      </g>
      {/* moon */}
      <g transform="translate(1415 1030)">
        <circle r="48" fill="#9AA3B8" stroke={OUTLINE} strokeWidth="5" />
        <circle cx="-14" cy="-10" r="11" fill="#7C849A" />
        <circle cx="16" cy="12" r="7" fill="#7C849A" />
        <circle cx="10" cy="-22" r="5" fill="#7C849A" />
      </g>
      {/* small teal world */}
      <g transform="translate(1410 175)">
        <circle r="26" fill="#2DD4BF" stroke={OUTLINE} strokeWidth="4" />
        <path d="M-22 -4Q-6 4 22 -6" fill="none" stroke="#0F766E" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* comet */}
      <g transform="translate(1180 1090) rotate(-24)" className="hub-comet">
        <path d="M-150 0L0 -6 0 6Z" fill="url(#hub-comet)" />
        <circle r="9" fill="#F0F9FF" stroke={OUTLINE} strokeWidth="3" />
      </g>
      {/* far sparkles in world space, so panning has depth */}
      {[
        [120, 640],
        [690, 120],
        [1500, 520],
        [980, 1130],
        [380, 1120],
        [1530, 880],
      ].map(([x, y], i) => (
        <polygon key={i} points={burst(x!, y!, 9, 2.4, 4)} fill="#E0F2FE" className="hub-twinkle" style={{ animationDelay: `${i * -0.9}s` }} />
      ))}
    </g>
  );
}

function PortalRock({ at, seed }: { at: Point; seed: number }) {
  const top = at.y + PORTAL_R + 6;
  return (
    <g>
      <path
        d={smoothClosed([
          { x: at.x - 78, y: top },
          { x: at.x - 40, y: top - 12 },
          { x: at.x + 36, y: top - 12 },
          { x: at.x + 80, y: top },
          { x: at.x + 46, y: top + 30 },
          { x: at.x + 10, y: top + 58 },
          { x: at.x - 30, y: top + 34 },
        ])}
        fill="url(#hub-rock)"
        stroke={OUTLINE}
        strokeWidth="5"
      />
      <path d={blob(at.x, top - 4, 62, 9, seed, 0.06, 10)} fill="#4A5578" stroke={OUTLINE} strokeWidth="4" />
    </g>
  );
}

function Island({ home }: { home: Point }) {
  const cx = home.x;
  const cy = 610;
  return (
    <g>
      {/* rocky underside */}
      <path
        d={smoothClosed(
          [
            { x: cx - 236, y: cy - 6 },
            { x: cx - 120, y: cy - 30 },
            { x: cx + 120, y: cy - 30 },
            { x: cx + 238, y: cy - 4 },
            { x: cx + 206, y: cy + 62 },
            { x: cx + 150, y: cy + 118 },
            { x: cx + 74, y: cy + 150 },
            { x: cx + 20, y: cy + 222 },
            { x: cx - 30, y: cy + 168 },
            { x: cx - 96, y: cy + 196 },
            { x: cx - 150, y: cy + 120 },
            { x: cx - 214, y: cy + 64 },
          ],
          0.9
        )}
        fill="url(#hub-rock)"
        stroke={OUTLINE}
        strokeWidth="6"
      />
      <path d={`M${cx - 120} ${cy + 70}l26 18M${cx + 60} ${cy + 96}l-18 26M${cx + 140} ${cy + 40}l20 22`} stroke={OUTLINE} strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
      {/* the plaza deck */}
      <ellipse cx={cx} cy={cy} rx="226" ry="96" fill="url(#hub-metal)" stroke={OUTLINE} strokeWidth="6" />
      <ellipse cx={cx} cy={cy} rx="170" ry="70" fill="none" stroke="#8EE04B" strokeOpacity="0.28" strokeWidth="3" strokeDasharray="6 10" />
      <ellipse cx={cx} cy={cy} rx="104" ry="42" fill="none" stroke="#A5B4FC" strokeOpacity="0.22" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * 180}
            y1={cy + Math.sin(a) * 76}
            x2={cx + Math.cos(a) * 214}
            y2={cy + Math.sin(a) * 90}
            stroke="#A5B4FC"
            strokeOpacity="0.3"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Satellite({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="hub-orbit" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <g transform={`translate(${cx + 520} ${cy - 40})`}>
        <rect x="-34" y="-8" width="24" height="16" fill="#3B82F6" stroke={OUTLINE} strokeWidth="3" />
        <rect x="10" y="-8" width="24" height="16" fill="#3B82F6" stroke={OUTLINE} strokeWidth="3" />
        <path d="M-22 -8v16M22 -8v16" stroke="#1E3A8A" strokeWidth="2" />
        <rect x="-10" y="-11" width="20" height="22" rx="4" fill="#CBD5E1" stroke={OUTLINE} strokeWidth="3" />
        <path d="M0 -11v-12" stroke={OUTLINE} strokeWidth="3" />
        <circle cy="-24" r="3.5" fill="#8EE04B" className="hub-blink" />
      </g>
    </g>
  );
}

/* ---------------------------------------------------------------- portals */

function drip(angle: number, length: number): string {
  const r = PORTAL_R - 6;
  const bx = Math.cos(angle) * r;
  const by = Math.sin(angle) * r;
  const w = 7;
  return `M${bx - w} ${by}C${bx - w} ${by + length * 0.55} ${bx - 4} ${by + length} ${bx} ${by + length}C${bx + 4} ${by + length} ${bx + w} ${by + length * 0.55} ${bx + w} ${by}Z`;
}

const ARMS = [0, 1, 2, 3].map((i) => spiralArm(0, 0, PORTAL_R - 8, 0.85, (i * Math.PI) / 2));

/** A green swirling portal with a glimpse of the world beyond in its eye. */
export function HubGate({ to, at }: GateProps) {
  const world = isWorldId(to) ? WORLDS[to] : null;
  const seed = to.length * 7;
  return (
    <g transform={`translate(${at.x} ${at.y})`} className="hub-gate" data-target={`gate:${to}`}>
      <circle r={PORTAL_R * 1.55} fill="url(#hub-portal-glow)" className="hub-gate-glow" />
      <path d={drip(Math.PI * 0.62, 30)} fill="#6FD13D" stroke={OUTLINE} strokeWidth="4" />
      <path d={drip(Math.PI * 0.44, 22)} fill="#6FD13D" stroke={OUTLINE} strokeWidth="4" />
      <g className="hub-swirl">
        <circle r={PORTAL_R} fill="url(#hub-portal-disc)" />
        {ARMS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#F2FFE4" strokeOpacity="0.75" strokeWidth="9" strokeLinecap="round" />
        ))}
        {ARMS.map((d, i) => (
          <path key={`b${i}`} d={d} transform="rotate(45)" fill="none" stroke="#3A9A22" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />
        ))}
      </g>
      <path d={wobblyCircle(0, 0, PORTAL_R + 1, seed, 0.03, 18)} fill="none" stroke={OUTLINE} strokeWidth="7" />
      {world && (
        <g style={tokenStyle(world.tokens)}>
          <clipPath id={`hub-window-${to}`}>
            <circle r="58" />
          </clipPath>
          <g clipPath={`url(#hub-window-${to})`}>
            <svg x="-58" y="-58" width="116" height="116" viewBox="0 0 200 200" overflow="hidden">
              <MiniatureArt id={world.id} />
            </svg>
          </g>
          <circle r="58" fill="url(#hub-window-shine)" />
          <path d={wobblyCircle(0, 0, 59, seed + 1, 0.025, 14)} fill="none" stroke={OUTLINE} strokeWidth="6" />
        </g>
      )}
      {/* generous invisible hit area */}
      <circle r={PORTAL_R + 14} fill="transparent" className="hub-hit" />
    </g>
  );
}

/* ----------------------------------------------------------------- the HQ */

export function HubHome({ at }: { at: Point }) {
  const { x, y } = at;
  return (
    <g transform={`translate(${x} ${y})`} data-target="home" className="hub-home">
      {/* ground shadow */}
      <ellipse cx="0" cy="4" rx="96" ry="16" fill="#000" opacity="0.35" />

      {/* portal-fluid tank on the left */}
      <g transform="translate(-104 -64)">
        <rect x="-16" y="-44" width="32" height="88" rx="14" fill="#0E1A2E" stroke={OUTLINE} strokeWidth="5" />
        <rect x="-10" y="-8" width="20" height="46" rx="9" fill="#8EE04B" className="hub-tank" />
        <circle cx="-2" cy="10" r="3" fill="#E8FFD0" className="hub-bubble" />
        <circle cx="4" cy="24" r="2.4" fill="#E8FFD0" className="hub-bubble hub-bubble-2" />
        <path d="M16 6h18v52" fill="none" stroke={OUTLINE} strokeWidth="5" />
      </g>

      {/* body */}
      <path
        d="M-78 0L-82 -118Q-80 -124 -72 -124H72Q80 -124 82 -118L78 0Z"
        fill="#1B2440"
        stroke={OUTLINE}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M-76 -96H76" stroke="#2E3A60" strokeWidth="5" />

      {/* glass dome lab */}
      <path d="M-60 -124A60 58 0 0 1 60 -124Z" fill="url(#hub-dome)" stroke={OUTLINE} strokeWidth="6" />
      <path d="M-30 -172Q0 -160 30 -172M-52 -150Q0 -136 52 -150M0 -124V-182" fill="none" stroke="#0E4F57" strokeOpacity="0.6" strokeWidth="3" />
      <path d="M-34 -160Q-24 -176 -6 -178" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="5" strokeLinecap="round" />

      {/* antenna and beacon */}
      <path d="M0 -182V-214" stroke={OUTLINE} strokeWidth="5" />
      <circle cy="-218" r="7" fill="#8EE04B" stroke={OUTLINE} strokeWidth="3" className="hub-blink" />

      {/* dish */}
      <g transform="translate(70 -150) rotate(-28)">
        <path d="M-26 0A26 14 0 0 0 26 0Z" fill="#CBD5E1" stroke={OUTLINE} strokeWidth="5" />
        <path d="M0 0V-18" stroke={OUTLINE} strokeWidth="4" />
        <circle cy="-20" r="4" fill="#F59E0B" stroke={OUTLINE} strokeWidth="2" />
      </g>
      <path d="M60 -124L70 -146" stroke={OUTLINE} strokeWidth="5" />

      {/* the BitToByte sign */}
      <g transform="translate(-26 -88)">
        <rect width="52" height="52" rx="11" fill="#2563EB" stroke={OUTLINE} strokeWidth="5" />
        <g transform="translate(5 5) scale(1.75)" fill="none" stroke="#F8FAFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4v16" />
          <path d="M8 4h5.5a4 4 0 0 1 0 8H8" />
          <path d="M8 12h6a4.2 4.2 0 0 1 0 8H8" />
        </g>
      </g>

      {/* windows and door */}
      <rect x="-64" y="-80" width="26" height="22" rx="4" fill="#FDE68A" stroke={OUTLINE} strokeWidth="4" className="hub-window" />
      <rect x="38" y="-80" width="26" height="22" rx="4" fill="#FDE68A" stroke={OUTLINE} strokeWidth="4" className="hub-window hub-window-2" />
      <path d="M-15 0V-26Q0 -36 15 -26V0" fill="#0B1020" stroke={OUTLINE} strokeWidth="5" />

      {/* exhaust */}
      <path d="M-58 -124V-150H-42V-124" fill="#3A4263" stroke={OUTLINE} strokeWidth="5" />
      <circle cx="-50" cy="-166" r="7" fill="#94A3B8" opacity="0.6" className="hub-smoke" />
      <circle cx="-46" cy="-182" r="9" fill="#94A3B8" opacity="0.45" className="hub-smoke hub-smoke-2" />

      <rect x="-110" y="-240" width="220" height="250" fill="transparent" className="hub-hit" />
    </g>
  );
}

/* --------------------------------------------------------------- traveler */

/** A small scrappy saucer. Tilts into its direction of travel; beams while moving. */
export function Saucer() {
  return (
    <div className="saucer">
      <svg viewBox="-44 -40 88 84" width="66" height="63" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="saucer-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B6F27A" stopOpacity="0.7" />
            <stop offset="1" stopColor="#B6F27A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="saucer-beam" d="M-12 8L12 8 26 42-26 42Z" fill="url(#saucer-beam)" />
        <g className="saucer-body">
          <path d="M-17 2Q-16 -22 0 -24Q16 -22 17 2Z" fill="#7DD3FC" fillOpacity="0.9" stroke={OUTLINE} strokeWidth="3.5" />
          <path d="M-8 -14Q-4 -19 2 -19" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="0" cy="4" rx="34" ry="11" fill="#C7CDD9" stroke={OUTLINE} strokeWidth="3.5" />
          <path d="M-30 4Q0 13 30 4" fill="none" stroke="#8892A6" strokeWidth="3" />
          <circle cx="-18" cy="6" r="3" fill="#8EE04B" className="saucer-light" />
          <circle cx="0" cy="9" r="3" fill="#8EE04B" className="saucer-light saucer-light-2" />
          <circle cx="18" cy="6" r="3" fill="#8EE04B" className="saucer-light saucer-light-3" />
        </g>
      </svg>
    </div>
  );
}
