#!/usr/bin/env bash
set -euo pipefail

CONFIG_PATH="${HOME}/.lazyhand/app_path"

SCRIPT_PATH="$0"
if [[ -L "${SCRIPT_PATH}" ]]; then
  LINK_TARGET="$(readlink "${SCRIPT_PATH}")"
  if [[ "${LINK_TARGET}" = /* ]]; then
    SCRIPT_PATH="${LINK_TARGET}"
  else
    SCRIPT_PATH="$(cd "$(dirname "${SCRIPT_PATH}")" && cd "$(dirname "${LINK_TARGET}")" && pwd)/$(basename "${LINK_TARGET}")"
  fi
fi

SCRIPT_DIR="$(cd "$(dirname "${SCRIPT_PATH}")" && pwd)"
REPO_FROM_SCRIPT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_FROM_CONFIG=""

if [[ -f "${CONFIG_PATH}" ]]; then
  REPO_FROM_CONFIG="$(cat "${CONFIG_PATH}" | tr -d '\r' | xargs)"
fi

REPO_DIR="${HANDOVER_REPO_PATH:-${REPO_FROM_CONFIG:-${REPO_FROM_SCRIPT}}}"

cd "${REPO_DIR}"
node scripts/lazyhand-ui.mjs
