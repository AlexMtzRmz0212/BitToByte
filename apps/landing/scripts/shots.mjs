// Screenshots for review: every route at phone (390) and desktop (1440) width.
//
//   node scripts/shots.mjs [outDir]            (expects `vite preview` on :4173)
//   BASE_URL=http://localhost:5173 ROUTES="/,/?view=list" node scripts/shots.mjs
//
// Output goes to .shots/ (gitignored).

/* global document -- used inside page.evaluate, which runs in the browser */
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL ?? 'http://localhost:4173';
const outDir = process.argv[2] ?? '.shots/latest';
const routes = (process.env.ROUTES ?? '/,/?view=list,/?world=manuscript&view=list,/?world=noir&view=list,/?world=pop&view=list,/?world=voxel&view=list')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);
const fullPage = process.env.FULL === '1';
const reduced = process.env.REDUCED === '1';
const noJs = process.env.NOJS === '1';
// Optional: accessible names of buttons/links to click (in order) before the shot, separated by "|".
const clicks = (process.env.CLICK ?? '').split('|').filter(Boolean);
const suffix = process.env.SUFFIX ? `-${process.env.SUFFIX}` : '';

const sizes = [
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];

const slug = (route) =>
  route === '/' ? 'nexus' : route.replace(/^\/\?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const errors = [];
try {
  for (const size of sizes) {
    const context = await browser.newContext({
      ...size,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
      javaScriptEnabled: !noJs,
    });
    const page = await context.newPage();
    page.on('pageerror', (err) => errors.push(`${size.name} ${page.url()}: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`${size.name} ${page.url()}: console: ${msg.text()}`);
    });
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      if (!noJs) await page.evaluate(() => document.fonts.ready);
      for (const name of clicks) {
        await page.getByRole('button', { name, exact: true }).or(page.getByRole('link', { name, exact: true })).first().click();
        await page.waitForTimeout(400);
      }
      await page.waitForTimeout(Number(process.env.WAIT ?? 900));
      const file = `${outDir}/${slug(route)}${suffix}-${size.name}.png`;
      await page.screenshot({ path: file, fullPage });
      console.log(file);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
if (errors.length) {
  console.error(`\n${errors.length} page error(s):\n${errors.join('\n')}`);
  process.exitCode = 1;
}
