import * as Borg from '../../src/index.js'
import { URL_BORG_MJS, linhaDeImport } from './url.js'

export { URL_DO_SITE, URL_BORG_MJS, URL_BORG_JS, linhaDeImport } from './url.js'

/** Nomes das funções públicas da Borg. */
export const FUNCOES_DA_BORG = Object.keys(Borg)

/**
 * Coloca no topo do código o `import` das funções da Borg que ele chama, na ordem em que
 * aparecem. Código que já importa a Borg ou que não usa nenhuma função dela fica como está.
 * @param {string} js
 * @returns {string}
 */
export function comImport(js) {
  const codigo = js.trim()
  if (codigo.includes(URL_BORG_MJS)) return codigo

  const usadas = FUNCOES_DA_BORG.map((nome) => ({
    nome,
    posicao: codigo.search(new RegExp(`\\b${nome}\\s*\\(`)),
  }))
    .filter(({ posicao }) => posicao !== -1)
    .sort((a, b) => a.posicao - b.posicao)
    .map(({ nome }) => nome)

  if (usadas.length === 0) return codigo
  return `${linhaDeImport(usadas)}\n\n${codigo}`
}
