import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 👇 Enable the automatic JSX transform
      jsxRuntime: "automatic",
    }),
  ],
  server: {
    open: true,
  },
});
