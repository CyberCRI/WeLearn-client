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
// keycloak and analytics are only on in dev
const DEV_SPECS = ['auth.spec.ts', 'profile.spec.ts', 'consent.spec.ts'];

// the tests run against a production build: the dev server compiles every module on request,
// which on a slow runner keeps the page blank past the expect timeout.
// E2E_DEV_SERVER=1 uses the dev server instead, for quick local iterations.
// e2e/build.mjs builds once and makes one copy per environment (dist/e2e-test, dist/e2e-dev), so
// only the first server builds: playwright starts the web servers one after the other, each once
// the previous one answers, so the copies are there when the second server starts.
const serve = (env: 'test' | 'dev', port: number) =>
  process.env.E2E_DEV_SERVER
    ? `vite --mode test --port ${port} --strictPort`
    : `${env === 'test' ? 'node e2e/build.mjs && ' : ''}vite preview --outDir dist/e2e-${env} --port ${port} --strictPort`;
// the build has to finish before the server answers
const SERVER_TIMEOUT = 180_000;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// same shape as ProjectOptions in e2e/base.ts, not imported: e2e stays out of tsconfig.node
export default defineConfig<{ isDevEnvironment: boolean }>({
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
      // VITE_ENVIRONMENT=test: no auth nor analytics, like prod
      name: 'chromium',
      testIgnore: DEV_SPECS,
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PORT}` }
    },
    {
      // VITE_ENVIRONMENT=dev: Keycloak auth on, against the mock in e2e/keycloak.ts, and analytics on
      name: 'chromium-auth',
      testMatch: DEV_SPECS,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${AUTH_PORT}`,
        isDevEnvironment: true
      }
    }
  ],
  // own ports: a reused `yarn dev` server runs in dev mode and redirects to the real Keycloak
  webServer: [
    {
      command: serve('test', PORT),
      port: PORT,
      timeout: SERVER_TIMEOUT,
      reuseExistingServer: !process.env.CI
    },
    {
      // only used by the dev server (E2E_DEV_SERVER): the build gets its environment in e2e/build.mjs.
      // variables already in the environment win over .env.test
      command: serve('dev', AUTH_PORT),
      port: AUTH_PORT,
      env: { VITE_ENVIRONMENT: 'dev' },
      timeout: SERVER_TIMEOUT,
      reuseExistingServer: !process.env.CI
    }
  ]
});
