/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: "http://127.0.0.1:8000";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}