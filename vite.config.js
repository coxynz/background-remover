import { defineConfig } from 'vite';

export default defineConfig({
  base: '/background-remover/',
  optimizeDeps: {
    exclude: ['@imgly/background-removal'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});

