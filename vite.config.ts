import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/copilot-lexical/',
  plugins: [
    react(),
    // Plugin to handle ?raw CSS imports (.raw.css files)
    {
      name: 'raw-css-as-string',
      enforce: 'pre',
      async resolveId(source, importer) {
        if (source.endsWith('.raw.css') && !source.includes('?raw')) {
          const resolved = await this.resolve(source + '?raw', importer, {
            skipSelf: true,
          });
          if (resolved) return resolved.id;
          return null;
        }
        return null;
      },
    },
    // Plugin to convert ?text queries to ?raw (for service workers, etc.)
    {
      name: 'fix-text-query',
      enforce: 'pre',
      async resolveId(source, importer) {
        if (source.includes('?text')) {
          const fixed = source.replace('?text', '?raw');
          const resolved = await this.resolve(fixed, importer, {
            skipSelf: true,
          });
          if (resolved) {
            return resolved.id;
          }
          return fixed;
        }
        return null;
      },
    },
    // Force CSS `?raw` requests to be served as JS modules exporting strings
    {
      name: 'css-raw-to-string',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('.css?raw')) {
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: null,
          };
        }
        return null;
      },
    },
  ],
  server: {
    port: 3000,
    strictPort: false, // Allow fallback to another port if 3000 is taken
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        // Handle Webpack-style ~ imports in CSS
        additionalData: `@import "react-toastify/dist/ReactToastify.min.css";`,
      },
    },
  },
  resolve: {
    alias: [
      { find: 'stream', replacement: 'stream-browserify' },
      // Handle ~ prefix in imports (webpack convention) - strip ~ and resolve normally
      { find: /^~(.*)$/, replacement: '$1' },
    ],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  assetsInclude: ['**/*.wasm', '**/*.raw.css'],
  define: {
    global: 'globalThis',
    __webpack_public_path__: '""',
    'process.env': {},
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
    include: [
      'react',
      'react-dom',
      'lexical',
      '@copilotkit/react-core',
      '@copilotkit/react-ui',
    ],
    exclude: ['@lexical/react', '@lexical/rich-text'],
    force: true, // Force re-optimization to handle CommonJS modules
  },
});
