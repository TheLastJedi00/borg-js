const PREFIXO = '[Borg]'

/**
 * Mostra um aviso amigável no console, sem interromper o programa.
 * @param {string} mensagem
 */
export function avisar(mensagem) {
  console.warn(`${PREFIXO} ${mensagem}`)
}

/**
 * Cria um erro de tipo com mensagem em português.
 * @param {string} nomeFuncao - Nome da função da Borg que recebeu o valor errado.
 * @param {string} mensagem
 * @returns {TypeError}
 */
export function erroDeTipo(nomeFuncao, mensagem) {
  return new TypeError(`${PREFIXO} ${nomeFuncao}: ${mensagem}`)
}

/**
 * Descreve um valor de um jeito fácil de entender na mensagem de erro.
 * @param {*} valor
 * @returns {string}
 */
export function descrever(valor) {
  if (valor === undefined) return 'nada (undefined)'
  if (valor === null) return 'null'
  if (typeof valor === 'string') return `o texto "${valor}"`
  return `um valor do tipo ${typeof valor}`
}

/**
 * Garante que o valor é uma função.
 * @param {*} valor
 * @param {string} nomeFuncao
 * @param {string} [nomeParametro='callback']
 */
export function validarFuncao(valor, nomeFuncao, nomeParametro = 'callback') {
  if (typeof valor !== 'function') {
    throw erroDeTipo(
      nomeFuncao,
      `o parâmetro "${nomeParametro}" precisa ser uma função, mas recebeu ${descrever(valor)}. ` +
        `Exemplo: ${nomeFuncao}(..., () => { /* seu código */ })`,
    )
  }
}

/**
 * Garante que o valor é um texto não vazio.
 * @param {*} valor
 * @param {string} nomeFuncao
 * @param {string} nomeParametro
 */
export function validarTexto(valor, nomeFuncao, nomeParametro) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw erroDeTipo(
      nomeFuncao,
      `o parâmetro "${nomeParametro}" precisa ser um texto, mas recebeu ${descrever(valor)}.`,
    )
  }
}

/**
 * Garante que o valor é um vetor `{ x, y }` com pelo menos um dos eixos.
 * Cada eixo informado precisa ser um número finito. Outras propriedades são ignoradas.
 * @param {*} valor
 * @param {string} nomeFuncao
 */
export function validarVetor(valor, nomeFuncao) {
  const exemplo = `Exemplo: ${nomeFuncao}('#nave', { x: 100, y: 50 })`
  const ehObjeto = typeof valor === 'object' && valor !== null && !Array.isArray(valor)

  if (!ehObjeto || (!('x' in valor) && !('y' in valor))) {
    throw erroDeTipo(
      nomeFuncao,
      `a posição precisa ser um objeto com x e/ou y, mas recebeu ${descrever(valor)}. ${exemplo}`,
    )
  }

  for (const eixo of ['x', 'y']) {
    if (eixo in valor && !Number.isFinite(valor[eixo])) {
      throw erroDeTipo(
        nomeFuncao,
        `o "${eixo}" da posição precisa ser um número, mas recebeu ${descrever(valor[eixo])}. ${exemplo}`,
      )
    }
  }
}
