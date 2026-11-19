import type { MapLayout } from '../../data/worlds';
import { placeNow } from '../../state/app';
import { spiralArm } from '../shared/sketch';
import type { GateProps } from '../types';
import { EXPRESS_Y, HWY_X, OCEAN_DRIVE_BOTTOM, OCEAN_DRIVE_TOP, OCEAN_DRIVE_X } from './city';

// Vice City: the gate, the convertible, traffic on Ocean Drive and the sky.

const ARMS = [0, 1, 2].map((i) => spiralArm(0, 0, 42, 1.2, (i * Math.PI * 2) / 3, 30));

/** An art-deco arch lit in neon, swirling with the destination's colour, under a plaque with its name. */
export function ViceGate({ to, at }: GateProps) {
  const dest = placeNow(to);
  const tint = dest.tokens.accent;
  const id = `vc-portal-${to}`;
  return (
    <g transform={`translate(${at.x} ${at.y})`} data-target={`gate:${to}`} className="vc-gate">
      <defs>
        <clipPath id={id}>
          <path d="M-46 64V-8A46 46 0 0 1 46 -8V64Z" />
        </clipPath>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0" stopColor={tint} stopOpacity="0.95" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="34" cy="68" rx="100" ry="15" className="vc-shadow" />
      {/* the arch: stepped stucco with a neon tube round the opening */}
      <path d="M-76 64V-12A76 76 0 0 1 76 -12V64H46V-8A46 46 0 0 0 -46 -8V64Z" className="vc-arch" />
      <path d="M-62 64V-12A62 62 0 0 1 62 -12V64" className="vc-arch-neon" />
      <path d="M-46 64V-8A46 46 0 0 1 46 -8V64Z" className="vc-portal" />
      <g clipPath={`url(#${id})`}>
        <circle cy="10" r="66" fill={`url(#${id}-eye)`} />
        <g className="vc-vortex" style={{ transformOrigin: '0px 10px' }}>
          {ARMS.map((d, k) => (
            <path key={k} d={d} transform="translate(0 10)" className="vc-vortex-arm" />
          ))}
        </g>
      </g>
      {/* the plaque on two posts */}
      <path d="M-88 64V-128M88 64V-128" className="vc-post" />
      <rect x="-96" y="-158" width="192" height="52" rx="26" className="vc-plaque" />
      <rect x="-90" y="-152" width="180" height="40" rx="20" className="vc-plaque-neon" />
      <text y="-124" textAnchor="middle" className="vc-plaque-text">
        {dest.short.toUpperCase().slice(0, 10)}
      </text>
      <rect x="-110" y="-180" width="220" height="260" fill="transparent" />
    </g>
  );
}

/** A convertible seen from above, pointed where it is going; headlights on while moving. */
export function ViceCar() {
  return (
    <div className="vc-car">
      <svg viewBox="-34 -18 68 36" width="60" height="32" aria-hidden="true" focusable="false">
        <path className="vc-headbeam" d="M26 -8L70 -22V22L26 8Z" />
        <rect x="-28" y="-13" width="56" height="26" rx="9" className="vc-car-shadow" transform="translate(3 3)" />
        <path d="M-28 -6q0 -7 8 -8h36q12 0 12 14t-12 14h-36q-8 -1 -8 -8Z" className="vc-car-paint" />
        <path d="M-24 -4h46M-24 4h46" className="vc-car-stripe" />
        <rect x="-18" y="-10" width="12" height="20" rx="4" className="vc-car-seat" />
        <circle cx="-12" cy="-4" r="3.6" className="vc-car-head" />
        <circle cx="-12" cy="4" r="3.6" className="vc-car-head vc-car-head-2" />
        <path d="M3 -10h7q5 4 5 10t-5 10h-7q3 -10 0 -20Z" className="vc-car-windshield" />
        <circle cx="24" cy="-9" r="2" className="vc-car-light" />
        <circle cx="24" cy="9" r="2" className="vc-car-light" />
        <circle cx="-27" cy="-8" r="1.8" className="vc-car-tail" />
        <circle cx="-27" cy="8" r="1.8" className="vc-car-tail" />
      </svg>
    </div>
  );
}

