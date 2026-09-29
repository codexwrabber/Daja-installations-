#!/usr/bin/env bash
# Standalone dependency installer for Daja Installation Services.
# Use this if `npm install` alone hangs/fails in Codespaces or elsewhere.
#
# Usage:
#   bash scripts/setup.sh

set -e

echo "Node: $(node -v 2>/dev/null || echo 'not found')"
echo "npm:  $(npm -v 2>/dev/null || echo 'not found')"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node 18+ before continuing."
  exit 1
fi

echo "Cleaning old install artifacts..."
rm -rf node_modules
rm -rf .next
npm cache clean --force >/dev/null 2>&1 || true

attempt_install() {
  echo "Attempt $1: installing dependencies..."
  if [ -f package-lock.json ]; then
    npm ci --no-audit --no-fund
  else
    npm install --no-audit --no-fund
  fi
}

# Try up to 3 times — Codespaces/flaky networks sometimes drop mid-install.
for i in 1 2 3; do
  if attempt_install "$i"; then
    echo "Dependencies installed successfully."
    exit 0
  fi
  echo "Install attempt $i failed, retrying in 5s..."
  sleep 5
done

echo "All install attempts failed. Try:"
echo "  1. Rebuilding the Codespace container (Cmd/Ctrl+Shift+P -> 'Rebuild Container')"
echo "  2. Checking your network connection"
echo "  3. Running: npm install --legacy-peer-deps"
exit 1
