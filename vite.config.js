import { defineConfig } from 'vite'
import { configuracaoDaBiblioteca } from './build/biblioteca.js'

export default defineConfig({
  build: {
    lib: configuracaoDaBiblioteca,
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    restoreMocks: true,
  },
})
