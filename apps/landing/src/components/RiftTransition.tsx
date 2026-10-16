import { useEffect, useRef, type CSSProperties } from 'react';
import './rift.css';
import { PLACES, type PlaceId, type Point } from '../data/worlds';

export interface Rift {
  id: number;
  from: PlaceId;
  to: PlaceId;
  /** Where it opens (the gate, on screen). Null: the centre. */
  at: Point | null;
  phase: 'opening' | 'covered' | 'closing';
}

interface Props {
  rift: Rift;
  reducedMotion: boolean;
  /** The screen is fully covered: swap the world now. */
  onCovered: (id: number) => void;
  /** The new world is showing: remove the overlay. */
  onDone: (id: number) => void;
}

/**
 * Portal travel. A swirling disc grows out of the gate in the old world's
 * colors, its eye already the new world's background. While it covers the
 * screen the theme tokens swap and the next map mounts; then it collapses onto
 * the arrival gate. Reduced motion gets a short cross-fade instead.
 */
export default function RiftTransition({ rift, reducedMotion, onCovered, onDone }: Props) {
  const callbacks = useRef({ onCovered, onDone });
  useEffect(() => {
    callbacks.current = { onCovered, onDone };
  });

  // Phase changes are driven by animation ends, with a timer as a safety net
  // (an interrupted animation must never leave the screen covered).
  useEffect(() => {
    if (rift.phase === 'covered') return;
    const ms = reducedMotion ? 260 : rift.phase === 'opening' ? 760 : 820;
    const t = setTimeout(() => {
      if (rift.phase === 'opening') callbacks.current.onCovered(rift.id);
      else callbacks.current.onDone(rift.id);
    }, ms);
    return () => clearTimeout(t);
  }, [rift.id, rift.phase, reducedMotion]);

  const from = PLACES[rift.from].tokens;
  const to = PLACES[rift.to].tokens;
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
  const at = rift.phase === 'closing' || !rift.at ? { x: vw / 2, y: vh / 2 } : rift.at;
  // The solid eye (60% of the radius) must cover the whole screen from any point.
  const radius = (Math.hypot(vw, vh) / 0.6) * 1.05;

  const style = {
    '--rift-x': `${at.x}px`,
    '--rift-y': `${at.y}px`,
    '--rift-s': (radius * 2) / 400,
    '--rift-from': from.accent,
    '--rift-to': to.accent,
    '--rift-glow': to['deco-2'],
    '--rift-eye': to.bg,
  } as CSSProperties;

  return (
    <div
      className="rift"
      data-phase={rift.phase}
      data-kind={reducedMotion ? 'fade' : 'swirl'}
      style={style}
      aria-hidden="true"
    >
      <div className="rift-disc">
        <div className="rift-swirl" />
      </div>
    </div>
  );
}
