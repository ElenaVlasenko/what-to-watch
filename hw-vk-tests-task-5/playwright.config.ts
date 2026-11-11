import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const taskDir = fileURLToPath(new URL('.', import.meta.url));
const projectDir = fileURLToPath(new URL('..', import.meta.url));

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: `${taskDir}test-results`,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${taskDir}playwright-report`, open: 'never' }],
    ['json', { outputFile: `${taskDir}test-results/results.json` }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:5185',
    headless: true,
    serviceWorkers: 'block',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start -- --host 127.0.0.1 --port 5185 --strictPort',
    cwd: projectDir,
    url: 'http://127.0.0.1:5185',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
