import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import vercel from "vite-plugin-vercel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  test: {
    environment: "jsdom",
  },
  server: {
    proxy: {
      "/rpc": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
      "/api/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/api/, ""),
      },
    },
  },
});
