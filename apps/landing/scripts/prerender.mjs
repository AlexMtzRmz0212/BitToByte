// Build step 3 of 3 (after `vite build` and `vite build --ssr`).
//
// Renders the Nexus to HTML with the server bundle and writes it into
// dist/index.html, together with the world-token stylesheet and the JSON-LD
// that describes the studio and its projects. The result is what crawlers,
// LinkedIn previews and visitors without JavaScript see.

import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const distIndex = new URL('dist/index.html', root);
const serverEntry = new URL('.ssr/entry-server.js', root);

const { render, buildThemeCss, projects, site } = await import(serverEntry.href);

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

let html = await readFile(distIndex, 'utf8');
const replace = (marker, value) => {
  if (!html.includes(marker)) throw new Error(`prerender: marker ${marker} not found in dist/index.html`);
  html = html.replace(marker, () => value);
};
replace('<!--app-html-->', appHtml);
replace('<!--world-tokens-->', `<style id="world-tokens">${buildThemeCss()}</style>`);
replace('<!--head-extra-->', `<script type="application/ld+json">${safeJson}</script>`);

await writeFile(distIndex, html);
await rm(new URL('.ssr/', root), { recursive: true, force: true });

console.log(
  `prerender: wrote ${fileURLToPath(distIndex)} (${(appHtml.length / 1024).toFixed(1)} KB of app HTML, ${projects.length} projects)`
);
