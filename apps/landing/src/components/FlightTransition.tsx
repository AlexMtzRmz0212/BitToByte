import { useEffect, useRef, type CSSProperties } from 'react';
import './flight.css';
import { resolvePlace, type ThemeId } from '../data/worlds';
import { CITY, STAGE, US_PATH, arcPath } from './usOutline';

export interface Flight {
  id: number;
  from: ThemeId;
  to: ThemeId;
  phase: 'opening' | 'covered' | 'closing';
}

interface Props {
  flight: Flight;
  reducedMotion: boolean;
  /** The screen is fully covered: App holds here for the cruise, then swaps the theme. */
  onCovered: (id: number) => void;
  /** The new theme is showing: remove the overlay. */
  onDone: (id: number) => void;
  /** Tap or Escape: cut the cruise short. */
  onSkip: (id: number) => void;
}

// The sky the plane flies into (art, not theme tokens: it has to read on both).
const SKY: Record<ThemeId, string> = {
  vice: 'linear-gradient(180deg, #2B1237 0%, #8B1763 38%, #E8456B 68%, #FFB070 100%)',
  santos: 'linear-gradient(180deg, #0E0A1C 0%, #2E1A5C 40%, #8C3B8F 72%, #FFB238 100%)',
};

/**
 * Theme switch between Vice City and Los Santos. A sky sweeps across the screen
 * in the direction of travel, a plane crosses a stylized United States from one
 * city to the other, and the theme swaps while the sky covers everything. Then
 * the sky carries on out of frame. Reduced motion gets a short cross-fade.
 */
export default function FlightTransition({ flight, reducedMotion, onCovered, onDone, onSkip }: Props) {
  const callbacks = useRef({ onCovered, onDone, onSkip });
  useEffect(() => {
    callbacks.current = { onCovered, onDone, onSkip };
  });

  // Opening and closing end on a timer (an interrupted animation must never leave
  // the screen covered). The cruise in between is App's: it swaps and moves on.
  useEffect(() => {
    if (flight.phase === 'covered') return;
    const ms = reducedMotion ? 260 : flight.phase === 'opening' ? 800 : 700;
    const t = setTimeout(() => {
      if (flight.phase === 'opening') callbacks.current.onCovered(flight.id);
      else callbacks.current.onDone(flight.id);
    }, ms);
    return () => clearTimeout(t);
  }, [flight.id, flight.phase, reducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && callbacks.current.onSkip(flight.id);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flight.id]);

  const from = CITY[flight.from];
  const to = CITY[flight.to];
  const route = arcPath(from, to);
  const westbound = to[0] < from[0];
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
  const scale = Math.min(1, (vw * 0.9) / STAGE.w, (vh * 0.62) / STAGE.h);
  const toName = resolvePlace('sunset', flight.to).name;
  const fromName = resolvePlace('sunset', flight.from).name;

  const style = {
    '--flight-sky': SKY[flight.to],
    '--flight-dir': westbound ? -1 : 1,
    '--flight-scale': scale,
    '--flight-route': `path('${route}')`,
  } as CSSProperties;

  return (
    <div
      className="flight"
      data-phase={flight.phase}
      data-kind={reducedMotion ? 'fade' : 'fly'}
      style={style}
      onClick={() => onSkip(flight.id)}
    >
      <p className="sr-only" role="status">
        Flying to {toName}
      </p>
      <div className="flight-sky" aria-hidden="true">
        {!reducedMotion && (
          <div className="flight-stage">
            <svg viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} width={STAGE.w} height={STAGE.h}>
              <path d={US_PATH} className="flight-land" />
              <path d={route} className="flight-route" />
              <path d={route} className="flight-trail" pathLength={1} />
              {(['vice', 'santos'] as const).map((id) => (
                <g key={id} transform={`translate(${CITY[id][0]} ${CITY[id][1]})`}>
                  <circle r="7" className="flight-dot" />
                  <circle r="7" className="flight-ping" data-active={id === flight.to} />
                  <text
                    y={id === 'vice' ? 28 : -16}
                    textAnchor="middle"
                    className="flight-city"
                    data-active={id === flight.to}
                  >
                    {resolvePlace('sunset', id).name}
                  </text>
                </g>
              ))}
            </svg>
            <div className="flight-plane">
              <svg viewBox="-20 -16 40 32" width="52" height="42">
                <path d="M18 0 8 -3 2 -14 -3 -14 0 -3 -10 -3 -14 -8 -17 -8 -14 0 -17 8 -14 8 -10 3 0 3 -3 14 2 14 8 3Z" />
              </svg>
            </div>
          </div>
        )}
        <p className="flight-caption type-display">
          {fromName} <span aria-hidden="true">→</span> {toName}
        </p>
        <p className="flight-hint">Tap to skip</p>
      </div>
    </div>
  );
}
