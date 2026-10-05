import { avisar, descrever, erroDeTipo } from './mensagens.js'

/**
 * Transforma um seletor em uma lista de elementos do DOM.
 *
 * Aceita um seletor CSS (texto), um elemento, uma NodeList ou um array de elementos.
 * Quando nada é encontrado, avisa no console e retorna uma lista vazia.
 *
 * @param {string|Element|NodeList|Element[]} seletor
 * @param {string} nomeFuncao - Nome da função da Borg, usado nas mensagens.
 * @returns {Element[]}
 */
export function resolverElementos(seletor, nomeFuncao) {
  if (typeof seletor === 'string') {
    let encontrados
    try {
      encontrados = document.querySelectorAll(seletor)
    } catch {
      throw erroDeTipo(
        nomeFuncao,
        `"${seletor}" não é um seletor CSS válido. Exemplos: "#meu-id", ".minha-classe", "button".`,
      )
    }
    if (encontrados.length === 0) {
      avisar(
        `${nomeFuncao}: nenhum elemento encontrado para "${seletor}". Confira o seletor no seu HTML.`,
      )
    }
    return [...encontrados]
  }

  if (seletor instanceof Element) return [seletor]

  if (seletor instanceof NodeList || Array.isArray(seletor)) {
    const elementos = [...seletor]
    if (elementos.every((item) => item instanceof Element)) return elementos
  }

  throw erroDeTipo(
    nomeFuncao,
    `o seletor precisa ser um texto como "#meu-id" ou um elemento do DOM, mas recebeu ${descrever(seletor)}.`,
  )
}
