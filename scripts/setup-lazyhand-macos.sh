#!/usr/bin/env bash
set -euo pipefail

LABEL="com.handover.lazyhand"
PLIST_PATH="$HOME/Library/LaunchAgents/${LABEL}.plist"

HANDOVER_APP_URL="${HANDOVER_APP_URL:-https://handover-production.rithytep.online}"
HANDOVER_SLACK_USER_TOKEN="${HANDOVER_SLACK_USER_TOKEN:-REPLACE_ME}"
HANDOVER_SLACK_CHANNEL_ID="${HANDOVER_SLACK_CHANNEL_ID:-REPLACE_ME}"
HANDOVER_SLACK_MENTIONS="${HANDOVER_SLACK_MENTIONS:-}"
SCHEDULE_PRESET="${SCHEDULE_PRESET:-custom}"

if [[ "${SCHEDULE_PRESET}" == "day" ]]; then
  SCHEDULE_HOUR="${SCHEDULE_HOUR:-17}"
  SCHEDULE_MINUTE="${SCHEDULE_MINUTE:-16}"
elif [[ "${SCHEDULE_PRESET}" == "night" ]]; then
  SCHEDULE_HOUR="${SCHEDULE_HOUR:-23}"
  SCHEDULE_MINUTE="${SCHEDULE_MINUTE:-46}"
else
  SCHEDULE_HOUR="${SCHEDULE_HOUR:-21}"
  SCHEDULE_MINUTE="${SCHEDULE_MINUTE:-8}"
fi
LAZYHAND_PATH="$(command -v lazyhand || true)"
NODE_BIN_PATH="$(command -v node || true)"
NODE_BIN_DIR="$(dirname "${NODE_BIN_PATH:-/usr/local/bin}")"

if [[ -z "${LAZYHAND_PATH}" ]]; then
  echo "lazyhand not found on PATH. Run: npm run setup:cli"
  exit 1
fi

xml_escape() {
  local value="$1"
  value="${value//&/&amp;}"
  value="${value//</&lt;}"
  value="${value//>/&gt;}"
  echo "$value"
}

ESC_APP_URL="$(xml_escape "$HANDOVER_APP_URL")"
ESC_USER_TOKEN="$(xml_escape "$HANDOVER_SLACK_USER_TOKEN")"
ESC_CHANNEL_ID="$(xml_escape "$HANDOVER_SLACK_CHANNEL_ID")"
ESC_MENTIONS="$(xml_escape "$HANDOVER_SLACK_MENTIONS")"

cat > "${PLIST_PATH}" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${LABEL}</string>

    <key>ProgramArguments</key>
    <array>
      <string>${LAZYHAND_PATH}</string>
    </array>

    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key><integer>${SCHEDULE_HOUR}</integer>
      <key>Minute</key><integer>${SCHEDULE_MINUTE}</integer>
    </dict>

    <key>EnvironmentVariables</key>
    <dict>
      <key>PATH</key>
      <string>${NODE_BIN_DIR}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
      <key>HANDOVER_APP_URL</key>
      <string>${ESC_APP_URL}</string>
      <key>HANDOVER_SLACK_USER_TOKEN</key>
      <string>${ESC_USER_TOKEN}</string>
      <key>HANDOVER_SLACK_CHANNEL_ID</key>
      <string>${ESC_CHANNEL_ID}</string>
      <key>HANDOVER_SLACK_MENTIONS</key>
      <string>${ESC_MENTIONS}</string>
    </dict>

    <key>StandardOutPath</key>
    <string>/tmp/lazyhand.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/lazyhand.err.log</string>
  </dict>
</plist>
PLIST

launchctl bootout "gui/${UID}" "${PLIST_PATH}" 2>/dev/null || true
launchctl bootstrap "gui/${UID}" "${PLIST_PATH}"

echo "Installed ${LABEL} at ${SCHEDULE_HOUR}:${SCHEDULE_MINUTE}."
echo "Test with: launchctl start ${LABEL}"
