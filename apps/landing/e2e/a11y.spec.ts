import { AxeBuilder } from '@axe-core/playwright';
import { type Page } from '@playwright/test';
import { WORLD_IDS } from '../src/data/worlds';
import { expect, firstVisit, test } from './fixtures';

// axe on every kind of screen, in every world's theme. Serious and critical
// issues fail the run. (The shared footer from packages/ui has two unnamed
// <nav>s, a moderate best-practice finding that is fixed there, not here.)

const CARD: Record<(typeof WORLD_IDS)[number], string> = {
  manuscript: 'fedethics',
  voxel: 'ai-task-sorter',
  noir: 'cinetech',
  pop: 'marvel',
  frontier: 'habits',
  sunset: 'eastcoast-ev',
};

async function expectNoSeriousIssues(page: Page) {
  // Let entrance animations settle so contrast is measured on final colors.
  await page.waitForTimeout(1500);
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const serious = violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(serious).toEqual([]);
}

firstVisit('the welcome, then the hub', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#welcome')).toBeVisible();
  await expectNoSeriousIssues(page);
  await page.getByRole('button', { name: /^Enter the Citadel/ }).click();
  await expectNoSeriousIssues(page);
});

test('the hub, with and without the intro card', async ({ page }) => {
  await page.goto('/');
  await expectNoSeriousIssues(page);
  await page.getByRole('button', { name: 'About BitToByte' }).click();
  await expect(page.getByRole('button', { name: 'Start exploring' })).toBeVisible();
  await expectNoSeriousIssues(page);
});

test('the full list', async ({ page }) => {
  await page.goto('/?view=list');
  await expectNoSeriousIssues(page);
});

for (const id of WORLD_IDS) {
  test(`${id}: map, list and a project card`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(`/?world=${id}&view=map`);
    await expect(page.locator(`.map-screen[data-place="${id}"]`)).toBeVisible({ timeout: 15_000 });
    await expectNoSeriousIssues(page);
    await page.goto(`/?world=${id}&view=list`);
    await expectNoSeriousIssues(page);
    await page.goto(`/?world=${id}&project=${CARD[id]}`);
    await expect(page.locator('#card-title')).toBeVisible({ timeout: 15_000 });
    await expectNoSeriousIssues(page);
  });
}

// The sunset world's other theme, and the state map beyond Vice City.
test('Los Santos (the alternate theme): map, list and a project card', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/?world=los-santos&theme=santos&view=map');
  await expect(page.locator('.map-screen[data-place="sunset"]')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'santos');
  await expectNoSeriousIssues(page);
  await page.goto('/?world=los-santos&theme=santos&view=list');
  await expectNoSeriousIssues(page);
  await page.goto(`/?world=los-santos&theme=santos&project=${CARD.sunset}`);
  await expect(page.locator('#card-title')).toBeVisible({ timeout: 15_000 });
  await expectNoSeriousIssues(page);
});

test('Leonida: the state map', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/?world=leonida');
  await expect(page.locator('.map-screen[data-place="leonida"]')).toBeVisible({ timeout: 15_000 });
  await expectNoSeriousIssues(page);
});
