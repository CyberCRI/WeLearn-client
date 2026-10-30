import { afterEach, describe, expect, it, vi } from 'vitest';

// env.ts reads the variable once at import, so each case imports a fresh module
const loadEnv = async (environment: string) => {
  vi.stubEnv('VITE_ENVIRONMENT', environment);
  vi.resetModules();
  return import('../env');
};

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['dev', true, true],
    [' dev ', true, true],
    ['staging', false, true],
    ['prod', false, false],
    ['test', false, false],
    ['', false, false]
  ])('reads %j as dev: %s, auth: %s', async (environment, isDev, hasAuth) => {
    const env = await loadEnv(environment);

    expect(env.IS_DEV_ENVIRONMENT).toBe(isDev);
    expect(env.IS_AUTH_ENVIRONMENT).toBe(hasAuth);
  });
});
