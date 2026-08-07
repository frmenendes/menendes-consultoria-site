import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: { main: resolve("index.html") },
      output: {
        // Isola React/ReactDOM num chunk "vendor" cacheável entre deploys.
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
  server: { host: "0.0.0.0", port: 8124, strictPort: true },
  preview: { host: "0.0.0.0", port: 4174, strictPort: true },
});
