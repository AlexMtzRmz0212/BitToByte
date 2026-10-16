import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Build-time only (scripts/prerender.mjs): renders the Nexus to static HTML so
// crawlers, link previews and no-JS visitors get the full text and every
// project link. The client hydrates the same markup.
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export { buildThemeCss } from './theme/tokens';
export { projects } from './data/projects';
export { site } from './data/site';
export { WORLDS as worlds } from './data/worlds';
