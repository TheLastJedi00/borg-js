import * as Borg from '../../src/index.js'

/** Domínio oficial do site. Trocar aqui atualiza todos os textos e exemplos. */
export const URL_DO_SITE = 'https://borg.lenoborges.br'

/** Build ESM, usado com `import`. */
export const URL_BORG_MJS = `${URL_DO_SITE}/borg.mjs`

/** Build para script tag, que cria o objeto global `Borg`. */
export const URL_BORG_JS = `${URL_DO_SITE}/borg.js`

/** Nomes das funções públicas da Borg. */
export const FUNCOES_DA_BORG = Object.keys(Borg)

/**
 * Monta a linha de `import` da Borg pela URL pública.
 * @param {string[]} nomes
 * @returns {string}
 */
export function linhaDeImport(nomes) {
  return `import { ${nomes.join(', ')} } from '${URL_BORG_MJS}'`
}

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
