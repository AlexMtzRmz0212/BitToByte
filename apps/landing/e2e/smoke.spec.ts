import { expect, test, type Page } from '@playwright/test';
import { projects } from '../src/data/projects';
import { WORLDS, WORLD_IDS } from '../src/data/worlds';

const worldTransform = (page: Page) =>
  page.locator('.map-world').evaluate((el) => (el as HTMLElement).style.transform);

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the prerendered hub explains the studio and links every project', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The Nexus');
    await expect(page.getByText('Intelligent Systems Hub').first()).toBeVisible();
    await expect(page.getByText('Open to roles and collaborations')).toBeVisible();
    for (const project of projects) {
      await expect(page.getByText(project.name, { exact: true }).first()).toBeVisible();
      await expect(page.getByText(project.oneLiner)).toBeVisible();
      await expect(page.getByRole('link', { name: `Launch ${project.name}` })).toHaveAttribute('href', project.liveUrl);
    }
    await expect(page.getByRole('link', { name: /Résumé and profile/ })).toHaveAttribute('href', 'https://alex.bittobyte.qzz.io');
    await expect(page.getByRole('link', { name: /Résumé and profile/ })).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
  });
});

test('the hub opens on the map with the intro card', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-world', 'nexus');
  await expect(page.getByRole('region', { name: 'Map of The Nexus' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start exploring' })).toBeVisible();
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.getByRole('button', { name: 'Start exploring' })).toHaveCount(0);
  // It stays dismissed on the next visit.
  await page.reload();
  await expect(page.getByRole('region', { name: 'Map of The Nexus' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start exploring' })).toHaveCount(0);
});

test('Skip the map opens the full list, and Back returns to the hub', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Skip the map', exact: true }).click();
  await expect(page).toHaveURL(/\?view=list$/);
  await expect(page.getByRole('link', { name: /^Launch live project/ })).toHaveCount(projects.length);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('region', { name: 'Map of The Nexus' })).toBeVisible();
});

test('every portal leads to its world and re-themes the page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  for (const id of WORLD_IDS) {
    await page.getByRole('button', { name: new RegExp(`^Portal to ${WORLDS[id].name}`) }).click();
    await expect(page.locator('html')).toHaveAttribute('data-world', id, { timeout: 8000 });
    await expect(page).toHaveURL(new RegExp(`world=${id}`));
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute('data-world', 'nexus', { timeout: 8000 });
  }
});

test('every project is one click from the travel list, and Launch carries its live URL', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  // On phones the list is a folded sheet: one tap opens it.
  if (isMobile) await page.getByRole('button', { name: 'Open the travel list' }).click();
  for (const project of projects) {
    await expect(page.getByRole('link', { name: `Launch ${project.name}` })).toHaveAttribute('href', project.liveUrl);
  }
  const target = projects[0]!;
  await page.getByRole('link', { name: new RegExp(`^Travel to ${target.name}`) }).click();
  await expect(page.locator('html')).toHaveAttribute('data-world', target.world, { timeout: 8000 });
  await expect(page).toHaveURL(new RegExp(`project=${target.slug}`));
  await expect(page.getByRole('link', { name: `Launch live project: ${target.name}` }).first()).toHaveAttribute(
    'href',
    target.liveUrl
  );
});

test('dragging pans and the wheel zooms the map', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mouse gestures');
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await page.waitForTimeout(700);
  const before = await worldTransform(page);
  await page.mouse.move(700, 450);
  await page.mouse.down();
  await page.mouse.move(600, 380, { steps: 8 });
  await page.mouse.up();
  const afterDrag = await worldTransform(page);
  expect(afterDrag).not.toBe(before);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(100);
  const scale = (t: string) => Number(/scale\(([\d.]+)\)/.exec(t)?.[1]);
  expect(scale(await worldTransform(page))).toBeGreaterThan(scale(afterDrag));
});

test('the keyboard can pan and zoom the map', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exploring' }).click();
  const map = page.getByRole('region', { name: 'Map of The Nexus' });
  await map.focus();
  await page.waitForTimeout(700);
  const before = await worldTransform(page);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('+');
  await page.waitForTimeout(400);
  expect(await worldTransform(page)).not.toBe(before);
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
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await page.getByRole('link', { name: /Skip the map/ }).first().click();
  await expect(page.getByRole('link', { name: /^Launch live project/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test.describe('world maps', () => {
  test('a deep link opens the project card on its world map', async ({ page }) => {
    await page.goto('/?world=manuscript&project=habits');
    await expect(page.locator('html')).toHaveAttribute('data-world', 'manuscript');
    await expect(page.getByRole('region', { name: 'Map of Manuscript Realm' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Habits', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Launch live project: Habits' })).toHaveAttribute(
      'href',
      'https://habits.bittobyte.qzz.io'
    );
  });

  test('clicking a landmark travels there and opens its card', async ({ page }) => {
    await page.goto('/?world=manuscript');
    await page.getByRole('button', { name: /^Travel to FedEthics/ }).click();
    await expect(page.getByRole('heading', { name: 'FedEthics', exact: true })).toBeVisible({ timeout: 8000 });
    await expect(page).toHaveURL(/project=fedethics/);
    // Closing the card keeps you on the map.
    await page.getByRole('button', { name: 'Close and keep exploring' }).click();
    await expect(page.getByRole('heading', { name: 'FedEthics', exact: true })).toHaveCount(0);
    await expect(page).not.toHaveURL(/project=/);
  });

  test.describe('with reduced motion', () => {
    test('worlds open as a list, with the map one click away', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/?world=manuscript');
      await expect(page.getByRole('heading', { level: 1, name: 'Manuscript Realm, as a list' })).toBeVisible();
      await page.getByRole('link', { name: 'Show the map' }).click();
      await expect(page.getByRole('region', { name: 'Map of Manuscript Realm' })).toBeVisible();
    });
  });
});
