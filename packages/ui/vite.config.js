// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.js',   // The public API of your package
      name: 'BitToByteUI',
      formats: ['es', 'cjs'],  // ES modules + CommonJS for max compatibility
      fileName: (format) => `bittobyte-ui.${format}.js`,
    },
    rollupOptions: {
      // React must NOT be bundled into the library
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'lucide-react': 'LucideReact',
        },
      },
    },
  },
})