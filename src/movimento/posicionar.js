import { resolverElementos } from '../nucleo/elementos.js'
import { validarVetor } from '../nucleo/mensagens.js'

/**
 * Posição em pixels, a partir do canto superior esquerdo da janela.
 * Um dos eixos pode ser omitido.
 * @typedef {{ x?: number, y?: number }} Vetor
 */

/**
 * Coloca o canto superior esquerdo do elemento no ponto `{ x, y }` da tela.
 *
 * Usa `position: fixed` com `left` e `top`. Depois mede o elemento e corrige a
 * diferença causada por margem ou `transform`, para que `posicao` devolva o ponto pedido.
 *
 * @param {HTMLElement} alvo
 * @param {{ x: number, y: number }} destino
 */
function colocarEm(alvo, { x, y }) {
  alvo.style.position = 'fixed'
  alvo.style.left = `${x}px`
  alvo.style.top = `${y}px`

  const medido = alvo.getBoundingClientRect()
  if (medido.left !== x) alvo.style.left = `${2 * x - medido.left}px`
  if (medido.top !== y) alvo.style.top = `${2 * y - medido.top}px`
}

/**
 * Coloca o elemento em um ponto da tela.
 *
 * O ponto `{ x, y }` é medido a partir do canto superior esquerdo da janela, e é o
 * canto superior esquerdo do elemento que vai para lá. Se faltar um dos eixos, ele
 * continua onde está. O elemento passa a usar `position: fixed`, então sai do fluxo
 * da página. Para o movimento deslizar, use `mudarEstilo` com `transition`.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#nave'`) ou um elemento do DOM.
 * @param {Vetor} posicao - Ponto da tela, em pixels (ex.: `{ x: 100, y: 50 }`).
 * @returns {void}
 * @throws {TypeError} Quando a posição não é um objeto com `x` e/ou `y` numéricos, ou o seletor é inválido.
 * @example
 * import { aoMoverMouse, moverPara } from 'https://borg.lenoborges.br/borg.mjs'
 *
 * aoMoverMouse((posicao) => {
 *   moverPara('#mira', posicao)
 * })
 */
export function moverPara(seletor, posicao) {
  validarVetor(posicao, 'moverPara')
  resolverElementos(seletor, 'moverPara').forEach((alvo) => {
    const atual = alvo.getBoundingClientRect()
    colocarEm(alvo, { x: posicao.x ?? atual.left, y: posicao.y ?? atual.top })
  })
}

/**
 * Desloca o elemento a partir de onde ele está na tela.
 *
 * `x` positivo vai para a direita e negativo para a esquerda; `y` positivo vai para
 * baixo e negativo para cima. Se faltar um dos eixos, ele não muda. Cada elemento do
 * seletor anda a partir da própria posição.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#nave'`) ou um elemento do DOM.
 * @param {Vetor} deslocamento - Quantos pixels andar em cada eixo (ex.: `{ x: 5 }`).
 * @returns {void}
 * @throws {TypeError} Quando o deslocamento não é um objeto com `x` e/ou `y` numéricos, ou o seletor é inválido.
 * @example
 * import { aoPressionar, moverPor } from 'https://borg.lenoborges.br/borg.mjs'
 *
 * aoPressionar('seta direita', () => {
 *   moverPor('#nave', { x: 10 })
 * })
 */
export function moverPor(seletor, deslocamento) {
  validarVetor(deslocamento, 'moverPor')
  resolverElementos(seletor, 'moverPor').forEach((alvo) => {
    const atual = alvo.getBoundingClientRect()
    colocarEm(alvo, {
      x: atual.left + (deslocamento.x ?? 0),
      y: atual.top + (deslocamento.y ?? 0),
    })
  })
}
