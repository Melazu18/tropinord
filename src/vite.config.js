import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  server: {
    open: true,
    proxy: {
      // Proxy API requests to your backend server
      "/api": {
        target: "http://localhost:3001", // adjust if your backend runs on another port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
