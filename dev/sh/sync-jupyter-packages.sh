#!/bin/bash
# Copyright (c) 2025-2026 Datalayer, Inc.
# Distributed under the terms of the Modified BSD License.

# Sync built Jupyter UI packages to copilot-lexical node_modules
# This script copies the lib/ directories from jupyter-ui to copilot-lexical

set -e

# Define paths
JUPYTER_UI_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)/jupyter-ui"
COPILOT_LEXICAL_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "=========================================="
echo "Syncing Jupyter UI Packages"
echo "=========================================="
echo "From: $JUPYTER_UI_ROOT"
echo "To:   $COPILOT_LEXICAL_ROOT/node_modules"
echo ""

# Sync @datalayer/jupyter-react
echo "[1/3] Syncing @datalayer/jupyter-react..."
REACT_SOURCE="$JUPYTER_UI_ROOT/packages/react/lib"
REACT_TARGET="$COPILOT_LEXICAL_ROOT/node_modules/@datalayer/jupyter-react/lib"

if [ -d "$REACT_SOURCE" ]; then
    rm -rf "$REACT_TARGET"
    cp -R "$REACT_SOURCE" "$REACT_TARGET"
    echo "  ✓ Synced @datalayer/jupyter-react"
else
    echo "  ✗ Warning: $REACT_SOURCE not found (run 'npm run build' in jupyter-ui first)"
fi

# Sync @datalayer/jupyter-lexical
echo "[2/3] Syncing @datalayer/jupyter-lexical..."
LEXICAL_SOURCE="$JUPYTER_UI_ROOT/packages/lexical/lib"
LEXICAL_TARGET="$COPILOT_LEXICAL_ROOT/node_modules/@datalayer/jupyter-lexical/lib"

if [ -d "$LEXICAL_SOURCE" ]; then
    rm -rf "$LEXICAL_TARGET"
    cp -R "$LEXICAL_SOURCE" "$LEXICAL_TARGET"
    echo "  ✓ Synced @datalayer/jupyter-lexical"
else
    echo "  ✗ Warning: $LEXICAL_SOURCE not found (run 'npm run build' in jupyter-ui first)"
fi

# Sync @datalayer/primer-addons
echo "[3/3] Syncing @datalayer/primer-addons..."
PRIMER_SOURCE="$JUPYTER_UI_ROOT/packages/primer-addons/lib"
PRIMER_TARGET="$COPILOT_LEXICAL_ROOT/node_modules/@datalayer/primer-addons/lib"

if [ -d "$PRIMER_SOURCE" ]; then
    rm -rf "$PRIMER_TARGET"
    cp -R "$PRIMER_SOURCE" "$PRIMER_TARGET"
    echo "  ✓ Synced @datalayer/primer-addons"
else
    echo "  ✗ Warning: $PRIMER_SOURCE not found (run 'npm run build' in jupyter-ui first)"
fi

echo ""
echo "=========================================="
echo "Sync Complete!"
echo "=========================================="
echo ""
echo "Synced packages:"
echo "  • @datalayer/jupyter-react → copilot-lexical"
echo "  • @datalayer/jupyter-lexical → copilot-lexical"
echo "  • @datalayer/primer-addons → copilot-lexical"
echo ""
