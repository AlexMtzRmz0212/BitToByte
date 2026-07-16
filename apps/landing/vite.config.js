import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    transformer: 'postcss',
  },
  optimizeDeps: {
    // Don't pre-bundle the workspace UI package — pre-bundling caches a stale
    // copy, so rebuilds of @alex_mtz/bittobyte-ui/dist wouldn't show up in dev.
    // Excluding it lets Vite read the fresh dist on reload.
    exclude: ['@alex_mtz/bittobyte-ui'],
  },
})