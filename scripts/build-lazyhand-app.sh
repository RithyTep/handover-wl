#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

DIST_DIR="${REPO_ROOT}/dist"
APP_NAME="Lazyhand"
APP_PATH="${DIST_DIR}/${APP_NAME}.app"

mkdir -p "${DIST_DIR}"

/usr/bin/osacompile -o "${APP_PATH}" "${SCRIPT_DIR}/lazyhand-app.applescript"

echo "Built ${APP_PATH}"
echo "Drag it to /Applications if you want it installed system-wide."
