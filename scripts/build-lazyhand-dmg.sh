#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

APP_NAME="Lazyhand"
DIST_DIR="${REPO_ROOT}/dist"
APP_PATH="${DIST_DIR}/${APP_NAME}.app"
DMG_PATH="${DIST_DIR}/${APP_NAME}.dmg"

mkdir -p "${DIST_DIR}"

if [[ ! -d "${APP_PATH}" ]]; then
  "${REPO_ROOT}/scripts/build-lazyhand-app.sh"
fi

TMP_DIR="$(mktemp -d "/tmp/lazyhand-dmg.XXXX")"
trap 'rm -rf "${TMP_DIR}"' EXIT

cp -R "${APP_PATH}" "${TMP_DIR}/"
ln -s /Applications "${TMP_DIR}/Applications"

/usr/bin/hdiutil create \
  -volname "${APP_NAME}" \
  -srcfolder "${TMP_DIR}" \
  -ov \
  -format UDZO \
  "${DMG_PATH}"

echo "Built ${DMG_PATH}"
