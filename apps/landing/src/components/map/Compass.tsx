import { useEffect, useRef } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import type { Point } from '../../data/worlds';
import type { MapController } from '../../engine/controller';

export interface CompassTarget {
  at: Point;
  label: string;
  /** What tapping the compass or the edge chip does. */
  go: () => void;
}

/**
 * A needle that always points at the current target (the selected place, or
 * the nearest one you haven't found), plus a chip on the screen edge when that
 * target is off-screen. Both update straight from camera moves, no re-render.
 */
export default function Compass({ controller, target }: { controller: MapController | null; target: CompassTarget | null }) {
  const needle = useRef<SVGGElement>(null);
  const chip = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!controller || !target) return;
    const update = () => {
      const { vw, vh } = controller.size;
      const rect = controller.visibleRect();
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;
      const p = controller.toScreen(target.at);
      const angle = Math.atan2(p.y - cy, p.x - cx);
      needle.current?.setAttribute('transform', `rotate(${((angle * 180) / Math.PI + 90).toFixed(1)})`);

      const el = chip.current;
      if (!el) return;
      const margin = 28;
      const onScreen = p.x > rect.x + margin && p.x < rect.x + rect.w - margin && p.y > rect.y + margin && p.y < rect.y + rect.h - margin;
      if (onScreen) {
        el.dataset.visible = 'false';
        return;
      }
      // Walk from the centre toward the target until we hit the visible rect's edge.
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const halfW = rect.w / 2 - 70;
      const halfH = rect.h / 2 - 34;
      const t = Math.min(Math.abs(halfW / (dx || 1e-6)), Math.abs(halfH / (dy || 1e-6)));
      const x = Math.min(vw - 16, Math.max(16, cx + dx * t));
      const y = Math.min(vh - 16, Math.max(16, cy + dy * t));
      el.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px) translate(-50%, -50%)`;
      el.style.setProperty('--angle', `${((angle * 180) / Math.PI).toFixed(1)}deg`);
      el.dataset.visible = 'true';
    };
    update();
    return controller.onView(update);
  }, [controller, target]);

  if (!target) return null;

  return (
    <>
      <button type="button" className="compass chrome" onClick={target.go} aria-label={`Travel to ${target.label}`} title={`Next: ${target.label}`}>
        <svg viewBox="-24 -24 48 48" width="40" height="40" aria-hidden="true">
          <circle r="20" className="compass-face" />
          <g ref={needle}>
            <path d="M0 -17L5 0H-5Z" className="compass-north" />
            <path d="M0 17L5 0H-5Z" className="compass-south" />
          </g>
          <circle r="2.5" className="compass-pin" />
        </svg>
      </button>
      <button ref={chip} type="button" className="edge-chip chrome" data-visible="false" onClick={target.go} tabIndex={-1} aria-hidden="true">
        <ArrowRightIcon className="edge-arrow h-4 w-4" aria-hidden="true" />
        <span className="edge-label">{target.label}</span>
      </button>
    </>
  );
}
