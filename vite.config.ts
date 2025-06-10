import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "/index.html",
    },
  },
  resolve: {
    alias: {
      // Ensure Vite resolves the correct path for themoviedb.js
      themoviedb: "/src/scripts/themoviedb.js",
    },
  },
});
