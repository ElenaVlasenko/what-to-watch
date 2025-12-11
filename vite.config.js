/// <reference types='vitest' />
/// <reference types='vite/client' />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { BASE_URL } from './const.js';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: `${BASE_URL}`,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/setupTests.ts'
    ],
  },
});
