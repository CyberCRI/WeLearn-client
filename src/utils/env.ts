import type { Environment } from '@/types';

// single source of truth for the environment check.
// the method calls keep it evaluated at runtime: a plain `=== 'dev'` is folded to `false` at build
// time, since docker builds with the $DOCKER_INJECT_ placeholder and only interpolates it at nginx start
const ENVIRONMENT = (import.meta.env.VITE_ENVIRONMENT || '').trim();

export const ENVIRONMENTS: readonly Environment[] = ['dev', 'staging', 'test', 'prod'];

// an unknown or missing value counts as prod, the most restrictive one
export const ENVIRONMENT_NAME: Environment =
  ENVIRONMENTS.find((name) => ENVIRONMENT.includes(name)) ?? 'prod';
