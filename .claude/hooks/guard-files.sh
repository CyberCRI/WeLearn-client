#!/usr/bin/env bash
# PreToolUse guard for the file tools (see CLAUDE.md "Agent rules" and "Gotchas"):
# - denies reading .env.local, its values must never be printed
# - denies edits to generated types, the static microlearning content and the devops submodule
# - asks the human before package.json or yarn.lock change (dependency versions live there)

if ! command -v jq >/dev/null 2>&1; then
  echo "guard-files: jq is missing, so the file can't be checked. Install jq (CLAUDE.md, Agent rules)." >&2
  exit 2
fi

input=$(cat)
tool=$(jq -r '.tool_name // ""' <<<"$input")
path=$(jq -r '.tool_input.file_path // .tool_input.notebook_path // ""' <<<"$input")
[ -z "$path" ] && exit 0

decide() {
  jq -n --arg d "$1" --arg r "$2 (CLAUDE.md)." \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: $d, permissionDecisionReason: $r}}'
  exit 0
}

repo="${CLAUDE_PROJECT_DIR:-$PWD}"
rel=${path#"$repo"/}

case "$rel" in
  .env.local | */.env.local) decide deny ".env.local holds secrets, never read or print its values" ;;
esac

[ "$tool" = Read ] && exit 0

case "$rel" in
  src/types/generated/*) decide deny "src/types/generated is never edited by hand, run yarn gen:api" ;;
  src/learn/modules/discipline.ts) decide deny "src/learn/modules/discipline.ts is static content and is never edited" ;;
  devops-toolbox/*) decide deny "devops-toolbox is a git submodule, don't edit it" ;;
  package.json | yarn.lock) decide ask "Changing package.json or yarn.lock needs human confirmation" ;;
esac

exit 0
