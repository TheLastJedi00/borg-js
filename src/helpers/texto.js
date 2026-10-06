import { resolverElementos } from '../nucleo/elementos.js'
import { descrever, erroDeTipo } from '../nucleo/mensagens.js'

/**
 * Troca o texto do elemento. O texto é tratado como texto puro, e tags HTML não são interpretadas.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#titulo'`) ou um elemento do DOM.
 * @param {string|number} texto - Novo texto. Números são convertidos para texto.
 * @returns {void}
 * @throws {TypeError} Quando o texto não é um texto ou número, ou o seletor é inválido.
 * @example
 * import { aoClicar, mudarTexto } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * let pontos = 0
 * aoClicar('#botao', () => {
 *   pontos = pontos + 1
 *   mudarTexto('#pontos', pontos)
 * })
 */
export function mudarTexto(seletor, texto) {
  if (typeof texto !== 'string' && typeof texto !== 'number') {
    throw erroDeTipo(
      'mudarTexto',
      `o parâmetro "texto" precisa ser um texto ou um número, mas recebeu ${descrever(texto)}.`,
    )
  }

  resolverElementos(seletor, 'mudarTexto').forEach((elemento) => {
    elemento.textContent = String(texto)
  })
}
