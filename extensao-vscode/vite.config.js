import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const pasta = fileURLToPath(new URL('.', import.meta.url))

/** Build da extensão: um único arquivo CommonJS para o Node do VS Code, com as sugestões embutidas. */
export default defineConfig({
  root: pasta,
  publicDir: false,
  build: {
    ssr: true,
    target: 'node18',
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: 'src/extensao.js',
      external: ['vscode'],
      output: {
        format: 'cjs',
        entryFileNames: 'extensao.cjs',
      },
    },
  },
})
