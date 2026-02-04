# Conda Recipe for copilot-lexical

This directory contains the conda recipe for building the `copilot-lexical` package.

## Prerequisites

- conda or mamba installed
- conda-build installed (`conda install conda-build`)

## Building the Package

From the project root directory:

```bash
# Build the conda package
conda build conda-recipe/

# Or with mamba (faster)
mamba build conda-recipe/
```

## Installing the Package

After building, install the package:

```bash
# Install from local build
conda install --use-local copilot-lexical

# Or specify the path to the built package
conda install /path/to/conda-bld/noarch/copilot-lexical-0.1.0-*.tar.bz2
```

## Using the Package

Once installed, run the application:

```bash
# Default port (3000)
python -m copilot_lexical

# Custom port
python -m copilot_lexical 5182

# Custom port and path
python -m copilot_lexical 60499 /path/to/folder
```

## Package Contents

The conda package includes:
- Python wrapper (`copilot_lexical` module)
- Built Node.js application (in `dist/`)
- All Node.js dependencies
- Node.js runtime (version 22+)

## Notes

- The package is marked as `noarch: python` for platform independence
- Node.js 22+ is required (specified in dependencies)
- The build process runs `npm install` and `npm run build` automatically
