// Build step 3 of 3 (after `vite build` and `vite build --ssr`).
//
// The portfolio is a client-rendered SPA, which leaves a crawler an empty
// <div id="root"> and one title for every URL. This renders each route with the
// server bundle and writes it as its own static file, with that route's title,
// description, canonical URL, Open Graph / Twitter tags and JSON-LD in the head:
//
//   /            -> dist/index.html
//   /work        -> dist/work/index.html
//   /work/<slug> -> dist/work/<slug>/index.html
//   (unknown)    -> dist/404.html, which Vercel serves with a real 404 status
//
// It also writes dist/sitemap.xml from the same route list.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const serverEntry = new URL('.ssr/entry-server.js', root);

const { render, metaForPath, sitemapPaths, SITE_URL, SITE_NAME, OG_IMAGE } = await import(serverEntry.href);

const template = await readFile(new URL('index.html', dist), 'utf8');
if (!template.includes('<!--page-head-->')) throw new Error('prerender: marker <!--page-head--> not found in dist/index.html');
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// JSON in a <script> must not be able to close the tag.
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function headFor(meta) {
  const isArticle = meta.path?.startsWith('/work/');
  const lines = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.path != null && `<link rel="canonical" href="${SITE_URL}${meta.path}" />`,
    `<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    meta.path != null && `<meta property="og:url" content="${SITE_URL}${meta.path}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE.url}" />`,
    `<meta name="twitter:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
    meta.jsonLd && `<script type="application/ld+json">${safeJson(meta.jsonLd)}</script>`,
  ];
  return lines.filter(Boolean).join('\n    ');
}

function page(pathname) {
  const meta = metaForPath(pathname);
  let html = template
    // index.html keeps a static title and description (and a comment saying so) for the
    // dev server; the route's own replace them.
    .replace(/<!-- Dev-server fallback[\s\S]*?-->\s*/, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '');
  html = html.replace('<!--page-head-->', () => headFor(meta));
  html = html.replace('<div id="root"></div>', () => `<div id="root">${render(pathname)}</div>`);
  return html;
}

const writeRoute = async (pathname) => {
  const html = page(pathname);
  const target = pathname === '/' ? new URL('index.html', dist) : new URL(`${pathname.slice(1)}/index.html`, dist);
  await mkdir(new URL('./', target), { recursive: true });
  await writeFile(target, html);
  return html;
};

const paths = sitemapPaths();
for (const pathname of paths) await writeRoute(pathname);

// The 404: the same app at a path that matches no route, with no canonical and no JSON-LD.
await writeFile(new URL('404.html', dist), page('/404'));

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paths.map((p) => `  <url>\n    <loc>${SITE_URL}${p === '/' ? '/' : p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`).join('') +
  `</urlset>\n`;
await writeFile(new URL('sitemap.xml', dist), sitemap);

await rm(new URL('.ssr/', root), { recursive: true, force: true });

console.log(`prerender: wrote ${paths.length} routes + 404.html + sitemap.xml to ${fileURLToPath(dist)}`);
