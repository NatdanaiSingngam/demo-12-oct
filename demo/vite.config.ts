import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// `npm run dev:api` serves /api on 3001 (the same code runs as a Vercel Function in production).
export default defineConfig({ plugins: [react(), tailwindcss()], base: './', server: { proxy: { '/api': 'http://127.0.0.1:3001' } } });
