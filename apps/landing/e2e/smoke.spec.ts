import { expect, test } from '@playwright/test';
import { projects } from '../src/data/projects';
import { WORLD_IDS } from '../src/data/worlds';

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the prerendered Nexus explains the studio and links every project', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('BitToByte');
    await expect(page.getByText('Intelligent Systems Hub').first()).toBeVisible();
    for (const project of projects) {
      await expect(page.getByRole('heading', { name: project.name, exact: true })).toBeVisible();
      await expect(page.getByText(project.oneLiner)).toBeVisible();
      await expect(page.locator(`a[href="${project.liveUrl}"]`).first()).toBeAttached();
    }
    await expect(page.locator('a[href="https://alex.bittobyte.qzz.io"]').first()).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
  });
});

test('Skip the map opens the full list, and Back returns to the Nexus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Skip the map' }).click();
  await expect(page).toHaveURL(/\?view=list$/);
  await expect(page.getByRole('link', { name: /^Launch live project/ })).toHaveCount(projects.length);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BitToByte');
});

test('deep links re-theme the whole page', async ({ page }) => {
  for (const id of WORLD_IDS) {
    await page.goto(`/?world=${id}&view=list`);
    await expect(page.locator('html')).toHaveAttribute('data-world', id);
    await expect(page.getByRole('link', { name: /^Launch live project/ })).toHaveCount(projects.length);
  }
});

test('every launch link points at the confirmed live URL', async ({ page }) => {
  await page.goto('/?view=list');
  for (const project of projects) {
    await expect(
      page.getByRole('link', { name: `Launch live project: ${project.name}` })
    ).toHaveAttribute('href', project.liveUrl);
  }
});

test('the page works when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('SecurityError: storage blocked');
      },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Explore the map' })).toBeVisible();
  await page.getByRole('link', { name: 'Skip the map' }).click();
  await expect(page.getByRole('link', { name: /^Launch live project/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});
