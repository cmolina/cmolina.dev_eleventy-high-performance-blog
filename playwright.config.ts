import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: {
    command: 'npm run preview -- --port 4323',
    port: 4323,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4323',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
