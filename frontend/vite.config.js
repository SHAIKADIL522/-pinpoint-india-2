import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:   ["react", "react-dom", "react-router-dom"],
          map:      ["leaflet", "react-leaflet"],
          charts:   ["recharts"],
          motion:   ["framer-motion"],
          maplibre: ["maplibre-gl"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Ensure maplibre-gl worker resolves
  optimizeDeps: {
    exclude: ["maplibre-gl"],
  },
});
