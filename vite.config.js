import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/Drive-book/',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 1000 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/firebase.js', 'src/test/**', 'src/**/*.test.{js,jsx}'],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});