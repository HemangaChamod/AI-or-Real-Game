import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/media/[hash][extname]',
        chunkFileNames: 'assets/code/[hash].js',
        entryFileNames: 'assets/code/[hash].js',
      },
    },
  },
});
