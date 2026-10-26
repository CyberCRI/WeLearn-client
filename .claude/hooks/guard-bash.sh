#!/usr/bin/env bash
# PreToolUse guard for Bash (see CLAUDE.md "Agent rules"):
# - denies git commit while on main, and git push that targets main
# - asks the human before any package install/add/remove/upgrade
set -u

cmd=$(jq -r '.tool_input.command // ""')
[ -z "$cmd" ] && exit 0

decide() {
  jq -n --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: $d, permissionDecisionReason: $r}}'
  exit 0
}

repo="${CLAUDE_PROJECT_DIR:-.}"
branch=$(git -C "$repo" symbolic-ref --short HEAD 2>/dev/null || echo "")

# git commit on main
if printf '%s' "$cmd" | grep -Eq '(^|[;&|(]|\s)git(\s+-C\s+\S+)?\s+commit\b'; then
  if [ "$branch" = "main" ]; then
    decide deny "Committing to main is not allowed. Create a feature branch first (CLAUDE.md, Agent rules)."
  fi
fi

# git push to main: explicit main ref, or a bare push while on main
if printf '%s' "$cmd" | grep -Eq '(^|[;&|(]|\s)git(\s+-C\s+\S+)?\s+push\b'; then
  push_part=$(printf '%s' "$cmd" | grep -Eo 'git(\s+-C\s+\S+)?\s+push[^;&|]*')
  if printf '%s' "$push_part" | grep -Eq '(\s|:|/)main(\s|$)'; then
    decide deny "Pushing to main is not allowed. Push a feature branch and open a PR (CLAUDE.md, Agent rules)."
  fi
  if [ "$branch" = "main" ] && ! printf '%s' "$push_part" | grep -Eq 'push\s+(-\S+\s+)*[^-\s]\S*\s+[^-\s]'; then
    decide deny "You are on main, so this push would update main. Switch to a feature branch (CLAUDE.md, Agent rules)."
  fi
fi

# package installs need a human yes; plain `yarn install` / `yarn` restores the lockfile and is fine
if printf '%s' "$cmd" | grep -Eq '(^|[;&|(]|\s)(yarn\s+(global\s+)?(add|remove|upgrade|upgrade-interactive|up)\b|npm\s+(install|i|add|uninstall|remove|rm|update|up)\b|pnpm\s+(add|install|i|remove|rm|update|up)\b|npx\s+playwright\s+install\b|yarn\s+playwright\s+install\b|corepack\s+(install|prepare)\b)'; then
  decide ask "Package install/upgrade/removal needs human confirmation (CLAUDE.md, Agent rules)."
fi

exit 0
