import { defineConfig, devices } from '@playwright/test';

// End-to-end checks against the production build (`pnpm build` first).
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  // One browser at a time: with several headless browsers running at once the
  // local preview server can stall for 10-20 s, which reads as a failed test.
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'pnpm preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
