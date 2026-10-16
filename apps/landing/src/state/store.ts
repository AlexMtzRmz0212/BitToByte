import { useSyncExternalStore } from 'react';

// A tiny external store. React subscribes through useSyncExternalStore; anything
// that runs every frame (camera, traveler, particles) reads and writes the DOM
// directly and never goes through here.

export interface Store<T> {
  get: () => T;
  set: (patch: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(patch) {
      const next = typeof patch === 'function' ? patch(state) : patch;
      state = { ...state, ...next };
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** Subscribe to a slice. The selector must return a primitive or a stable reference. */
export function useStore<T, U>(store: Store<T>, selector: (state: T) => U): U {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get())
  );
}
