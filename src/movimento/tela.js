import { primeiroElemento, resolverElementos } from '../nucleo/elementos.js'
import { validarFuncao } from '../nucleo/mensagens.js'

/**
 * Diz se o elemento aparece na tela agora, mesmo que só em parte.
 *
 * Usa o primeiro elemento do seletor. Um elemento escondido (sem tamanho) não conta.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#rodape'`) ou um elemento do DOM.
 * @returns {boolean} `true` se pelo menos uma parte do elemento está dentro da janela.
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { aoClicar, estaNaTela, mudarTexto } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * aoClicar('#conferir', () => {
 *   mudarTexto('#resposta', estaNaTela('#alvo') ? 'Aparece!' : 'Escondido')
 * })
 */
export function estaNaTela(seletor) {
  const alvo = primeiroElemento(seletor, 'estaNaTela')
  if (!alvo) return false

  const { left, top, right, bottom, width, height } = alvo.getBoundingClientRect()
  if (width === 0 && height === 0) return false
  return right > 0 && bottom > 0 && left < window.innerWidth && top < window.innerHeight
}

/**
 * Observa quando os elementos entram ou saem da tela com `IntersectionObserver`.
 * @param {'entrar'|'sair'} momento
 * @param {string} nomeFuncao
 * @param {string|Element} seletor
 * @param {(elemento: Element) => void} callback
 * @returns {() => void}
 */
function observarTela(momento, nomeFuncao, seletor, callback) {
  validarFuncao(callback, nomeFuncao)
  const elementos = resolverElementos(seletor, nomeFuncao)
  const jaNotificados = new WeakSet()

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ target, isIntersecting }) => {
      const primeiraVez = !jaNotificados.has(target)
      jaNotificados.add(target)

      if (momento === 'entrar' && isIntersecting) callback(target)
      if (momento === 'sair' && !isIntersecting && !primeiraVez) callback(target)
    })
  })
  elementos.forEach((alvo) => observador.observe(alvo))

  return function parar() {
    observador.disconnect()
  }
}

/**
 * Executa uma função quando o elemento passa a aparecer na tela, por exemplo ao rolar a página.
 *
 * Se o elemento já estiver na tela quando `aoEntrarNaTela` é chamado, a função
 * é executada uma vez logo no começo.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'.cartao'`) ou um elemento do DOM.
 * @param {(elemento: Element) => void} callback - Função executada a cada entrada. Recebe o elemento que apareceu.
 * @returns {() => void} Função `parar()`, que para de observar.
 * @throws {TypeError} Quando o `callback` não é uma função ou o seletor é inválido.
 * @example
 * import { aoEntrarNaTela, alternarClasse } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * aoEntrarNaTela('.cartao', (cartao) => {
 *   alternarClasse(cartao, 'visivel')
 * })
 */
export function aoEntrarNaTela(seletor, callback) {
  return observarTela('entrar', 'aoEntrarNaTela', seletor, callback)
}

/**
 * Executa uma função quando o elemento deixa de aparecer na tela.
 *
 * Um elemento que já está fora da tela quando `aoSairDaTela` é chamado não
 * dispara a função; ela só roda depois que ele aparecer e sumir de novo.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#video'`) ou um elemento do DOM.
 * @param {(elemento: Element) => void} callback - Função executada a cada saída. Recebe o elemento que sumiu.
 * @returns {() => void} Função `parar()`, que para de observar.
 * @throws {TypeError} Quando o `callback` não é uma função ou o seletor é inválido.
 * @example
 * import { aoSairDaTela, mostrar } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * aoSairDaTela('#topo', () => {
 *   mostrar('#voltar-ao-topo')
 * })
 */
export function aoSairDaTela(seletor, callback) {
  return observarTela('sair', 'aoSairDaTela', seletor, callback)
}
