import { describe, expect, it } from 'vitest';
import { emptyProgress, loadProgress, sanitizeProgress, saveProgress, STORAGE_KEY } from './persist';

const memory = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
};

const throwing = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

describe('progress persistence', () => {
  it('round-trips through storage', () => {
    const store = memory();
    const progress = {
      ...emptyProgress(),
      discovered: { manuscript: ['cinetech', 'habits'] },
      secrets: ['noir:rooftop-line'],
      lastWorld: 'noir' as const,
    };
    saveProgress(progress, store);
    expect(store.data.has(STORAGE_KEY)).toBe(true);
    expect(loadProgress(store)).toEqual(progress);
  });

  it('works when storage throws or is missing', () => {
    expect(loadProgress(throwing)).toEqual(emptyProgress());
    expect(() => saveProgress(emptyProgress(), throwing)).not.toThrow();
    expect(loadProgress(null)).toEqual(emptyProgress());
  });

  it('survives corrupt data', () => {
    const store = memory();
    store.setItem(STORAGE_KEY, '{not json');
    expect(loadProgress(store)).toEqual(emptyProgress());
  });

  it('drops unknown worlds, projects and types', () => {
    const clean = sanitizeProgress({
      discovered: { manuscript: ['cinetech', 'cinetech', 'gone', 7], atlantis: ['habits'] },
      secrets: ['a', 'a', 3],
      lastWorld: 'atlantis',
    });
    expect(clean).toEqual({
      ...emptyProgress(),
      discovered: { manuscript: ['cinetech'] },
      secrets: ['a'],
    });
  });
});
