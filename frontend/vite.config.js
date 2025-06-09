import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8787', // Local worker with wrangler dev
        // target: 'https://your-worker.workers.dev', // Uncomment for deployed worker
        changeOrigin: true,
        secure: false,
      },
    },
  },
  assetsInclude: ['**/*.md'],
});
