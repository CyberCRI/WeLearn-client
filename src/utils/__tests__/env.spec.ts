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
    ['dev', 'dev'],
    [' dev ', 'dev'],
    ['staging', 'staging'],
    ['prod', 'prod'],
    ['test', 'test'],
    // unknown or missing: the most restrictive
    ['', 'prod'],
    ['demo', 'prod']
  ])('reads %j as %s', async (environment, name) => {
    const env = await loadEnv(environment);

    expect(env.ENVIRONMENT_NAME).toBe(name);
  });
});
