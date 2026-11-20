/* eslint-disable react-refresh/only-export-components --
   A build-time module: it is never hot-reloaded and exports the prerender helpers on purpose. */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

// Build-time only (scripts/prerender.mjs): renders one route to static HTML so
// crawlers, link previews and no-JS visitors get the real page. The browser
// bundle (main.jsx) then mounts the app over it.
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

export { metaForPath, sitemapPaths, SITE_URL, SITE_NAME, OG_IMAGE } from './data/pageMeta';
