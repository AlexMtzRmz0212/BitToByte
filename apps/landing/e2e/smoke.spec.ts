import { type Page } from '@playwright/test';
import { projects, type Project } from '../src/data/projects';
import { SECRETS, WORLDS, WORLD_IDS } from '../src/data/worlds';
import { expect, firstVisit, test } from './fixtures';

const liveProjects = projects.filter((p): p is Project & { liveUrl: string } => p.liveUrl !== null);
const codeOnlyProjects = projects.filter((p) => p.liveUrl === null);

const worldTransform = (page: Page) =>
  page.locator('.map-world').evaluate((el) => (el as HTMLElement).style.transform);

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the prerendered hub explains the studio and links every project', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The Citadel');
    // The prerender also carries the (hidden without JS) welcome, which repeats this copy.
    const intro = page.locator('.intro-card');
    await expect(intro.getByText('Intelligent Systems Hub')).toBeVisible();
    await expect(intro.getByText('Open to roles and collaborations')).toBeVisible();
    await expect(page.locator('#welcome')).toBeHidden();
    for (const project of projects) {
      await expect(page.getByText(project.name, { exact: true }).first()).toBeVisible();
      await expect(page.getByText(project.oneLiner)).toBeVisible();
    }
    for (const project of liveProjects) {
      await expect(page.getByRole('link', { name: `Launch ${project.name}` })).toHaveAttribute('href', project.liveUrl);
    }
    for (const project of codeOnlyProjects) {
      await expect(page.getByRole('link', { name: `Code for ${project.name}` })).toHaveAttribute('href', project.repoUrl!);
    }
    await expect(page.getByRole('link', { name: /Résumé and profile/ })).toHaveAttribute('href', 'https://alex.bittobyte.qzz.io');
    await expect(page.getByRole('link', { name: /Résumé and profile/ })).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
  });

  test('the prerendered document has exactly one h1, a canonical link and no noindex', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bittobyte.qzz.io/');
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });
});

test('a returning visitor opens straight on the map, and About brings the intro card back', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-world', 'nexus');
  await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
  await expect(page.locator('#welcome')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Start exploring' })).toHaveCount(0);
  await page.getByRole('button', { name: 'About BitToByte' }).click();
  await expect(page.getByRole('button', { name: 'Start exploring' })).toBeVisible();
  await page.getByRole('button', { name: 'Start exploring' }).click();
  await expect(page.getByRole('button', { name: 'Start exploring' })).toHaveCount(0);
});

test('Show the list opens the full list, with a résumé link, and Back returns to the hub', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /^(Show the )?list$/i }).click();
  await expect(page).toHaveURL(/\?view=list$/);
  await expect(page.getByRole('main').getByRole('link', { name: /Résumé/ })).toHaveAttribute('href', 'https://alex.bittobyte.qzz.io');
  await expect(page.getByRole('link', { name: /^Launch live project/ })).toHaveCount(liveProjects.length);
  await expect(page.getByRole('link', { name: /^View code for/ })).toHaveCount(codeOnlyProjects.length);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
});

