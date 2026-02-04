/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COPILOT_KIT_API_KEY: string;
  readonly VITE_DATALAYER_API_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
