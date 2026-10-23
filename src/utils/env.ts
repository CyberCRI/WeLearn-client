// single source of truth for the environment check.
// the method calls keep it evaluated at runtime: a plain `=== 'dev'` is folded to `false` at build
// time, since docker builds with the $DOCKER_INJECT_ placeholder and only interpolates it at nginx start
export const IS_DEV_ENVIRONMENT = (import.meta.env.VITE_ENVIRONMENT || '').trim().includes('dev');
