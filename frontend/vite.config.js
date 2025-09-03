import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      // Enable polyfills for crypto and other Node.js modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  base: "/", // Set to root for proper deployment
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true, // Allow ngrok muna for test dev
    allowedHosts: ["localhost", "127.0.0.1", "be4357f6b0b6.ngrok-free.app"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
          crypto: ["bcryptjs"],
        },
      },
    },
  },
});
