import { useSyncExternalStore } from 'react';
import { browserStorage } from '../../state/persist';

// Whether the visitor keeps the travel panel minimized. A convenience, so it sits
// in its own key instead of the exploration progress, and it carries across
// worlds: each world's map remounts the panel, and this outlives that.

const KEY = 'bittobyte:travel-minimized';
const listeners = new Set<() => void>();
let minimized: boolean | null = null;

function read(): boolean {
  if (minimized === null) {
    try {
      minimized = browserStorage()?.getItem(KEY) === '1';
    } catch {
      minimized = false;
    }
  }
  return minimized;
}

function write(next: boolean) {
  minimized = next;
  try {
    browserStorage()?.setItem(KEY, next ? '1' : '0');
  } catch {
    // Storage can be full or blocked; the choice still holds for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTravelMinimized(): [boolean, (next: boolean) => void] {
  return [useSyncExternalStore(subscribe, read, () => false), write];
}
