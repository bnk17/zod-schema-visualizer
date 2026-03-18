/// <reference types="vitest" />

import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    // Include only integration tests (unit and component tests)
    include: [
      'src/tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    // Explicitly exclude e2e tests to avoid conflicts with Playwright
    exclude: ['src/tests/e2e/**/*', 'node_modules/**/*'],
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/tests/**/*', 'src/**/*.d.ts'],
    },
  },
});
