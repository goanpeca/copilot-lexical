# CopilotKit Lexical Example

A standalone example showcasing the integration of [Datalayer's Jupyter Lexical Editor](https://github.com/datalayer/jupyter-ui) with [CopilotKit](https://www.copilotkit.ai/) AI sidebar.

## Features

- 📝 **Rich Lexical Editor** - Full-featured editor based on Meta's Lexical framework
- 🤖 **AI Copilot Integration** - CopilotKit sidebar for AI-assisted editing
- 🚀 **Jupyter Runtime Support** - Toggle between runtime and non-runtime modes
- 🎨 **Primer Design System** - Beautiful UI with GitHub's Primer components
- ⚡ **Fast Dev Server** - Powered by Vite for instant HMR

## Prerequisites

- Node.js >= 22.0.0
- npm or yarn
- CopilotKit API key (get from [cloud.copilotkit.ai](https://cloud.copilotkit.ai/dashboard))

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/goanpeca/Desktop/develop/datalayer/copilot-lexical
npm install
```

### 2. Sync Local Development Packages (Optional)

If you're developing locally and want to use the latest code from sibling repositories:

```bash
# Sync all local packages
npm run sync:all

# Or sync individually
npm run sync:core          # Sync @datalayer/core
npm run sync:jupyter       # Sync jupyter-ui packages
```

### 3. Configure Environment

```bash
cd copilot-lexical
cp .env.example .env

# Edit .env and add your CopilotKit API key
VITE_COPILOT_KIT_API_KEY=your_api_key_here
```

### 4. Run Development Server

```bash
# Start on default port (3000)
npm run dev

# Or sync local packages and start dev server
npm run dev:sync

# Or specify a custom port
npm run start 8080
```

### 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Toggle Kernel Mode

Use the header buttons to toggle between:
- **Without Runtime** - Static editor without Jupyter kernel
- **With Runtime** - Full Jupyter notebook capabilities with code execution

### AI Copilot

The CopilotKit sidebar provides AI-assisted editing:
- Ask the AI to insert content
- Format text and structure
- Manipulate the document
- Get writing suggestions

Example prompts:
- "Insert a heading"
- "Add a code block with Python code"
- "Create a bulleted list"
- "Format this text as bold"

## Development

### Project Structure

```
copilot-lexical/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Scripts

#### Dev Server

- `npm run dev` - Start development server (default port 3000)
- `npm run dev:sync` - Sync local packages and start dev server
- `npm run start [port]` - Start dev server on custom port

#### Package Syncing

- `npm run sync:all` - Sync all local development packages
- `npm run sync:core` - Sync @datalayer/core only
- `npm run sync:jupyter` - Sync jupyter-ui packages only

#### Build & Type Check

- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

### Dependencies

**Core:**
- `@datalayer/jupyter-lexical` - Lexical editor with Jupyter integration
- `@datalayer/jupyter-react` - Jupyter React components
- `@copilotkit/react-core` - CopilotKit core functionality
- `@copilotkit/react-ui` - CopilotKit UI components
- `lexical` - Meta's Lexical editor framework

**UI:**
- `@primer/react` - GitHub's Primer design system
- `@primer/octicons-react` - GitHub icons

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy as JupyterHub App

This example can be deployed as a JupyterHub managed service:

1. Build the production bundle
2. Configure JupyterHub to serve the app
3. Set environment variables in JupyterHub config
4. Users can access via: `https://your-hub.com/services/copilot-lexical/`

See [JupyterHub documentation](https://jupyterhub.readthedocs.io/) for deployment details.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_COPILOT_KIT_API_KEY` | Yes | CopilotKit API key for AI features |
| `VITE_DATALAYER_API_TOKEN` | No | Datalayer token (only for runtime mode) |

## Development Workflow

### Using Local Development Packages

This project can use either published npm packages or local development versions:

#### Option 1: Use Published Packages (default)

```bash
npm install  # Installs from npm registry
npm run dev
```

#### Option 2: Use Local Development Packages

```bash
npm install
npm run sync:all  # Sync from ../core, ../jupyter-ui
npm run dev
```

The sync scripts copy built `lib/` directories from sibling repositories:

- `../core/lib` → `node_modules/@datalayer/core/lib`
- `../jupyter-ui/packages/react/lib` → `node_modules/@datalayer/jupyter-react/lib`
- `../jupyter-ui/packages/lexical/lib` → `node_modules/@datalayer/jupyter-lexical/lib`
- `../jupyter-ui/packages/primer-addons/lib` → `node_modules/@datalayer/primer-addons/lib`

### Making Changes to Dependencies

1. Make changes in the source repository (e.g., `../jupyter-ui`)
2. Build the package: `npm run build` (in that repository)
3. Sync to copilot-lexical: `npm run sync:all`
4. Restart dev server if needed

## Troubleshooting

### CopilotKit not working

- Verify your API key is correct in `.env`
- Check browser console for errors
- Ensure you've configured an LLM provider in CopilotKit dashboard

### Local packages not syncing

- Ensure sibling repositories exist: `../core`, `../jupyter-ui`
- Build packages first: Run `npm run build` in those repos
- Check sync script output for warnings

### Port already in use

- Specify a different port: `npm run start 3001`
- Or kill the process using the port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - Copyright (c) 2025-2026 Datalayer, Inc.

## Links

- [Datalayer](https://datalayer.ai)
- [Jupyter UI](https://github.com/datalayer/jupyter-ui)
- [CopilotKit](https://www.copilotkit.ai/)
- [Lexical](https://lexical.dev/)

## Support

- 📧 Email: support@datalayer.io
- 💬 GitHub Issues: [github.com/datalayer/copilot-lexical/issues](https://github.com/datalayer/copilot-lexical/issues)
- 📖 Documentation: [docs.datalayer.io](https://docs.datalayer.io)
