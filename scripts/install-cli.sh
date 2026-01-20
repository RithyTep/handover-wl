#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Installing dependencies..."
npm install

echo "Linking handover CLI..."
npm link

cat <<'EOF'
CLI installed.

Set the API URL (example):
  export HANDOVER_APP_URL=https://handover-production.rithytep.online

Try it:
  handover copy
  handover print
  handover send
  handover reply --token xoxp-... --channel C123 --mentions "<@U1> <@U2>"
EOF
