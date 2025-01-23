import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import vercel from "vite-plugin-vercel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  test: {
    environment: "jsdom",
  },
});
