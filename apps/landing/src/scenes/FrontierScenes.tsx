import './scenes.css';

// Arrival scenes for Blackwater's projects. Theme tokens only, so they follow
// the palette; every animation is transform or opacity and runs once.

const ink = { stroke: 'var(--w-ink)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function HabitRow({ x, y, width, delay }: { x: number; y: number; width: number; delay: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="6" fill="none" {...ink} strokeWidth="1.4" strokeOpacity="0.45" />
      <path d={`M${x + 12} ${y}h${width}`} {...ink} strokeWidth="2" strokeOpacity="0.45" fill="none" />
      <g className="sc-bloom" style={{ animationDelay: `${delay}ms` }}>
        <circle cx={x} cy={y} r="6" fill="var(--w-accent)" {...ink} strokeWidth="1.4" />
        <path d={`M${x - 3} ${y}l2.2 2.4 4-4.6`} fill="none" stroke="var(--w-surface)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Loop Habits: ticked on the phone, carried through the shared folder, ticked on the desktop. */
export function SyncScene() {
  return (
    <svg viewBox="0 0 320 110" className="scene" aria-hidden="true" focusable="false">
      <path d="M80 55H206" {...ink} fill="none" strokeWidth="1.6" strokeDasharray="3 6" />
      <rect x="28" y="8" width="52" height="94" rx="8" fill="var(--w-surface)" {...ink} strokeWidth="2.4" />
      <path d="M46 94h16" {...ink} fill="none" strokeWidth="2" />
      <HabitRow x={40} y={26} width={28} delay={0} />
      <HabitRow x={40} y={48} width={28} delay={260} />
      <HabitRow x={40} y={70} width={28} delay={520} />
      <path d="M124 38h14l6 7h22v28h-42z" fill="var(--w-deco-1)" {...ink} strokeWidth="2.2" />
      <circle r="5" cy="55" className="sc-sync" fill="var(--w-accent)" {...ink} strokeWidth="1.4" />
      <rect x="206" y="10" width="92" height="68" rx="3" fill="var(--w-surface)" {...ink} strokeWidth="2.4" />
      <path d="M252 78v14M230 96h44" {...ink} fill="none" strokeWidth="2.4" />
      <HabitRow x={220} y={24} width={62} delay={2000} />
      <HabitRow x={220} y={44} width={62} delay={2260} />
      <HabitRow x={220} y={64} width={62} delay={2520} />
    </svg>
  );
}
