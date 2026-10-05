import { resolverElementos } from '../nucleo/elementos.js'
import { validarFuncao } from '../nucleo/mensagens.js'

/**
 * Executa uma função sempre que o elemento for clicado.
 *
 * O seletor é procurado no momento em que `aoClicar` é chamado. Elementos criados
 * depois disso não são incluídos.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#botao'`) ou um elemento do DOM.
 * @param {(elemento: Element) => void} callback - Função executada a cada clique. Recebe o elemento clicado.
 * @returns {() => void} Função `parar()`, que remove o evento.
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
