import { useEffect, useRef } from 'react';
import type { MapLayout } from '../../data/worlds';
import type { MapController } from '../../engine/controller';
import type { FogField, FogRenderer } from '../../engine/fog';

interface Props {
  controller: MapController | null;
  layout: MapLayout;
  field: FogField;
  renderer: FogRenderer;
  /** World units cleared around the traveler. */
  radius: number;
  /** A disc was revealed (world units): check for landmarks inside it. */
  onReveal: (x: number, y: number, r: number) => void;
  /** The field changed: persist it. */
  onChange: () => void;
}

/**
 * The fog canvas, inside the zooming layer (so it pans and zooms with the art).
 * It clears around the traveler as it walks, and around wherever you look once
 * the camera settles. Pointer events pass straight through: fog never blocks.
 */
export default function FogLayer({ controller, layout, field, renderer, radius, onReveal, onChange }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const callbacks = useRef({ onReveal, onChange });

  useEffect(() => {
    callbacks.current = { onReveal, onChange };
  });

  // Paint once: everything fogged, then every cell already explored.
  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const res = renderer.resolution;
    renderer.paint(ctx, el.width, el.height);
    for (const p of field.clearedCentres()) {
      renderer.reveal(ctx, p.x / res, p.y / res, (field.cell * 0.95) / res);
    }
    el.dataset.ready = 'true';
  }, [field, renderer]);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!controller || !el || !ctx) return;
    const res = renderer.resolution;
    let last = { x: Number.NaN, y: Number.NaN };

    const reveal = (x: number, y: number, r: number) => {
      const added = field.clearCircle(x, y, r);
      if (!added) return;
      renderer.reveal(ctx, x / res, y / res, r / res);
      callbacks.current.onReveal(x, y, r);
      callbacks.current.onChange();
    };

    // Around the traveler, every half cell of movement.
    const offStep = controller.onStep(({ at }) => {
      if (Math.hypot(at.x - last.x, at.y - last.y) < field.cell * 0.5) return;
      last = at;
      reveal(at.x, at.y, radius);
    });

    // Around the middle of the screen, once a pan or zoom settles.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const offView = controller.onView(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const rect = controller.visibleRect();
        const centre = controller.screenToWorld({ x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 });
        reveal(centre.x, centre.y, radius * 0.75);
      }, 220);
    });

    reveal(controller.traveler.x, controller.traveler.y, radius);

    return () => {
      offStep();
      offView();
      clearTimeout(timer);
    };
  }, [controller, field, renderer, radius]);

  const res = renderer.resolution;
  return (
    <canvas
      ref={canvas}
      className={`map-fog ${renderer.className ?? ''}`}
      width={Math.ceil(layout.size.w / res)}
      height={Math.ceil(layout.size.h / res)}
      style={{ width: layout.size.w, height: layout.size.h }}
      aria-hidden="true"
    />
  );
}
