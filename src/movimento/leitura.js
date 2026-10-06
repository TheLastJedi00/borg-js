import { primeiroElemento } from '../nucleo/elementos.js'

/**
 * Pega um elemento da página, como um `document.querySelector` simplificado.
 *
 * Devolve o elemento do DOM de verdade, que pode ser passado para qualquer função
 * da Borg no lugar do seletor. Se o seletor encontrar vários, devolve o primeiro.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#nave'`) ou um elemento do DOM.
 * @returns {Element|null} O elemento encontrado, ou `null` (com um aviso no console) quando nada é encontrado.
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { elemento, moverPara, mudarEstilo } from 'https://borg.lenoborges.br/borg.mjs'
 *
 * const nave = elemento('#nave')
 *
 * moverPara(nave, { x: 100, y: 100 })
 * mudarEstilo(nave, 'background-color', 'gold')
 */
export function elemento(seletor) {
  return primeiroElemento(seletor, 'elemento')
}
