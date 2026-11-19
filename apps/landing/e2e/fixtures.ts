import { test as base, expect } from '@playwright/test';
import { STORAGE_KEY } from '../src/state/persist';

/**
 * The default `test` is a returning visitor: the welcome has been seen, so `/`
 * opens straight on the Citadel. Use `firstVisit` for a visitor with nothing stored.
 */
export const test = base.extend({
  // `provide` is Playwright's `use`, renamed so the React hooks lint rule leaves it alone.
  page: async ({ page }, provide) => {
    await page.addInitScript((key) => {
      try {
        if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ v: 1, introSeen: true }));
      } catch {
        /* storage blocked: the test is about exactly that */
      }
    }, STORAGE_KEY);
    await provide(page);
  },
});

export const firstVisit = base;
export { expect };
