/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // You can add any other custom env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}