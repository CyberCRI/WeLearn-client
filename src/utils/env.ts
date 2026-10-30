// single source of truth for the environment check.
// the method calls keep it evaluated at runtime: a plain `=== 'dev'` is folded to `false` at build
// time, since docker builds with the $DOCKER_INJECT_ placeholder and only interpolates it at nginx start
const ENVIRONMENT = (import.meta.env.VITE_ENVIRONMENT || '').trim();

export const IS_DEV_ENVIRONMENT = ENVIRONMENT.includes('dev');
// keycloak login is rolled out on dev and staging, not on prod yet
export const IS_AUTH_ENVIRONMENT = IS_DEV_ENVIRONMENT || ENVIRONMENT.includes('staging');
