import { resolverElementos } from '../nucleo/elementos.js'
import { validarFuncao } from '../nucleo/mensagens.js'

/**
 * Posição do mouse, em pixels, a partir do canto superior esquerdo da janela.
 * @typedef {{ x: number, y: number }} Posicao
 */

/**
 * Executa uma função sempre que o elemento for clicado.
 *
 * O seletor é procurado no momento em que `aoClicar` é chamado. Elementos criados
 * depois disso não são incluídos.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#botao'`) ou um elemento do DOM.
 * @param {(elemento: Element) => void} callback - Função executada a cada clique. Recebe o elemento clicado.
 * @returns {() => void} Função `parar()`, que remove o evento.
 * @throws {TypeError} Quando o `callback` não é uma função ou o seletor é inválido.
 * @example
 * Borg.aoClicar('#botao', (botao) => {
 *   Borg.mudarTexto(botao, 'Clicado!')
 * })
 */
export function aoClicar(seletor, callback) {
  validarFuncao(callback, 'aoClicar')
  const elementos = resolverElementos(seletor, 'aoClicar')
  const aoReceberClique = (evento) => callback(evento.currentTarget)

  elementos.forEach((elemento) => elemento.addEventListener('click', aoReceberClique))

  return function parar() {
    elementos.forEach((elemento) => elemento.removeEventListener('click', aoReceberClique))
  }
}

/**
 * Registra um evento do mouse no documento e entrega a posição `{ x, y }`.
 * @param {string} tipo - Tipo do evento (`'click'`, `'mousemove'`).
 * @param {string} nomeFuncao
 * @param {(posicao: Posicao) => void} callback
 * @returns {() => void}
 */
function ouvirPosicaoDoMouse(tipo, nomeFuncao, callback) {
  validarFuncao(callback, nomeFuncao)
  const aoReceberEvento = (evento) => callback({ x: evento.clientX, y: evento.clientY })

  document.addEventListener(tipo, aoReceberEvento)

  return function parar() {
    document.removeEventListener(tipo, aoReceberEvento)
  }
}

/**
 * Executa uma função sempre que houver um clique em qualquer lugar da página.
 *
 * @param {(posicao: Posicao) => void} callback - Recebe a posição do clique,
 *   em pixels, relativa ao canto superior esquerdo da janela.
 * @returns {() => void} Função `parar()`, que remove o evento.
 * @throws {TypeError} Quando o `callback` não é uma função ou o seletor é inválido.
 * @example
 * Borg.aoClicarNaTela(({ x, y }) => {
 *   Borg.mudarTexto('#posicao', `Clique em ${x}, ${y}`)
 * })
 */
export function aoClicarNaTela(callback) {
  return ouvirPosicaoDoMouse('click', 'aoClicarNaTela', callback)
}

/**
 * Executa uma função sempre que o mouse se mover pela página.
 *
 * @param {(posicao: Posicao) => void} callback - Recebe a posição atual do mouse,
 *   em pixels, relativa ao canto superior esquerdo da janela.
 * @returns {() => void} Função `parar()`, que remove o evento.
 * @throws {TypeError} Quando o `callback` não é uma função ou o seletor é inválido.
 * @example
 * Borg.aoMoverMouse(({ x, y }) => {
 *   Borg.mudarEstilo('#seguidor', 'left', `${x}px`)
 *   Borg.mudarEstilo('#seguidor', 'top', `${y}px`)
 * })
 */
export function aoMoverMouse(callback) {
  return ouvirPosicaoDoMouse('mousemove', 'aoMoverMouse', callback)
}
