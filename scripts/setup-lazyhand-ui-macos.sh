#!/usr/bin/env bash
set -euo pipefail

LABEL="com.handover.lazyhand.ui"
PLIST_PATH="${HOME}/Library/LaunchAgents/${LABEL}.plist"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
UI_SCRIPT="${REPO_ROOT}/scripts/lazyhand-ui.mjs"

NODE_PATH="$(command -v node || true)"
if [[ -z "${NODE_PATH}" ]]; then
  NODE_PATH="$(ls -1 "${HOME}/.nvm/versions/node/"*/bin/node 2>/dev/null | sort -V | tail -n 1 || true)"
fi
NODE_BIN_DIR="$(dirname "${NODE_PATH:-/usr/local/bin}")"

UI_PORT="${LAZYHAND_UI_PORT:-3199}"

if [[ -z "${NODE_PATH}" ]]; then
  echo "node not found on PATH. Install Node 20+ and try again."
  exit 1
fi

if [[ ! -f "${UI_SCRIPT}" ]]; then
  echo "UI script not found at ${UI_SCRIPT}"
  exit 1
fi

cat > "${PLIST_PATH}" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${LABEL}</string>

    <key>ProgramArguments</key>
    <array>
      <string>${NODE_PATH}</string>
      <string>${UI_SCRIPT}</string>
    </array>

    <key>WorkingDirectory</key>
    <string>${REPO_ROOT}</string>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>EnvironmentVariables</key>
    <dict>
      <key>PATH</key>
      <string>${NODE_BIN_DIR}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
      <key>LAZYHAND_UI_PORT</key>
      <string>${UI_PORT}</string>
    </dict>

    <key>StandardOutPath</key>
    <string>/tmp/lazyhand-ui.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/lazyhand-ui.err.log</string>
  </dict>
</plist>
PLIST

launchctl bootout "gui/${UID}" "${PLIST_PATH}" 2>/dev/null || true
launchctl bootstrap "gui/${UID}" "${PLIST_PATH}"

echo "Lazyhand UI service installed. It will run at login."
