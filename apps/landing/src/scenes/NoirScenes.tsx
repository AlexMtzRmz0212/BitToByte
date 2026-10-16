import './scenes.css';

// Arrival scenes for Noir Metropolis: night, one amber light, a flicker.

/** Cinetech: the projector rolls, posters flip into a grid, a rating fills. */
export function ProjectorScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <path d="M58 52L196 10V100Z" className="sc-beam" />
      <g className="sc-line">
        <rect x="22" y="44" width="40" height="26" rx="3" className="sc-body" />
        <g className="sc-reel" style={{ transformOrigin: '30px 34px' }}>
          <circle cx="30" cy="34" r="12" />
          <path d="M30 22v24M18 34h24" />
        </g>
        <g className="sc-reel" style={{ transformOrigin: '54px 32px' }}>
          <circle cx="54" cy="32" r="10" />
          <path d="M54 22v20M44 32h20" />
        </g>
      </g>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={210 + k * 34} y="22" width="28" height="40" className="sc-poster" style={{ animationDelay: `${500 + k * 220}ms` }} />
      ))}
      {[0, 1, 2, 3, 4].map((k) => (
        <path
          key={k}
          d={`M${222 + k * 16} 76l3.5 7 7.5 1-5.5 5 1.5 7.5-7-3.8-7 3.8 1.5-7.5-5.5-5 7.5-1z`}
          className={k < 4 ? 'sc-star sc-star-on' : 'sc-star'}
          style={{ animationDelay: `${1300 + k * 140}ms` }}
        />
      ))}
    </svg>
  );
}

/** EastCoastEV: the lighthouse beam turns while a battery charges beside an e-bike. */
export function ChargeScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <g className="sc-sweep" style={{ transformOrigin: '52px 24px' }}>
        <path d="M52 24L180 6V42Z" className="sc-beam" />
      </g>
      <g className="sc-line">
        <path d="M40 104L46 30H58L64 104Z" className="sc-body" />
        <rect x="42" y="16" width="20" height="14" className="sc-body" />
        <circle cx="52" cy="24" r="4" className="sc-lamp" />
      </g>
      <g className="sc-line">
        <circle cx="196" cy="88" r="14" />
        <circle cx="244" cy="88" r="14" />
        <path d="M196 88L214 66H236L244 88M214 66L222 88H196M236 66l-4-10h-8" />
      </g>
      <rect x="268" y="40" width="34" height="62" rx="4" className="sc-body sc-line" />
      <rect x="279" y="34" width="12" height="6" className="sc-body sc-line" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x="273" y={92 - k * 11} width="24" height="8" className="sc-cell" style={{ animationDelay: `${300 + k * 280}ms` }} />
      ))}
      <path d="M266 70c-10 0-14 14-22 18" className="sc-line" fill="none" />
    </svg>
  );
}