firstVisit.describe('the welcome', () => {
  const welcome = (page: Page) => page.locator('#welcome');

  firstVisit('greets a first visit with two ways to see the projects and a résumé extra, over the Citadel', async ({ page }) => {
    await page.goto('/');
    await expect(welcome(page)).toBeVisible();
    await expect(welcome(page).locator('.welcome-doors > li')).toHaveCount(2);
    await expect(welcome(page).getByRole('heading', { level: 2, name: 'BitToByte', exact: true })).toBeVisible();
    await expect(welcome(page).getByRole('button', { name: /^Enter the Citadel/ })).toBeVisible();
    await expect(welcome(page).getByRole('link', { name: /^Just the projects/ })).toHaveAttribute('href', '/?view=list');
    await expect(welcome(page).getByRole('link', { name: /^Résumé/ })).toHaveAttribute('href', 'https://alex.bittobyte.qzz.io');
    // Nothing behind it can be reached until a door is picked.
    await expect(page.locator('.app-behind')).toHaveJSProperty('inert', true);
  });

  firstVisit('the Citadel door opens the map, and the welcome stays gone on the next visit', async ({ page }) => {
    await page.goto('/');
    await welcome(page).getByRole('button', { name: /^Enter the Citadel/ }).click();
    await expect(welcome(page)).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
    await expect(page.locator('.app-behind')).toHaveJSProperty('inert', false);
    await page.reload();
    await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
  });

  firstVisit('the projects door opens the list, and Back does not bring the welcome back', async ({ page }) => {
    await page.goto('/');
    await welcome(page).getByRole('link', { name: /^Just the projects/ }).click();
    await expect(page).toHaveURL(/\?view=list$/);
    await expect(page.getByRole('link', { name: /^Launch live project/ })).toHaveCount(liveProjects.length);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
  });

  firstVisit('the résumé link counts as welcomed too', async ({ page }) => {
    await page.goto('/');
    // The résumé is another site: stand in a blank page for it.
    await page.route('https://alex.bittobyte.qzz.io/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>résumé</title>' })
    );
    await welcome(page).getByRole('link', { name: /^Résumé/ }).click();
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
  });

  firstVisit('deep links skip it', async ({ page }) => {
    await page.goto('/?world=gotham');
    await expect(page.locator('html')).toHaveAttribute('data-world', 'noir');
    await expect(welcome(page)).toHaveCount(0);
    await page.goto('/?view=list');
    await expect(page.getByRole('link', { name: /^Launch live project/ }).first()).toBeVisible();
    await expect(welcome(page)).toHaveCount(0);
  });

  test('/?welcome shows it even to a visitor who has seen it, and picking a door cleans the URL', async ({ page }) => {
    await page.goto('/?welcome');
    await expect(welcome(page)).toBeVisible();
    await welcome(page).getByRole('button', { name: /^Enter the Citadel/ }).click();
    await expect(welcome(page)).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
  });

  firstVisit('works on a phone without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await page.goto('/');
    await expect(welcome(page)).toBeVisible();
    await expect(welcome(page).getByRole('button', { name: /^Enter the Citadel/ })).toBeInViewport();
    const overflow = await welcome(page).evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test('every portal leads to its world and re-themes the page', async ({ page }) => {
  // Six round trips, each a walk to a gate plus a rift: a long journey.
  test.setTimeout(180_000);
  await page.goto('/');
  for (const id of WORLD_IDS) {
    await page.getByRole('button', { name: new RegExp(`^Portal to ${WORLDS[id].name}`) }).click();
    await expect(page.locator('html')).toHaveAttribute('data-world', id, { timeout: 15_000 });
    await expect(page).toHaveURL(new RegExp(`world=${WORLDS[id].slug}`));
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute('data-world', 'nexus', { timeout: 15_000 });
  }
});

test('every project is one click from the travel list, and Launch carries its live URL', async ({ page, isMobile }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  // On phones the list is a folded sheet: one tap opens it.
  if (isMobile) await page.getByRole('button', { name: 'Open the travel list' }).click();
  for (const project of liveProjects) {
    await expect(page.getByRole('link', { name: `Launch ${project.name}` })).toHaveAttribute('href', project.liveUrl);
  }
  for (const project of codeOnlyProjects) {
    await expect(page.getByRole('link', { name: `Code for ${project.name}` })).toHaveAttribute('href', project.repoUrl!);
  }
  const target = liveProjects[0]!;
  await page.getByRole('link', { name: new RegExp(`^Travel to ${target.name}`) }).click();
  await expect(page.locator('html')).toHaveAttribute('data-world', target.world, { timeout: 15_000 });
  await expect(page).toHaveURL(new RegExp(`project=${target.slug}`));
  await expect(page.getByRole('link', { name: `Launch live project: ${target.name}` }).first()).toHaveAttribute(
    'href',
    target.liveUrl,
    { timeout: 15_000 }
  );
});

test('dragging pans and the wheel zooms the map', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mouse gestures');
  await page.goto('/');
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
  const map = page.getByRole('region', { name: 'Map of The Citadel' });
  await map.focus();
  await page.waitForTimeout(700);
  const before = await worldTransform(page);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('+');
  await page.waitForTimeout(400);
  expect(await worldTransform(page)).not.toBe(before);
});

