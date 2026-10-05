import { defineConfig } from 'vite'

export default defineConfig({
  root: 'docs',
  publicDir: '../assets',
  server: {
    port: 4200,
    strictPort: true,
  },
  preview: {
    port: 4200,
    strictPort: true,
  },
  build: {
    outDir: '../docs-dist',
    emptyOutDir: true,
  },
})
