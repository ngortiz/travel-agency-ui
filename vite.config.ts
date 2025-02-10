import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://travel-agency-api-staging.up.railway.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/visitbrasil': {
        target: 'https://visitbrasil.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/visitbrasil/, ''),
      },
    },
  },
});
