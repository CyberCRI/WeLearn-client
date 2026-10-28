import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// the package is an ES module, so there is no __dirname
const configDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(configDir, '..', '.env.test') });
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const PORT = 5180;
const AUTH_PORT = 5181;
const AUTH_SPECS = ['auth.spec.ts', 'profile.spec.ts'];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'on-first-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // VITE_ENVIRONMENT=test: no auth, like staging and prod
      name: 'chromium',
      testIgnore: AUTH_SPECS,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORT}` }
    },
    {
      // VITE_ENVIRONMENT=dev: Keycloak auth on, against the mock in e2e/keycloak.ts
      name: 'chromium-auth',
      testMatch: AUTH_SPECS,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${AUTH_PORT}` }
    }
  ],
  // own ports: a reused `yarn dev` server runs in dev mode and redirects to the real Keycloak
  webServer: [
    {
      command: `vite --mode test --port ${PORT} --strictPort`,
      port: PORT,
      reuseExistingServer: !process.env.CI
    },
    {
      // variables already in the environment win over .env.test
      command: `vite --mode test --port ${AUTH_PORT} --strictPort`,
      port: AUTH_PORT,
      env: { VITE_ENVIRONMENT: 'dev' },
      reuseExistingServer: !process.env.CI
    }
  ]
});
