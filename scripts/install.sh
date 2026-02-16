#!/usr/bin/env bash
set -euo pipefail

REPO="sorphwer/json-render-cli"
BRANCH="main"
SCRIPT_URL="https://raw.githubusercontent.com/${REPO}/${BRANCH}/scripts/install-skills.mjs"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is required but not installed." >&2
  exit 1
fi

TMPFILE="$(mktemp /tmp/install-skills.XXXXXX.mjs)"
trap 'rm -f "$TMPFILE"' EXIT

curl -fsSL "$SCRIPT_URL" -o "$TMPFILE"

# Reconnect stdin to the terminal so the Node script can prompt
# interactively even when this shell script is piped via curl | bash.
if [ -t 0 ]; then
  node "$TMPFILE" "$@"
else
  node "$TMPFILE" "$@" </dev/tty
fi
