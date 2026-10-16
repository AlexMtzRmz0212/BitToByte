// The link-preview image (public/og.png, 1200x630), drawn from the real hub map.
//
//   pnpm build && pnpm preview   (in another terminal)
//   pnpm og
//
// Step 1 photographs the bare hub map (no HUD) in a narrow viewport, where the
// camera fits all four portals. Step 2 lays it beside the title on a 1200x630
// card in the hub's own fonts and colors, and saves the PNG.

/* global document -- used inside page.evaluate, which runs in the browser */

import { chromium } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.BASE_URL ?? 'http://localhost:4173';
const out = fileURLToPath(new URL('../public/og.png', import.meta.url));
const assets = fileURLToPath(new URL('../dist/assets/', import.meta.url));
const HIDE = `.hud-top, .travel-panel, .world-dock, .map-tools, .compass, .map-hint, .skip-link, .edge-chip,
  [class*='dock'] { visibility: hidden !important; }`;

const browser = await chromium.launch();

// 1. The map. Phones reserve 64px on top for the HUD and 150px below for the
// folded travel sheet; crop to what's left.
const shoot = await browser.newPage({ viewport: { width: 600, height: 800 }, deviceScaleFactor: 2 });
await shoot.goto(`${base}/`);
await shoot.getByRole('button', { name: 'Start exploring' }).click();
await shoot.addStyleTag({ content: HIDE });
await shoot.waitForTimeout(2500);
const map = await shoot.screenshot({ clip: { x: 0, y: 64, width: 600, height: 586 } });
await shoot.close();

// 2. The card, on a blank page with the hub's typeface embedded from the build.
const fontFile = (await readdir(assets)).find((f) => /^bricolage-grotesque-latin-opsz-normal-.*\.woff2$/.test(f));
const font = (await readFile(assets + fontFile)).toString('base64');
const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await card.setContent('<!doctype html><html><body style="margin:0"></body></html>');
await card.evaluate(async ({ src, font }) => {
  const el = document.createElement('div');
  el.innerHTML = `
    <style>
      @font-face { font-family: 'Bricolage Grotesque Variable'; font-weight: 200 800;
        src: url(data:font/woff2;base64,${font}) format('woff2'); }
      #og { position: fixed; inset: 0; z-index: 9999; display: grid; grid-template-columns: 520px 1fr;
        background: #030712; color: #F3F6F4;
        font-family: 'Bricolage Grotesque Variable', system-ui, sans-serif; overflow: hidden; }
      #og .text { padding: 72px 0 64px 72px; display: flex; flex-direction: column; }
      #og .tile { width: 64px; height: 64px; border-radius: 16px; background: #2563EB; display: grid; place-items: center;
        font-weight: 700; font-size: 38px; color: #fff; }
      #og h1 { margin: 36px 0 0; font-size: 84px; line-height: 0.95; font-weight: 750; letter-spacing: -0.03em; }
      #og .og-tag { margin: 18px 0 0; font-size: 32px; color: #8EE04B; font-weight: 600; }
      #og .line { margin: auto 0 0; font-size: 24px; line-height: 1.35; color: #B8C2BC; max-width: 440px; text-wrap: balance; }
      #og .map { position: relative; }
      /* Flush right; the left edge fades into the title side. */
      #og .map img { position: absolute; right: 0; top: -5px; width: 655px; height: 640px;
        -webkit-mask-image: linear-gradient(to right, transparent 0, #000 24px); mask-image: linear-gradient(to right, transparent 0, #000 24px); }
    </style>
    <div id="og">
      <div class="text">
        <div class="tile">B</div>
        <h1>BitToByte</h1>
        <p class="og-tag">Intelligent Systems Hub</p>
        <p class="line">Eleven live projects across four worlds. Travel the map, or skip straight to the list.</p>
      </div>
      <div class="map"><img src="${src}" alt=""></div>
    </div>`;
  document.body.append(el);
  await document.fonts.ready;
  await el.querySelector('img').decode();
}, { src: `data:image/png;base64,${map.toString('base64')}`, font });
await card.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
