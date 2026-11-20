// SEO audit of a built site (run `pnpm build` first):
//   node scripts/seo-audit.mjs apps/landing/dist https://bittobyte.qzz.io
//   node scripts/seo-audit.mjs apps/portfolio/dist https://alex.bittobyte.qzz.io
// Checks every .html in dist: one h1, heading order, title, description, canonical, og:image,
// JSON-LD parses, no noindex, every <img> has alt, and internal links resolve to a built file.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const [dist, site] = process.argv.slice(2);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = async (p) => !!(await stat(p).catch(() => null));
async function resolves(pathname) {
  const clean = pathname.replace(/\/$/, '');
  if (clean === '') return exists(join(dist, 'index.html'));
  return (await exists(join(dist, clean, 'index.html'))) || (await exists(join(dist, clean))) || (await exists(join(dist, clean + '.html')));
}

let problems = 0;
const fail = (file, msg) => { problems++; console.log(`FAIL ${file}: ${msg}`); };

for (const file of await walk(dist)) {
  const rel = relative(dist, file).replace(/\\/g, '/');
  const html = await readFile(file, 'utf8');
  const is404 = rel === '404.html';
  const h = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  const isLegal = rel === 'terms.html' || rel === 'privacy.html';
  if (h.filter((n) => n === 1).length !== 1) fail(rel, `h1 count = ${h.filter((n) => n === 1).length}`);
  for (let i = 1; i < h.length; i++) if (h[i] > h[i - 1] + 1) fail(rel, `heading skips h${h[i - 1]} -> h${h[i]}`);
  if (h.length && h[0] !== 1) fail(rel, `first heading is h${h[0]}`);
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  const titleCount = (html.match(/<title>/g) || []).length;
  if (!title) fail(rel, 'no title'); else if (titleCount !== 1) fail(rel, `title count ${titleCount}`);
  const desc = /<meta\s+name="description"\s+content="([^"]*)"/.exec(html)?.[1];
  if (!desc) fail(rel, 'no description'); else if ((html.match(/name="description"/g) || []).length !== 1) fail(rel, 'duplicate description');
  const canon = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  if (!is404 && !canon) fail(rel, 'no canonical');
  if (canon && !canon.startsWith(site)) fail(rel, `canonical off-site ${canon}`);
  if (!is404 && !/property="og:image"/.test(html)) fail(rel, 'no og:image');
  if (/noindex|nofollow/i.test(html)) fail(rel, 'noindex/nofollow present');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail(rel, `bad JSON-LD: ${e.message}`); }
  }
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const img of imgs) if (!/\balt=/.test(img)) fail(rel, `img without alt: ${img.slice(0, 80)}`);
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    let href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith(site)) href = href.slice(site.length) || '/';
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const pathname = href.split(/[?#]/)[0];
    if (pathname === '/') continue;
    if (!(await resolves(pathname))) fail(rel, `internal link does not resolve: ${href}`);
  }
  console.log(`ok   ${rel.padEnd(34)} h=${h.join('')} title=${title?.length} desc=${desc?.length} canon=${canon ?? '-'} imgs=${imgs.length}`);
}
console.log(problems ? `\n${problems} problem(s)` : '\nall clear');
process.exit(problems ? 1 : 0);
