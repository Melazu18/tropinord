// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), mdx()],
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "lib"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@shared": path.resolve(__dirname, "src/shared"), // ✅ keep
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  server: {
    open: true,
    port: 5173,
    strictPort: true,
    proxy: {
      // ✅ Tea catalog -> Vercel Functions emulator
      "/api/teaCatalog": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      // ✅ All your other backend endpoints stay on your local Express server
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        // ws: true, // uncomment only if your backend uses websockets under /api
      },

      // ✅ Static receipts served by the backend
      "/receipts": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
