import { useSyncExternalStore } from 'react';

// prefers-reduced-motion, readable from plain code and from components.
// With it on: no ambient loops, no rift (a short cross-fade instead), the camera
// and traveler jump, and worlds open in list view.

const QUERY = '(prefers-reduced-motion: reduce)';

const media = () =>
  typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia(QUERY) : null;

export const prefersReducedMotion = (): boolean => media()?.matches ?? false;

function subscribe(onChange: () => void) {
  const mq = media();
  mq?.addEventListener('change', onChange);
  return () => mq?.removeEventListener('change', onChange);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
