import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "@shared": "/src/shared",
      "@core": "/src/core",
      "@features": "/src/features",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          pixi: ["pixi.js", "@pixi/react"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
