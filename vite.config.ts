/// <reference types='vitest' />
/// <reference types='vite/client' />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ElenaVlasenko/what-to-watch/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/setupTests.ts'
    ],
  },
});
