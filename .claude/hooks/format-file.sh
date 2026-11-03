#!/usr/bin/env bash
# PostToolUse: runs prettier on the file Claude just edited, so `yarn format:check` stays green.
# only src/, which is what format:check covers. never blocks: a file prettier can't parse is
# left as it is and lint/format:check report it
command -v jq >/dev/null 2>&1 || exit 0

path=$(jq -r '.tool_input.file_path // ""')
[ -z "$path" ] && exit 0

repo="${CLAUDE_PROJECT_DIR:-$PWD}"
rel=${path#"$repo"/}

case "$rel" in
  src/types/generated/*) exit 0 ;;
  src/*.ts | src/*.vue | src/*.js | src/*.css | src/*.json | src/*.md) ;;
  *) exit 0 ;;
esac

prettier="$repo/node_modules/.bin/prettier"
[ -x "$prettier" ] || exit 0
"$prettier" --write --log-level warn "$path" >/dev/null 2>&1 || true
exit 0
