
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 'base' como './' garante que o site funcione em qualquer subpasta (ex: /recomeco/)
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Usando esbuild (padrão) em vez de terser para evitar erro de dependência
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      },
    },
  },
});
