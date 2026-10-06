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
 * import { elemento, moverPara, mudarEstilo } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * const nave = elemento('#nave')
 *
 * moverPara(nave, { x: 100, y: 100 })
 * mudarEstilo(nave, 'background-color', 'gold')
 */
export function elemento(seletor) {
  return primeiroElemento(seletor, 'elemento')
}

/**
 * Posição em pixels, a partir do canto superior esquerdo da janela.
 * @typedef {{ x: number, y: number }} Posicao
 */

/**
 * Lê a posição atual do elemento na tela.
 *
 * A posição é a do canto superior esquerdo do elemento, medida a partir do canto
 * superior esquerdo da janela. Ela é lida na hora, então continua certa depois de
 * rolagem, CSS ou outra função ter movido o elemento.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#nave'`) ou um elemento do DOM.
 * @returns {Posicao|null} A posição `{ x, y }`, ou `null` (com um aviso no console) quando nada é encontrado.
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { aoPressionar, elemento, moverPara, posicao } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * const nave = elemento('#nave')
 *
 * aoPressionar('seta direita', () => {
 *   moverPara(nave, { x: posicao(nave).x + 10 })
 * })
 */
export function posicao(seletor) {
  const alvo = primeiroElemento(seletor, 'posicao')
  if (!alvo) return null
  const { left, top } = alvo.getBoundingClientRect()
  return { x: left, y: top }
}

/**
 * Lê o tamanho do elemento na tela, em pixels.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#nave'`) ou um elemento do DOM.
 * @returns {{ largura: number, altura: number }|null} O tamanho, ou `null` (com um aviso no console) quando nada é encontrado.
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { mudarTexto, tamanho } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * const { largura, altura } = tamanho('#caixa')
 * mudarTexto('#medida', `${largura} x ${altura}`)
 */
export function tamanho(seletor) {
  const alvo = primeiroElemento(seletor, 'tamanho')
  if (!alvo) return null
  const { width, height } = alvo.getBoundingClientRect()
  return { largura: width, altura: height }
}

/**
 * Lê o tamanho da janela visível (viewport), em pixels.
 *
 * @returns {{ largura: number, altura: number }} A largura e a altura da janela.
 * @throws {never} Não lança erros.
 * @example
 * import { moverPara, tamanhoDaTela } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * const tela = tamanhoDaTela()
 * moverPara('#bola', { x: tela.largura / 2, y: tela.altura / 2 })
 */
export function tamanhoDaTela() {
  return { largura: window.innerWidth, altura: window.innerHeight }
}
