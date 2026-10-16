// Build step 3 of 3 (after `vite build` and `vite build --ssr`).
//
// Renders the Nexus to HTML with the server bundle and writes it into
// dist/index.html, together with the world-token stylesheet and the JSON-LD
// that describes the studio and its projects. The result is what crawlers,
// LinkedIn previews and visitors without JavaScript see.
//
// It also adds a tiny script that, on a deep link (?world=noir), starts
// fetching that world's map chunk alongside the main bundle instead of after it.

import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const distIndex = new URL('dist/index.html', root);
const serverEntry = new URL('.ssr/entry-server.js', root);
const manifestDir = new URL('dist/.vite/', root);

const { render, buildThemeCss, projects, site, worlds } = await import(serverEntry.href);

const appHtml = render();

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#org`,
      name: site.name,
      url: `${site.url}/`,
      slogan: site.tagline,
      founder: { '@id': `${site.url}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.owner.name,
      jobTitle: site.owner.role,
      url: site.profileUrl,
      sameAs: [site.contact.linkedin, site.contact.github],
    },
    {
      '@type': 'ItemList',
      name: 'BitToByte projects',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.name,
          description: project.oneLiner,
          url: project.liveUrl,
          ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
          creator: { '@id': `${site.url}/#person` },
        },
      })),
    },
  ],
};

// JSON in a <script> must not be able to close the tag.
const safeJson = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

// Each lazily loaded world: its chunk plus the shared chunks and CSS it pulls in.
const manifest = JSON.parse(await readFile(new URL('manifest.json', manifestDir), 'utf8'));
const worldChunks = {};
for (const [key, entry] of Object.entries(manifest)) {
  const world = /^src\/worlds\/(\w+)\/index\.ts$/.exec(key)?.[1];
  if (!world || !entry.isDynamicEntry) continue;
  const js = new Set();
  const css = new Set();
  const walk = (k) => {
    const e = manifest[k];
    // The main bundle is already on its way.
    if (!e || e.isEntry || js.has(`/${e.file}`)) return;
    js.add(`/${e.file}`);
    (e.css ?? []).forEach((c) => css.add(`/${c}`));
    (e.imports ?? []).forEach(walk);
  };
  walk(key);
  // Keyed by the world's URL slug; links with the old id map through `ids` below.
  worldChunks[worlds[world].slug] = { js: [...js], css: [...css] };
}
const ids = Object.fromEntries(Object.values(worlds).map((w) => [w.id, w.slug]));
const preload = `<script>(function(){var m=${JSON.stringify(worldChunks)},ids=${JSON.stringify(ids)};var q=new URLSearchParams(location.search),k=q.get('world');var w=m[k]||m[ids[k]];if(!w||q.get('view')==='list')return;function add(r,h,a){var l=document.createElement('link');l.rel=r;l.href=h;if(a)l.as=a;document.head.appendChild(l);}w.js.forEach(function(h){add('modulepreload',h);});w.css.forEach(function(h){add('preload',h,'style');});})();</script>`;

let html = await readFile(distIndex, 'utf8');
const replace = (marker, value) => {
  if (!html.includes(marker)) throw new Error(`prerender: marker ${marker} not found in dist/index.html`);
  html = html.replace(marker, () => value);
};
replace('<!--app-html-->', appHtml);
replace('<!--world-tokens-->', `<style id="world-tokens">${buildThemeCss()}</style>`);
replace('<!--head-extra-->', `${preload}<script type="application/ld+json">${safeJson}</script>`);

await writeFile(distIndex, html);
await rm(new URL('.ssr/', root), { recursive: true, force: true });
await rm(manifestDir, { recursive: true, force: true });

console.log(
  `prerender: wrote ${fileURLToPath(distIndex)} (${(appHtml.length / 1024).toFixed(1)} KB of app HTML, ${projects.length} projects, preloads for ${Object.keys(worldChunks).join(', ')})`
);
