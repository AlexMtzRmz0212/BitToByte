import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    transformer: 'postcss',
  },
  optimizeDeps: {
    // Don't pre-bundle the workspace UI package; pre-bundling caches a stale
    // copy, so rebuilds of @alex_mtz/bittobyte-ui/dist wouldn't show up in dev.
    exclude: ['@alex_mtz/bittobyte-ui'],
  },
  build: {
    target: 'es2022',
    // Read by scripts/prerender.mjs to preload a deep-linked world's chunks; deleted after.
    manifest: true,
  },
});
