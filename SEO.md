# SEO guide

Two sites, two Search Console properties:

| Site | URL | App |
| --- | --- | --- |
| BitToByte | `https://bittobyte.qzz.io/` | `apps/landing` |
| Portfolio | `https://alex.bittobyte.qzz.io/` | `apps/portfolio` |

## What the code already does

- **Prerendered HTML.** Both builds write real HTML (`pnpm build`). Landing renders `/`; the portfolio renders `/`, `/work`, `/resume`, every `/work/<slug>` and `404.html`. Each page has its own `<title>`, description, canonical, Open Graph / Twitter tags and JSON-LD.
- **One `<h1>` per page**, headings never skip a level, every `<img>` has `alt`, no `noindex` anywhere.
- **`robots.txt`** allows everything and points at the sitemap. **`sitemap.xml`** is generated at build time (landing: `/`, `/terms`, `/privacy`; portfolio: every route above), dated with the build day.
- **Clean URLs.** `vercel.json` in both apps sets `cleanUrls`, so `/terms.html` redirects to `/terms`. Unknown portfolio URLs return a real 404.
- **HTTPS** is enforced by Vercel (HSTS header on both sites).
- **OG images:** `apps/landing/public/og.png`, `apps/portfolio/public/og.png` (1200x630).

Check it any time after a build:

```powershell
pnpm build
pnpm seo:audit
```

The audit fails on a second `<h1>`, a skipped heading level, a missing title, description or canonical, any `noindex`, an `<img>` without `alt`, or an internal link that points at nothing.

The landing's deep links (`/?world=noir`) are app state, not pages: they all canonicalize to `/`. Add a real page per world only if you want each world to rank on its own.

## Search Console (you run this, about 15 minutes)

Google only starts crawling a new site quickly if you ask it to.

1. Open <https://search.google.com/search-console> and click **Add property**.
2. Choose **URL prefix** and add `https://bittobyte.qzz.io/`. Repeat for `https://alex.bittobyte.qzz.io/`.
3. Verify each with the **HTML tag** method. Google shows `<meta name="google-site-verification" content="...">`. Paste the token to Claude, or add the tag yourself under `<head>` in `apps/landing/index.html` and `apps/portfolio/index.html` (the portfolio prerender keeps it), then deploy and click **Verify**.
   - DNS TXT verification only works if you can add a TXT record for that name at wherever the `qzz.io` DNS is managed.
4. In each property: **Sitemaps** → enter `sitemap.xml` → **Submit**.
5. **URL Inspection** → paste each URL → **Request indexing**. Do this for `/`, and on the portfolio for `/work`, `/resume` and the case studies you care about most (there is a daily quota).
6. After 3 to 7 days open **Pages**. "Discovered, currently not indexed" or "Crawled, currently not indexed" means Google saw the page and is not convinced yet: more backlinks help (below), not more tags.
7. Optional: add a Bing Webmaster Tools property (import from Search Console in two clicks).

## Why it may stay slow: the domain

Both sites live on a free `*.qzz.io` subdomain. Free-subdomain hosts attract a lot of spam, so search engines tend to trust them less and index them slowly, and nothing in the code changes that. A domain you own (for example `alejandromartinez.dev`) is the single biggest improvement available. If you buy one: point it at both Vercel projects, change `site.url` (`apps/landing/src/data/site.ts`), `SITE_URL` (`apps/portfolio/src/data/pageMeta.js`), the two `robots.txt` files, `apps/landing/index.html`, the two legal pages, the `packages/ui` footer and `CookieConsent` links, then redirect the old hosts with a 301.

## Backlink strategy

Backlinks are links from other sites to yours. Order below is cheapest and fastest first. Use the exact URL each time (landing for the studio, portfolio for you).

1. **Links you already control** (same day):
   - GitHub: profile **Website** field → portfolio; each repo's **Website** field → its live subdomain or its `/work/<slug>` case study; README first line links the case study.
   - LinkedIn: **Contact info → Website** and a **Featured** item → portfolio; each project as an **Experience/Projects** entry with its URL.
   - Résumé PDF, email signature, Notion profile, Instagram/X bios → portfolio.
2. **Your own network** (this week): the live `*.bittobyte.qzz.io` project apps are the best owned links. Give each one a visible footer link to `https://bittobyte.qzz.io/` (plain `<a href>`, descriptive text such as "BitToByte, Intelligent Systems Hub") and mention it in its README.
3. **Write-ups that link back** (2 to 4 weeks): publish each case study once as an article on dev.to or Hashnode with a link to the full version, and set that platform's canonical URL to the portfolio page so the original keeps the credit.
4. **Launches** (when a project is polished): Show HN, r/SideProject, Product Hunt for the live products (Habits, Runtime, Express Entry Draws, FedEthics).
5. **Directories and lists:** "awesome" lists on GitHub matching your tools, university or hackathon project pages (Hack the Hill), the FedEthics and EastCoast EV sites for a "built by" credit linking to the portfolio.
6. Skip paid link packages and comment spam; they can get the site demoted.

Realistic expectation: a handful of relevant links plus Search Console submission is usually enough for Google to index a small site within days to a few weeks. A free subdomain can still hold it back.

