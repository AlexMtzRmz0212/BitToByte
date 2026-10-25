import type { CSSProperties } from 'react';
import type { Point } from '../../data/worlds';

interface Props {
  at: Point;
  /** World units above `at` where the label sits (the building's height). */
  lift?: number;
  label: string;
  sub?: string;
  kind: 'gate' | 'landmark' | 'home';
  state?: 'idle' | 'found' | 'here';
  ariaLabel: string;
  onSelect: () => void;
}

/**
 * A label pinned to a spot on the map. Lives inside the zooming layer but
 * counter-scales, so it stays the same size on screen at any zoom. These are
 * the keyboard and screen-reader way into the map: real buttons, in order.
 */
export default function MapMarker({ at, lift = 0, label, sub, kind, state = 'idle', ariaLabel, onSelect }: Props) {
  const style = { left: at.x, top: at.y - lift } as CSSProperties;
  return (
    <button
      type="button"
      className={`map-marker marker-${kind}`}
      data-state={state}
      style={style}
      aria-label={ariaLabel}
      onClick={onSelect}
    >
      <span className="marker-label">{label}</span>
      {/* A real space, so the text reads "Gotham 1/1 found", not "Gotham1/1". */}
      {sub && ' '}
      {sub && <span className="marker-sub">{sub}</span>}
    </button>
  );
}
