import * as Borg from '../../../src/index.js'
import { URL_BORG_MJS } from '../config.js'

const IMPORT_DA_BORG = new RegExp(
  `import\\s*\\{[^}]*\\}\\s*from\\s*['"]${URL_BORG_MJS.replaceAll('.', '\\.')}['"]`,
  'g',
)

/**
 * Roda na própria página um código escrito no estilo do aluno (com o `import` da URL
 * pública). O import é trocado por parâmetros com as funções da Borg, então o código
 * mostrado é exatamente o código que roda.
 * @param {string} js
 */
export function executarComBorg(js) {
  new Function(...Object.keys(Borg), js.replace(IMPORT_DA_BORG, ''))(...Object.values(Borg))
}
