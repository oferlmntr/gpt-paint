import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import removeConsole from 'vite-plugin-remove-console';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    removeConsole({ includes: ['log'] })
  ],
  base: './',
  css: {
    // Ensure CSS is extracted to files
    extract: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Make CSS file naming consistent
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        contentScript: resolve(__dirname, 'src/contentScript.tsx'),
        popup: resolve(__dirname, 'src/popup.tsx')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
