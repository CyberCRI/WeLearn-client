#!/usr/bin/env bash
# PreToolUse guard for Bash (see CLAUDE.md "Agent rules"):
# - denies git commit while on main, and any git push that would update main
# - asks before a push that skips the pre-push hook or force-pushes
# - asks the human before any package install/add/remove/upgrade
# - denies commands that would print .env.local
# ponytail: pattern matching on the command text, not a shell parser. it covers the usual
# ways an agent writes these commands, the deny list in settings.json is a second layer

if ! command -v jq >/dev/null 2>&1; then
  echo "guard-bash: jq is missing, so the command can't be checked. Install jq (CLAUDE.md, Agent rules)." >&2
  exit 2
fi

raw=$(jq -r '.tool_input.command // ""')
[ -z "$raw" ] && exit 0

repo="${CLAUDE_PROJECT_DIR:-.}"
ask_reason=""

decide() {
  jq -n --arg d "$1" --arg r "$2" \
    '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: $d, permissionDecisionReason: $r}}'
  exit 0
}
deny() { decide deny "$1 (CLAUDE.md, Agent rules)."; }
# a deny later in the command still wins over an ask
ask() { [ -z "$ask_reason" ] && ask_reason="$1 (CLAUDE.md, Agent rules)."; }
current_branch() { git -C "$1" symbolic-ref --short HEAD 2>/dev/null || echo ""; }

# one simple command per line. heredoc bodies and quoted text with spaces (commit messages,
# echo strings) are dropped so their words don't read as commands, redirections too
segments=$(printf '%s\n' "$raw" | awk '
  { lines[NR] = $0 }
  END {
    text = ""; delim = ""
    for (i = 1; i <= NR; i++) {
      l = lines[i]
      if (delim != "") {
        t = l; gsub(/^[ \t]+|[ \t]+$/, "", t)
        if (t == delim) delim = ""
        continue
      }
      gsub(/<<</, " ", l)
      if (match(l, /<<-?[ \t]*["\047]?[A-Za-z_][A-Za-z0-9_]*["\047]?/)) {
        d = substr(l, RSTART, RLENGTH)
        sub(/^<<-?[ \t]*["\047]?/, "", d); sub(/["\047]$/, "", d)
        delim = d
        l = substr(l, 1, RSTART - 1) " " substr(l, RSTART + RLENGTH)
      }
      text = text l "\n"
    }
    out = ""; n = length(text); i = 1
    while (i <= n) {
      c = substr(text, i, 1)
      if (c == "\\") { out = out substr(text, i, 2); i += 2; continue }
      if (c == "\047" || c == "\"") {
        buf = ""; i++
        while (i <= n) {
          ch = substr(text, i, 1)
          if (ch == c) break
          if (c == "\"" && ch == "\\") { buf = buf substr(text, i + 1, 1); i += 2; continue }
          buf = buf ch; i++
        }
        i++
        out = out (buf ~ /[ \t\n]/ ? " Q " : buf)
        continue
      }
      out = out c; i++
    }
    gsub(/[0-9]*[<>]+&?[ \t]*[^ \t\n;&|()<>]*/, " ", out)
    gsub(/&&|\|\||[;|&()`]/, "\n", out)
    printf "%s", out
  }')

# package installs need a human yes; plain `yarn install` / `yarn` restores the lockfile and is fine
if printf '%s\n' "$segments" | grep -Eq '(^|\s)(yarn\s+(global\s+)?(add|remove|upgrade|upgrade-interactive|up)\b|npm\s+(install|i|add|uninstall|remove|rm|update|up)\b|pnpm\s+(add|install|i|remove|rm|update|up)\b|npx\s+playwright\s+install\b|yarn\s+playwright\s+install\b|corepack\s+(install|prepare)\b)'; then
  ask "Package install/upgrade/removal needs human confirmation"
fi

# follows `git checkout -b x && git commit` within the command
branch=$(current_branch "$repo")

while IFS= read -r seg; do
  read -ra tok <<<"$seg"
  [ ${#tok[@]} -eq 0 ] && continue
  i=0
  while [ $i -lt ${#tok[@]} ]; do
    case "${tok[$i]}" in
      *=* | command | exec | env | sudo | time | nohup) i=$((i + 1)) ;;
      *) break ;;
    esac
  done
  first=${tok[$i]}

  case "$seg" in
    *.env.local*)
      case "$first" in
        ls | test | '[' | git) ;;
        *) deny "Reading .env.local is not allowed, its values must never be printed" ;;
      esac
      ;;
  esac

  [ "$first" = git ] || continue
  i=$((i + 1))
  dir=$repo
  while [ $i -lt ${#tok[@]} ]; do
    case "${tok[$i]}" in
      -C) dir=${tok[$((i + 1))]}; i=$((i + 2)) ;;
      -c) i=$((i + 2)) ;;
      -*) i=$((i + 1)) ;;
      *) break ;;
    esac
  done
  sub=${tok[$i]}
  args=("${tok[@]:$((i + 1))}")
  if [ "$dir" = "$repo" ]; then cur=$branch; else cur=$(current_branch "$dir"); fi

  case "$sub" in
    checkout | switch)
      new=""
      for ((j = 0; j < ${#args[@]}; j++)); do
        case "${args[$j]}" in
          -b | -B | -c | -C | --orphan) new=${args[$((j + 1))]}; break ;;
          --) break ;;
          -*) ;;
          # `git checkout file.ts` is not a branch switch
          *) git -C "$dir" show-ref --verify --quiet "refs/heads/${args[$j]}" && new=${args[$j]}; break ;;
        esac
      done
      [ -n "$new" ] && [ "$dir" = "$repo" ] && branch=$new
      ;;

    commit)
      [ "$cur" = main ] && deny "Committing to main is not allowed. Create a feature branch first"
      ;;

    push)
      positional=()
      force=""
      for ((j = 0; j < ${#args[@]}; j++)); do
        a=${args[$j]}
        case "$a" in
          --no-verify) ask "This push skips the pre-push checks" ;;
          --force-with-lease* | --force-if-includes) ;;
          --force) force=1 ;;
          --all | --mirror | --branches) deny "This push would update every branch, main included. Push your feature branch only" ;;
          -o | --push-option | --repo | --receive-pack | --exec) j=$((j + 1)) ;;
          --*) ;;
          -*) case "$a" in *f*) force=1 ;; esac ;;
          *) positional+=("$a") ;;
        esac
      done
      # no refspec pushes the current branch
      refspecs=("${positional[@]:1}")
      [ ${#refspecs[@]} -eq 0 ] && refspecs=(HEAD)
      for r in "${refspecs[@]}"; do
        case "$r" in +*) force=1; r=${r#+} ;; esac
        dst=${r#*:}
        dst=${dst#refs/heads/}
        case "$dst" in HEAD | @) dst=$cur ;; esac
        [ "$dst" = main ] && deny "Pushing to main is not allowed. Push a feature branch and open a PR"
      done
      [ -n "$force" ] && ask "Force-pushing rewrites the remote branch, prefer --force-with-lease"
      ;;
  esac
done <<<"$segments"

[ -n "$ask_reason" ] && decide ask "$ask_reason"
exit 0
