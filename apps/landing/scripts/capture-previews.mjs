// Screenshot every project's live site for its info card.
//
//   pnpm previews                 all projects
//   ONLY=habits,marvel pnpm previews
//
// Each site is captured at 1280x800, then re-encoded in the browser (canvas →
// WebP) at 800x500 into public/previews/<slug>.webp. Point the project's
// `preview` field at the file afterwards (src/data/projects.ts).

/* global document, window, getComputedStyle, Image -- used inside page.evaluate, which runs in the browser */

import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUT_W = 800;
const OUT_H = 500;
const QUALITY = 0.8;

// Read slug + liveUrl pairs straight from the data file (no TS loader needed).
const source = await readFile(`${root}src/data/projects.ts`, 'utf8');
const pairs = [...source.matchAll(/slug: '([^']+)'[\s\S]*?liveUrl: '([^']+)'/g)].map((m) => ({
  slug: m[1],
  url: m[2],
}));
const only = process.env.ONLY?.split(',').filter(Boolean);
const targets = only ? pairs.filter((p) => only.includes(p.slug)) : pairs;

await mkdir(`${root}public/previews`, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const encoder = await context.newPage();
await encoder.setContent('<canvas></canvas>');

const results = [];
for (const { slug, url } of targets) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30_000 });
    await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(1_500);
    // Show the top of the page as a first-time visitor sees it: no autofocused
    // field scrolling it down, and no cookie notice over the content (hidden,
    // not answered).
    await page.evaluate(() => {
      document.activeElement?.blur?.();
      for (const el of document.querySelectorAll('body *')) {
        const style = getComputedStyle(el);
        if (
          (style.position === 'fixed' || style.position === 'sticky') &&
          /cookie/i.test(el.textContent ?? '')
        ) {
          el.style.setProperty('display', 'none', 'important');
        }
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const png = await page.screenshot({ type: 'png' });
    const dataUrl = await encoder.evaluate(
      async ({ b64, w, h, q }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const canvas = document.querySelector('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        return canvas.toDataURL('image/webp', q);
      },
      { b64: png.toString('base64'), w: OUT_W, h: OUT_H, q: QUALITY }
    );
    const webp = Buffer.from(dataUrl.split(',')[1], 'base64');
    await writeFile(`${root}public/previews/${slug}.webp`, webp);
    results.push(`${slug.padEnd(16)} ${(webp.length / 1024).toFixed(1)} KB  ${url}`);
  } catch (error) {
    results.push(`${slug.padEnd(16)} FAILED  ${url}  ${error.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(results.join('\n'));
