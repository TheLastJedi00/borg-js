import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Borg',
      formats: ['iife', 'es'],
      fileName: (formato) => (formato === 'es' ? 'borg.mjs' : 'borg.js'),
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    restoreMocks: true,
  },
})
