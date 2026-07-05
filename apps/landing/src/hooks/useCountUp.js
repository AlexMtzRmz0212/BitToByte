import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 -> target once `active` becomes true.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    let frame;
    let startTime;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      if (startTime === undefined) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}
