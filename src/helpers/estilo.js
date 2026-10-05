import { resolverElementos } from '../nucleo/elementos.js'
import { avisar, descrever, erroDeTipo, validarTexto } from '../nucleo/mensagens.js'

/** Propriedades em que um número não deve virar pixels. */
const SEM_UNIDADE = new Set([
  'opacity',
  'z-index',
  'font-weight',
  'line-height',
  'flex',
  'flex-grow',
  'flex-shrink',
  'order',
  'scale',
  'zoom',
])

/**
 * Converte `backgroundColor` em `background-color`. Variáveis CSS (`--cor`) não mudam.
 * @param {string} propriedade
 * @returns {string}
 */
function paraFormatoCss(propriedade) {
  const nome = propriedade.trim()
  if (nome.startsWith('--')) return nome
  return nome.replace(/[A-Z]/g, (letra) => `-${letra.toLowerCase()}`)
}

/**
 * Altera um estilo CSS do elemento.
 *
 * @param {string|Element} seletor - Seletor CSS (ex.: `'#caixa'`) ou um elemento do DOM.
 * @param {string} propriedade - Nome no formato do CSS (`'background-color'`) ou do JS (`'backgroundColor'`).
 * @param {string|number} valor - Valor do estilo. Números viram pixels (`100` → `'100px'`),
 *   exceto em propriedades sem unidade, como `opacity` e `z-index`.
 * @example
 * Borg.aoMoverMouse(({ x }) => {
 *   Borg.mudarEstilo('#barra', 'width', x)
 * })
 */
export function mudarEstilo(seletor, propriedade, valor) {
  validarTexto(propriedade, 'mudarEstilo', 'propriedade')
  if (typeof valor !== 'string' && typeof valor !== 'number') {
    throw erroDeTipo(
      'mudarEstilo',
      `o parâmetro "valor" precisa ser um texto ou um número, mas recebeu ${descrever(valor)}.`,
    )
  }

  const nome = paraFormatoCss(propriedade)
  const valorCss = typeof valor === 'number' && !SEM_UNIDADE.has(nome) ? `${valor}px` : String(valor)

  resolverElementos(seletor, 'mudarEstilo').forEach((elemento, indice) => {
    elemento.style.setProperty(nome, valorCss)
    if (indice === 0 && valorCss !== '' && elemento.style.getPropertyValue(nome) === '') {
      avisar(
        `mudarEstilo: o navegador não aceitou "${nome}: ${valorCss}". Confira o nome da propriedade e o valor.`,
      )
    }
  })
}
