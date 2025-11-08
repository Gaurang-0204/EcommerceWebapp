import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // Fix for pool timeout
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    // Increase timeout
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
