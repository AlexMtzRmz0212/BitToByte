import './scenes.css';

// Arrival scenes for Los Santos's projects. Theme tokens only, so they follow
// the palette; every animation is transform or opacity and runs once.

const ink = { stroke: 'var(--w-ink)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** Runtime: a lap of the track ticks off the episodes and leaves the time remaining. */
export function LapsScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <ellipse cx="104" cy="55" rx="92" ry="46" fill="var(--w-accent)" fillOpacity="0.8" {...ink} strokeWidth="2.4" />
      <ellipse cx="104" cy="55" rx="79" ry="35" fill="none" stroke="var(--w-surface)" strokeWidth="1.4" />
      <ellipse cx="104" cy="55" rx="66" ry="24" fill="var(--w-deco-3)" {...ink} strokeWidth="2" />
      <path d="M104 79V101" stroke="var(--w-surface)" strokeWidth="3" />
      <g transform="translate(104 55) scale(1 0.44)">
        <g className="sc-lap">
          <circle cx="0" cy="85" r="8" fill="var(--w-surface)" {...ink} strokeWidth="2" />
        </g>
      </g>
      {Array.from({ length: 6 }, (_, k) => (
        <g key={k}>
          <rect x={212 + (k % 3) * 30} y={14 + Math.floor(k / 3) * 26} width="22" height="18" fill="none" {...ink} strokeWidth="1.8" />
          {k < 5 && (
            <rect
              x={212 + (k % 3) * 30}
              y={14 + Math.floor(k / 3) * 26}
              width="22"
              height="18"
              className="sc-live"
              fill="var(--w-deco-1)"
              {...ink}
              strokeWidth="1.8"
              style={{ animationDelay: `${300 + k * 320}ms` }}
            />
          )}
        </g>
      ))}
      <text x="256" y="94" textAnchor="middle" className="sc-digit sc-live" style={{ animationDelay: '2000ms' }}>
        0:42
      </text>
    </svg>
  );
}
