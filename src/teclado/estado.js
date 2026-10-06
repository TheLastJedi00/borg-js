import { QUALQUER, normalizarTecla, teclaDoEvento } from './teclas.js'

/** Teclas pressionadas no momento, no formato interno (minúsculas). */
const pressionadas = new Set()
let monitorando = false

const aoPressionarTecla = (evento) => pressionadas.add(teclaDoEvento(evento.key))
const aoSoltarTecla = (evento) => pressionadas.delete(teclaDoEvento(evento.key))
const aoPerderFoco = () => pressionadas.clear()

/** Começa a acompanhar o teclado na primeira vez em que é chamada. */
function garantirMonitoramento() {
  if (monitorando) return
  document.addEventListener('keydown', aoPressionarTecla)
  document.addEventListener('keyup', aoSoltarTecla)
  window.addEventListener('blur', aoPerderFoco)
  monitorando = true
}

/**
 * Diz se uma tecla está pressionada neste momento. É útil em jogos, dentro de um loop.
 *
 * A biblioteca começa a acompanhar o teclado na primeira chamada desta função.
 * Quando a janela perde o foco, todas as teclas são consideradas soltas.
 *
 * @param {string} tecla - Ex.: `'a'`, `'espaço'`, `'seta cima'` ou `'qualquer'`.
 * @returns {boolean} `true` enquanto a tecla estiver pressionada.
 * @throws {TypeError} Quando a tecla não existe.
 * @example
 * import { teclaPressionada } from 'https://borg.lenoborges.br/borg.mjs'
 *
 * function loop() {
 *   if (teclaPressionada('seta direita')) x += 5
 *   requestAnimationFrame(loop)
 * }
 * loop()
 */
export function teclaPressionada(tecla) {
  const alvo = normalizarTecla(tecla, 'teclaPressionada')
  garantirMonitoramento()
  return alvo === QUALQUER ? pressionadas.size > 0 : pressionadas.has(alvo)
}

/**
 * Uso interno e em testes: esquece as teclas e para de acompanhar o teclado.
 * Não faz parte da API pública.
 */
export function reiniciarEstadoDoTeclado() {
  document.removeEventListener('keydown', aoPressionarTecla)
  document.removeEventListener('keyup', aoSoltarTecla)
  window.removeEventListener('blur', aoPerderFoco)
  pressionadas.clear()
  monitorando = false
}
