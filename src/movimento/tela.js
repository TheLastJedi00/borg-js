import { primeiroElemento } from '../nucleo/elementos.js'

/**
 * Diz se o elemento aparece na tela agora, mesmo que só em parte.
 *
 * Usa o primeiro elemento do seletor. Um elemento escondido (sem tamanho) não conta.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#rodape'`) ou um elemento do DOM.
 * @returns {boolean} `true` se pelo menos uma parte do elemento está dentro da janela.
 * @throws {TypeError} Quando o seletor é inválido.
 * @example
 * import { aoClicar, estaNaTela, mudarTexto } from 'https://borg.lenoborges.br/borg.mjs'
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