/** World-space traffic: Ocean Drive, the highway, the expressway and a few boats in the bay. */
export function ViceTraffic({ layout }: { layout: MapLayout }) {
  const { w, h } = layout.size;
  const colors = ['#FF2E88', '#FFF3E0', '#12B8B8', '#FF7A3D', '#7B3FE4'];
  const delay = (k: number, step: number) => ({ animationDelay: `${-k * step}s` });
  return (
    <svg className="vc-overlay" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      {Array.from({ length: 5 }, (_, k) => (
        <g key={`ds${k}`} className="vc-traffic vc-south" style={{ ...delay(k, 3.7), animationDuration: `${15 + (k % 3) * 2}s` }}>
          <rect x={OCEAN_DRIVE_X - 12} y={OCEAN_DRIVE_TOP} width="9" height="20" rx="3" fill={colors[k % colors.length]} className="vc-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 5 }, (_, k) => (
        <g key={`dn${k}`} className="vc-traffic vc-north" style={{ ...delay(k, 3.3), animationDuration: `${16 + (k % 3) * 2}s` }}>
          <rect x={OCEAN_DRIVE_X + 3} y={OCEAN_DRIVE_BOTTOM - 20} width="9" height="20" rx="3" fill={colors[(k + 2) % colors.length]} className="vc-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 5 }, (_, k) => (
        <g key={`hs${k}`} className="vc-traffic vc-south vc-long" style={{ ...delay(k, 4.4), animationDuration: `${22 + (k % 2) * 3}s` }}>
          <rect x={HWY_X - 17} y="-20" width="10" height="22" rx="3" fill={colors[(k + 1) % colors.length]} className="vc-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 5 }, (_, k) => (
        <g key={`hn${k}`} className="vc-traffic vc-north vc-long" style={{ ...delay(k, 4.1), animationDuration: `${23 + (k % 2) * 2}s` }}>
          <rect x={HWY_X + 7} y="1300" width="10" height="22" rx="3" fill={colors[(k + 3) % colors.length]} className="vc-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 4 }, (_, k) => (
        <g key={`ee${k}`} className="vc-traffic vc-east" style={{ ...delay(k, 4.8), animationDuration: `${15 + (k % 2) * 2}s` }}>
          <rect x={HWY_X} y={EXPRESS_Y - 15} width="22" height="10" rx="3" fill={colors[(k + 4) % colors.length]} className="vc-traffic-car" />
        </g>
      ))}
      {Array.from({ length: 4 }, (_, k) => (
        <g key={`ew${k}`} className="vc-traffic vc-west" style={{ ...delay(k, 5.1), animationDuration: `${16 + (k % 2) * 2}s` }}>
          <rect x="1390" y={EXPRESS_Y + 5} width="22" height="10" rx="3" fill={colors[k % colors.length]} className="vc-traffic-car" />
        </g>
      ))}
      {/* boats in the bay, with wakes */}
      {[0, 1].map((k) => (
        <g key={`b${k}`} className="vc-boat" style={{ ...delay(k, 14), animationDuration: `${34 + k * 8}s` }}>
          <path d={`M${2060 + k * 52} 1130h6`} className="vc-wake" />
          <path d={`M${2054 + k * 52} 1100l5 -12l5 12v14h-10Z`} className="vc-boat-hull" />
        </g>
      ))}
    </svg>
  );
}

/** Screen-space sky: the golden-hour glow, a flock of flamingos, a seaplane and gulls. */
export function ViceSkyFx() {
  const flamingo = (x: number, y: number, s: number) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="14" cy="9" rx="8" ry="3.6" className="vc-flamingo" />
      <path d="M20 8q7 -4 5 -13" className="vc-flamingo-neck" />
      <circle cx="25" cy="-5" r="1.8" className="vc-flamingo" />
      <path d="M8 11l-9 3M8 12l-8 7" className="vc-flamingo-neck" />
      <path d="M12 8q-6 -9 -1 -13q6 4 6 12Z" className="vc-flamingo-wing" />
    </g>
  );
  return (
    <div className="vc-fx" aria-hidden="true">
      <div className="vc-glow" />
      <div className="vc-flock">
        <svg viewBox="0 0 140 80" width="140" height="80">
          {flamingo(6, 30, 1)}
          {flamingo(44, 14, 0.9)}
          {flamingo(44, 50, 0.9)}
          {flamingo(86, 2, 0.8)}
          {flamingo(86, 62, 0.8)}
        </svg>
      </div>
      <div className="vc-seaplane">
        <svg viewBox="-50 -26 100 52" width="100" height="52">
          <ellipse cx="6" cy="14" rx="26" ry="6" className="vc-seaplane-shadow" />
          <path d="M-38 0h56q16 0 20 6h-76Z" className="vc-seaplane-body" />
          <path d="M-8 -22h24l-6 22h-12Z" className="vc-seaplane-wing" />
          <path d="M-38 0l-8 -10h6l8 10Z" className="vc-seaplane-wing" />
          <path d="M-26 8h40" className="vc-seaplane-float" />
        </svg>
      </div>
      <div className="vc-gulls">
        <svg viewBox="0 0 120 40" width="120" height="40">
          <path d="M4 20q8 -8 14 0q6 -8 14 0M50 10q6 -6 10 0q4 -6 10 0M84 28q7 -7 12 0q5 -7 12 0" />
        </svg>
      </div>
    </div>
  );
}

/** Beyond the map: the sky and sea at golden hour. */
export function ViceBackdrop() {
  return <div className="vc-backdrop" aria-hidden="true" />;
}
