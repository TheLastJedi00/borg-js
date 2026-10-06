import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const raiz = resolve(import.meta.dirname, 'docs')

/** Páginas do site. Cada uma vira um arquivo HTML em `docs-dist/`. */
const paginas = ['index', 'comecar', 'funcoes', 'professores', 'desafios', 'projetos']

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
    rolldownOptions: {
      input: Object.fromEntries(paginas.map((pagina) => [pagina, resolve(raiz, `${pagina}.html`)])),
    },
  },
})
