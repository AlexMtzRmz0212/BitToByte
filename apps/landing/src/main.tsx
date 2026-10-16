import '@fontsource-variable/bricolage-grotesque/opsz.css';
import './theme/index.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { initClientRoute } from './state/app';
import { applyPlace, ensureThemeStyle } from './theme/tokens';

ensureThemeStyle();
const route = initClientRoute();
applyPlace(route.place);

const container = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The prerendered HTML is the Nexus. Hydrate it when that's where the visitor
// landed; for a deep link (a world, a list), render fresh instead.
const landedOnNexus = route.place === 'nexus' && route.view !== 'list';
if (landedOnNexus && container.firstElementChild) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
