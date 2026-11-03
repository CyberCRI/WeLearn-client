#!/usr/bin/env bash

set -e

# Set the secrets as env vars
EXISTING_VARS=$(printenv | awk -F= '{print $1}'| grep DOCKER_INJECT_ | sed 's/^/\$/g' | paste -sd,)
export EXISTING_VARS;

echo "Interpolating variables in static files:"
echo -e "$EXISTING_VARS" | sed s/\\$//g | sed s/,/\\n/g

for file in /usr/share/nginx/html/*.html /usr/share/nginx/html/assets/*.js;
do
  cat "$file" | envsubst "$EXISTING_VARS" > "$file.tmp" && cp "$file.tmp" "$file"
done

echo "Trying to find uninterpolated variables"
! (grep -o '\$DOCKER[A-Z|_]*' /usr/share/nginx/html/*.html /usr/share/nginx/html/assets/*.js)

if [[ $? -ne 0 ]]; then
  echo "Uninterpolated variables found, exiting"
  exit 1
fi

# the CSP needs the api and keycloak origins (scheme + host, no path) of this environment
origin() { printf '%s' "$1" | sed -nE 's|^(https?://[^/?#]+).*|\1|p'; }
CSP_API_ORIGIN=$(origin "${DOCKER_INJECT_VITE_API_BASE:-}")
CSP_KEYCLOAK_ORIGIN=$(origin "${DOCKER_INJECT_VITE_KEYCLOAK_URL:-}")
export CSP_API_ORIGIN CSP_KEYCLOAK_ORIGIN

# without the api origin the CSP would block every api call, fail the start instead
if [[ -z "$CSP_API_ORIGIN" ]]; then
  echo "DOCKER_INJECT_VITE_API_BASE is not an http(s) url, can't build the Content-Security-Policy, exiting"
  exit 1
fi
# an empty keycloak origin (dummy values where auth is off) only leaves keycloak out of the CSP
echo "Content-Security-Policy origins: api=$CSP_API_ORIGIN keycloak=${CSP_KEYCLOAK_ORIGIN:-none}"

# only these two variables: nginx's own $variables must stay untouched
HEADERS_FILE=/etc/nginx/conf.d/security-headers.inc
envsubst '${CSP_API_ORIGIN} ${CSP_KEYCLOAK_ORIGIN}' < "$HEADERS_FILE" > "$HEADERS_FILE.tmp"
mv "$HEADERS_FILE.tmp" "$HEADERS_FILE"

nginx -g 'daemon off;'
