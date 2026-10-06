import * as Borg from '../../../src/index.js'
import { URL_BORG_MJS } from '../config.js'

/**
 * Roda na própria página um código escrito no estilo do aluno (com o `import` da URL
 * pública). A linha do import é trocada por parâmetros com as funções da Borg, então o
 * código mostrado é exatamente o código que roda.
 * @param {string} js
 */
export function executarComBorg(js) {
  const semImport = js
    .split('\n')
    .filter((linha) => !(linha.trim().startsWith('import') && linha.includes(URL_BORG_MJS)))
    .join('\n')
  new Function(...Object.keys(Borg), semImport)(...Object.values(Borg))
}
