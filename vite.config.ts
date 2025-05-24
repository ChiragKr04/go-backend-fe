import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Remove console.log in production
    minify: "terser",
    terserOptions: {
      compress: {
        // Remove console.log, console.info, console.debug in production
        drop_console: ["log", "info", "debug"],
        // Keep console.error and console.warn
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
    },
  },
});
