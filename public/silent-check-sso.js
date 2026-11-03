// keycloak check-sso: tells the app (parent window) where the silent login iframe landed
// a separate file because the CSP blocks inline scripts. its name has no hash, so it is cached
// for a year by nginx: fine as long as it never changes
parent.postMessage(location.href, location.origin);
