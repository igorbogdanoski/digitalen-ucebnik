import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  // За GitHub Pages, ако апликацијата е во под-папка, одкоментирајте го следново и внесете го името на репозиториумот:
  // base: '/ime-na-repozitorium/',
});