#!/bin/bash
# Copyright (c) 2025-2026 Datalayer, Inc.
# Distributed under the terms of the Modified BSD License.

# Sync built core library to copilot-lexical node_modules
# This script copies the lib/ directory from core to copilot-lexical

set -e

# Define paths
CORE_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)/core"
COPILOT_LEXICAL_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "=========================================="
echo "Syncing @datalayer/core"
echo "=========================================="
echo "From: $CORE_ROOT"
echo "To:   $COPILOT_LEXICAL_ROOT/node_modules"
echo ""

# Sync @datalayer/core
echo "Syncing @datalayer/core..."
CORE_SOURCE="$CORE_ROOT/lib"
CORE_TARGET="$COPILOT_LEXICAL_ROOT/node_modules/@datalayer/core/lib"

if [ -d "$CORE_SOURCE" ]; then
    rm -rf "$CORE_TARGET"
    cp -R "$CORE_SOURCE" "$CORE_TARGET"
    echo "  ✓ Synced @datalayer/core/lib"
else
    echo "  ✗ Warning: $CORE_SOURCE not found (run 'npm run build:lib' in core first)"
fi

echo ""
echo "=========================================="
echo "Sync Complete!"
echo "=========================================="
echo ""
echo "Synced packages:"
echo "  • @datalayer/core → copilot-lexical"
echo ""
