#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
CONFIG_DIR="${HOME}/.lazyhand"

APP_URL_FILE="${CONFIG_DIR}/app_url"
TOKEN_FILE="${CONFIG_DIR}/token"
CHANNEL_FILE="${CONFIG_DIR}/channel_id"
MENTIONS_FILE="${CONFIG_DIR}/mentions"
PRESET_FILE="${CONFIG_DIR}/preset"
HOUR_FILE="${CONFIG_DIR}/hour"
MINUTE_FILE="${CONFIG_DIR}/minute"

DEFAULT_APP_URL="https://handover-production.rithytep.online"

mkdir -p "${CONFIG_DIR}"

read_file() {
	local file_path="$1"
	if [[ -f "${file_path}" ]]; then
		cat "${file_path}"
	else
		echo ""
	fi
}

escape_applescript() {
	local value="$1"
	value="${value//\\/\\\\}"
	value="${value//\"/\\\"}"
	echo "$value"
}

run_osascript() {
	/usr/bin/osascript -e "$1"
}

default_app_url="$(read_file "${APP_URL_FILE}")"
default_app_url="${default_app_url:-$DEFAULT_APP_URL}"

default_channel="$(read_file "${CHANNEL_FILE}")"
default_mentions="$(read_file "${MENTIONS_FILE}")"
default_preset="$(read_file "${PRESET_FILE}")"
default_preset="${default_preset:-day}"
default_hour="$(read_file "${HOUR_FILE}")"
default_hour="${default_hour:-21}"
default_minute="$(read_file "${MINUTE_FILE}")"
default_minute="${default_minute:-8}"

app_url="$(run_osascript "text returned of (display dialog \"App URL\" default answer \"$(escape_applescript "${default_app_url}")\")")"
token="$(run_osascript "text returned of (display dialog \"Slack User Token\" default answer \"$(escape_applescript "$(read_file "${TOKEN_FILE}")")\" with hidden answer)")"
channel_id="$(run_osascript "text returned of (display dialog \"Slack Channel ID\" default answer \"$(escape_applescript "${default_channel}")\")")"
mentions="$(run_osascript "text returned of (display dialog \"Mentions (optional)\" default answer \"$(escape_applescript "${default_mentions}")\")")"

preset_choice="$(run_osascript "choose from list {\"Off\",\"Day\",\"Night\",\"Custom\"} with prompt \"Schedule preset\" default items {\"$(echo "${default_preset^}")\"}")"

if [[ "${preset_choice}" == "false" ]]; then
	exit 0
fi

preset=""
case "${preset_choice}" in
	Off) preset="off" ;;
	Day) preset="day" ;;
	Night) preset="night" ;;
	Custom) preset="custom" ;;
	*) preset="day" ;;
esac

hour="${default_hour}"
minute="${default_minute}"
if [[ "${preset}" == "custom" ]]; then
	hour="$(run_osascript "text returned of (display dialog \"Custom Hour (0-23)\" default answer \"$(escape_applescript "${default_hour}")\")")"
	minute="$(run_osascript "text returned of (display dialog \"Custom Minute (0-59)\" default answer \"$(escape_applescript "${default_minute}")\")")"
fi

printf '%s' "${app_url}" > "${APP_URL_FILE}"
printf '%s' "${token}" > "${TOKEN_FILE}"
printf '%s' "${channel_id}" > "${CHANNEL_FILE}"
printf '%s' "${mentions}" > "${MENTIONS_FILE}"
printf '%s' "${preset}" > "${PRESET_FILE}"
printf '%s' "${hour}" > "${HOUR_FILE}"
printf '%s' "${minute}" > "${MINUTE_FILE}"

if [[ "${preset}" == "off" ]]; then
	launchctl bootout "gui/$(id -u)" "${HOME}/Library/LaunchAgents/com.handover.lazyhand.plist" 2>/dev/null || true
	run_osascript "display dialog \"Lazyhand schedule stopped.\" buttons {\"OK\"}"
	exit 0
fi

export HANDOVER_APP_URL="${app_url}"
export HANDOVER_SLACK_USER_TOKEN="${token}"
export HANDOVER_SLACK_CHANNEL_ID="${channel_id}"
export HANDOVER_SLACK_MENTIONS="${mentions}"
export SCHEDULE_PRESET="${preset}"
export SCHEDULE_HOUR="${hour}"
export SCHEDULE_MINUTE="${minute}"

"${REPO_ROOT}/scripts/setup-lazyhand-macos.sh"

run_osascript "display dialog \"Lazyhand schedule applied (${preset}).\" buttons {\"OK\"}"
