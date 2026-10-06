import { resolverElementos } from '../nucleo/elementos.js'

/** Display inline de cada elemento antes de ser escondido pela Borg. */
const displayOriginal = new WeakMap()

/**
 * Esconde o elemento.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#mensagem'`) ou um elemento do DOM.
 * @returns {void}
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { aoClicar, esconder } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * aoClicar('#fechar', () => {
 *   esconder('#janela')
 * })
 */
export function esconder(seletor) {
  resolverElementos(seletor, 'esconder').forEach((elemento) => {
    if (elemento.style.display !== 'none') {
      displayOriginal.set(elemento, elemento.style.display)
    }
    elemento.style.display = 'none'
  })
}

/**
 * Torna o elemento visível.
 *
 * Funciona com elementos escondidos pelo atributo `hidden`, por `esconder` ou por uma
 * regra do CSS (`display: none`).
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#mensagem'`) ou um elemento do DOM.
 * @returns {void}
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { aoClicar, mostrar } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * aoClicar('#abrir', () => {
 *   mostrar('#janela')
 * })
 */
export function mostrar(seletor) {
  resolverElementos(seletor, 'mostrar').forEach((elemento) => {
    elemento.hidden = false
    if (elemento.style.display === 'none') {
      elemento.style.display = displayOriginal.get(elemento) ?? ''
      displayOriginal.delete(elemento)
    }

    if (getComputedStyle(elemento).display === 'none') {
      elemento.style.display = 'revert'
      if (getComputedStyle(elemento).display === 'none') elemento.style.display = 'block'
    }
  })
}
