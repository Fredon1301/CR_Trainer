// Configuração alternativa do Vite sem dependências do Replit
// Substitua vite.config.ts por este conteúdo quando usar PostgreSQL fora do Replit

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Removidos: @replit/vite-plugin-runtime-error-modal e @replit/vite-plugin-cartographer
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    port: 5173, // Porta padrão do Vite
    host: "0.0.0.0", // Permite acesso externo
  },
});
