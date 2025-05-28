import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    // Enables SPA fallback so that refreshing doesn't give 404
    historyApiFallback: true
  }
});
// vite.config.js
