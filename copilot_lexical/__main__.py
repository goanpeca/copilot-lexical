#!/usr/bin/env python
"""
Main entry point for running copilot_lexical as a module.

Usage:
    python -m copilot_lexical [port] [path_to_folder]

Examples:
    python -m copilot_lexical                      # Uses default port 3000, default path
    python -m copilot_lexical 5182                 # Uses port 5182, default path
    python -m copilot_lexical 60499 /path/to/app   # Uses port 60499, custom path
"""
import subprocess
import sys
import os
from pathlib import Path

def main():
    # Parse arguments
    port = sys.argv[1] if len(sys.argv) > 1 else "3000"

    # If path is provided, use it; otherwise use project root (parent of copilot_lexical)
    if len(sys.argv) > 2:
        project_root = Path(sys.argv[2]).resolve()
    else:
        project_root = Path(__file__).parent.parent

    # Change to project directory
    os.chdir(project_root)

    # Run the serve.js script with the specified port
    serve_script = project_root / "serve.js"
    subprocess.run(["node", str(serve_script), port])

if __name__ == "__main__":
    main()