firstVisit('the page works when storage is blocked', async ({ page }) => {
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
  // With nothing remembered, every visit starts at the welcome.
  await page.getByRole('button', { name: /^Enter the Citadel/ }).click();
  await expect(page.getByRole('region', { name: 'Map of The Citadel' })).toBeVisible();
  await page.getByRole('link', { name: /^(Show the )?list$/i }).click();
  await expect(page.getByRole('link', { name: /^Launch live project/ }).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test.describe('world maps', () => {
  test('a deep link opens the project card on its world map', async ({ page }) => {
    await page.goto('/?world=blackwater&project=habits');
    await expect(page.locator('html')).toHaveAttribute('data-world', 'frontier');
    await expect(page.getByRole('region', { name: 'Map of Blackwater' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Habits', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Launch live project: Habits' })).toHaveAttribute(
      'href',
      'https://habits.bittobyte.qzz.io'
    );
  });

  test('a project with no live site leads with its code', async ({ page }) => {
    await page.goto('/?world=blackwater&project=loop-habits');
    await expect(page.getByRole('heading', { name: 'Loop Habits Fork', exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('link', { name: 'View code for Loop Habits Fork' })).toHaveAttribute(
      'href',
      'https://github.com/AlexMtzRmz0212/uhabits/tree/mine'
    );
    await expect(page.getByRole('link', { name: 'Launch live project: Loop Habits Fork' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Open Loop Habits Fork in a new tab' })).toHaveCount(0);
  });

  test('clicking a landmark travels there and opens its card', async ({ page }) => {
    await page.goto('/?world=manuscript');
    await page.getByRole('button', { name: /^Travel to FedEthics/ }).click();
    await expect(page.getByRole('heading', { name: 'FedEthics', exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/project=fedethics/);
    // Closing the card keeps you on the map.
    await page.getByRole('button', { name: 'Close and keep exploring' }).click();
    await expect(page.getByRole('heading', { name: 'FedEthics', exact: true })).toHaveCount(0);
    await expect(page).not.toHaveURL(/project=/);
  });

  test('Escape closes the card and hands focus back to the marker', async ({ page }) => {
    await page.goto('/?world=manuscript');
    await page.getByRole('button', { name: /^Travel to FedEthics/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'FedEthics', exact: true })).toBeFocused({ timeout: 15_000 });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'FedEthics', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Travel to FedEthics/ })).toBeFocused();
  });

  test.describe('with reduced motion', () => {
    test('worlds open as a list, with the map one click away', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/?world=manuscript');
      await expect(page.getByRole('heading', { level: 1, name: 'Hogwarts, as a list' })).toBeVisible();
      await page.getByRole('link', { name: 'Show the map' }).click();
      await expect(page.getByRole('region', { name: 'Map of Hogwarts' })).toBeVisible();
    });
  });
});

test.describe('slow or broken networks', () => {
  const voxelChunk = /\/assets\/voxel-[\w-]+\.js$/;

  test('a portal never stays shut while a map downloads slowly', async ({ page }) => {
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route(voxelChunk, async (route) => {
      await held;
      await route.continue();
    });
    await page.goto('/');
    await page.getByRole('button', { name: /^Portal to Overworld/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-world', 'voxel', { timeout: 15_000 });
    await expect(page.getByText('Opening Overworld…')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Show its projects as a list' })).toBeVisible();
    release();
    await expect(page.getByRole('region', { name: 'Map of Overworld' })).toBeVisible({ timeout: 15_000 });
  });

  test('a map that fails to load falls back to the list', async ({ page }) => {
    await page.route(voxelChunk, (route) => route.abort());
    await page.goto('/');
    await page.getByRole('button', { name: /^Portal to Overworld/ }).click();
    await expect(page.getByText('That map didn’t load, so here is everything as a list.')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('link', { name: /^Launch live project/ }).first()).toBeVisible();
  });
});

test('every secret can be found (by keyboard too) and counts on the hub', async ({ page }) => {
  test.setTimeout(180_000);
  for (const id of WORLD_IDS) {
    await page.goto(`/?world=${id}`);
    const spot = page.getByRole('button', { name: 'Something curious' });
    await spot.focus();
    await page.keyboard.press('Enter');
    // Wait for this secret's own note: on the way there you may finish the world first, which shows a different one.
    await expect(page.locator('.secret-note').filter({ hasText: SECRETS[id].title })).toBeVisible({ timeout: 15_000 });
    await page.waitForTimeout(400);
  }
  await page.goto('/');
  await expect(page.getByText(`Secrets found: ${WORLD_IDS.length} of ${WORLD_IDS.length}.`)).toBeAttached();
});

test.describe('Vice City, Los Santos and Leonida', () => {
  test('opens as Vice City, flies to Los Santos and back, and remembers the choice', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/?world=los-santos&view=map');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'vice');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Vice City');

    await page.getByRole('button', { name: 'Fly to Los Santos' }).click();
    await expect(page.locator('.flight')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'santos', { timeout: 15_000 });
    await expect(page.locator('.flight')).toHaveCount(0, { timeout: 15_000 });
    await expect(page).toHaveURL(/theme=santos/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Los Santos');

    // The choice is remembered: the plain link opens Los Santos now.
    await page.goto('/?world=los-santos&view=map');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'santos');
    await page.getByRole('button', { name: 'Fly to Vice City' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'vice', { timeout: 15_000 });
    await expect(page.locator('.flight')).toHaveCount(0, { timeout: 15_000 });
  });

  test('a theme named in the link wins over the default', async ({ page }) => {
    await page.goto('/?world=los-santos&theme=santos&view=map');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'santos');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Los Santos');
  });

  test('the travel list leads to Leonida, and its gate back to Vice City', async ({ page, isMobile }) => {
    test.setTimeout(90_000);
    await page.goto('/?world=los-santos&view=map');
    if (isMobile) await page.getByRole('button', { name: 'Open the travel list' }).click();
    await page.getByRole('link', { name: /^Travel to Leonida/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-world', 'leonida', { timeout: 20_000 });
    await expect(page).toHaveURL(/world=leonida/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Leonida');
    await page.getByRole('button', { name: /^Portal to Vice City/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-world', 'sunset', { timeout: 20_000 });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'vice');
  });

  test('the highway gate on the map leads to Leonida too', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the gate is off screen on a phone: the travel list is the way there');
    test.setTimeout(90_000);
    await page.goto('/?world=los-santos&view=map');
    await page.getByRole('button', { name: /^Portal to Leonida/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-world', 'leonida', { timeout: 20_000 });
  });

  test('with reduced motion the switch still works (a quick fade, no plane)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?world=los-santos&view=list');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'vice');
    await page.getByRole('button', { name: 'Fly to Los Santos' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'santos', { timeout: 10_000 });
    await expect(page.locator('.flight')).toHaveCount(0, { timeout: 10_000 });
  });
});
