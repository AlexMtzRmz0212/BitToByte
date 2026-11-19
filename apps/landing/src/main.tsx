import '@fontsource-variable/bricolage-grotesque/opsz.css';
import './theme/index.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './theme/chrome.css';
import { app, initClientRoute, startProgressSync, themeFor } from './state/app';
import { applyPlace, ensureThemeStyle } from './theme/tokens';

ensureThemeStyle();
const route = initClientRoute();

// The prerendered HTML is the Nexus. Hydrate it when that's where the visitor
// landed; for a deep link (a world, a list), render fresh instead.
const landedOnNexus = route.place === 'nexus' && route.view !== 'list';
// A fresh render has no markup to match, so stored progress can load now: the
// first paint already wears the visitor's theme (Vice City or Los Santos).
if (!landedOnNexus) startProgressSync();
applyPlace(route.place, themeFor(app.get(), route.place));

const container = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (landedOnNexus && container.firstElementChild) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
