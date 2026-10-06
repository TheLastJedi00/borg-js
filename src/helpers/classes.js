import { resolverElementos } from '../nucleo/elementos.js'
import { erroDeTipo, validarTexto } from '../nucleo/mensagens.js'

/**
 * Adiciona a classe se o elemento não a tiver, e remove se tiver.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#menu'`) ou um elemento do DOM.
 * @param {string} classe - Nome da classe, com ou sem ponto (`'ativo'` ou `'.ativo'`).
 * @returns {void}
 * @throws {TypeError} Quando a classe está vazia ou tem espaço, ou o seletor é inválido.
 * @example
 * import { aoClicar, alternarClasse } from 'https://borg.lenoborges.com.br/borg.mjs'
 *
 * aoClicar('#tema', () => {
 *   alternarClasse('body', 'escuro')
 * })
 */
export function alternarClasse(seletor, classe) {
  validarTexto(classe, 'alternarClasse', 'classe')
  const nome = classe.trim().replace(/^\./, '')
  if (/\s/.test(nome)) {
    throw erroDeTipo(
      'alternarClasse',
      `o nome da classe não pode ter espaço ("${classe}"). Alterne uma classe por vez.`,
    )
  }

  resolverElementos(seletor, 'alternarClasse').forEach((elemento) => {
    elemento.classList.toggle(nome)
  })
}
