import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import vercel from "vite-plugin-vercel";
import API from "./localonly/plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercel(), API()],
  test: {
    environment: "jsdom",
  },
});
