#!/bin/bash
# Copyright (c) 2025-2026 Datalayer, Inc.
# Distributed under the terms of the Modified BSD License.

# Sync all local development packages to copilot-lexical node_modules

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "Syncing All Development Packages"
echo "=========================================="
echo ""

# Sync core
bash "$SCRIPT_DIR/sync-core.sh"

echo ""

# Sync jupyter packages
bash "$SCRIPT_DIR/sync-jupyter-packages.sh"

echo ""
echo "=========================================="
echo "All Syncs Complete!"
echo "=========================================="
echo ""
echo "You can now run 'npm run dev' to start development"
echo ""
