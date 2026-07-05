import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // El dev server hace de proxy hacia el backend Spring Boot.
  // Así el navegador habla siempre con el mismo origen (localhost:5173) y
  // evitamos CORS sin tener que tocar el backend.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});