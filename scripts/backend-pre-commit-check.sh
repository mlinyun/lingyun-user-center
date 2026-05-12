#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--" ]]; then
  shift
fi

MODE="${1:-staged}"
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/user-center-backend"

run_checks() {
  echo "[backend-check] Running Spotless + Checkstyle (mode: $MODE)..."
  (
    cd "$BACKEND_DIR"
    bash ./mvnw -q -DskipTests spotless:check checkstyle:check
  )
}

has_staged_backend_files() {
  git -C "$ROOT_DIR" diff --cached --name-only --diff-filter=ACMR \
    | grep -Eq '^user-center-backend/.*\.(java|xml|properties|yml|yaml)$'
}

case "$MODE" in
  staged)
    if has_staged_backend_files; then
      run_checks
    else
      echo "[backend-check] No staged backend source/config files, skipping."
    fi
    ;;
  full)
    run_checks
    ;;
  *)
    echo "[backend-check] Unsupported mode: $MODE"
    echo "[backend-check] Use: staged | full"
    exit 1
    ;;
esac
