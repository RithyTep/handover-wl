#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

LOG_FILE="/tmp/lazyhand-ui.log"

node "${REPO_ROOT}/scripts/lazyhand-ui.mjs" > "${LOG_FILE}" 2>&1 &

sleep 0.5
open "http://127.0.0.1:3199"
