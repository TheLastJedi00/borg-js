/**
 * URLs oficiais e a linha de `import` da Borg. Este arquivo não importa a biblioteca,
 * para poder ser usado também pela extensão do VS Code. Use pelo `config.js`.
 */

/** Domínio oficial do site. Trocar aqui atualiza todos os textos e exemplos. */
export const URL_DO_SITE = 'https://borg.lenoborges.br'

/** Build ESM, usado com `import`. */
export const URL_BORG_MJS = `${URL_DO_SITE}/borg.mjs`

/** Build para script tag, que cria o objeto global `Borg`. */
export const URL_BORG_JS = `${URL_DO_SITE}/borg.js`

const LIMITE_DA_LINHA = 80

/**
 * Monta o `import` da Borg pela URL pública. Se a linha passar de 80 caracteres, cada
 * função vai para uma linha, para caber na tela sem rolagem.
 * @param {string[]} nomes
 * @param {string} [origem] - De onde importar. Por padrão, a URL pública de `borg.mjs`.
 * @returns {string}
 */
export function linhaDeImport(nomes, origem = URL_BORG_MJS) {
  const umaLinha = `import { ${nomes.join(', ')} } from '${origem}'`
  if (umaLinha.length <= LIMITE_DA_LINHA) return umaLinha
  return `import {\n${nomes.map((nome) => `  ${nome},\n`).join('')}} from '${origem}'`
}
