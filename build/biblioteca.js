import { resolve } from 'node:path'

/** Configuração de lib do Vite, usada no build da biblioteca e no site de docs. */
export const configuracaoDaBiblioteca = {
  entry: resolve(import.meta.dirname, '../src/index.js'),
  name: 'Borg',
  formats: ['iife', 'es'],
  fileName: (formato) => (formato === 'es' ? 'borg.mjs' : 'borg.js'),
}
