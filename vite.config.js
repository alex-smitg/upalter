import { defineConfig } from 'vite';
import path from 'path'

export default defineConfig({
  base: './',
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: `index.js`,
        assetFileNames: `[name].[ext]`
      }
    }
  },
  esbuild: {
    charset: "utf8"
  },
  plugins: [{
    name: "remove-module",
    transformIndexHtml(html) {
      return html.replace(/type="module" crossorigin/g, "defer")
    }
  }]
});