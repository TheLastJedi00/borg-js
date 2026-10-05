import { validarFuncao } from '../nucleo/mensagens.js'
import { QUALQUER, nomeDaTecla, normalizarTecla, teclaDoEvento } from './teclas.js'

/** Teclas que rolam a página por padrão no navegador. */
const TECLAS_DE_ROLAGEM = new Set([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'])

/**
 * Diz se o evento aconteceu em um lugar onde o aluno está digitando.
 * @param {EventTarget|null} alvo
 * @returns {boolean}
 */
function estaDigitando(alvo) {
  return (
    alvo instanceof HTMLElement &&
    (alvo.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName))
  )
}

/**
 * Registra um evento de teclado no documento para uma tecla específica.
 * @param {'keydown'|'keyup'} tipo
 * @param {string} nomeFuncao
 * @param {string} tecla
 * @param {(tecla: string) => void} callback
 * @returns {() => void}
 */
function ouvirTecla(tipo, nomeFuncao, tecla, callback) {
  const alvo = normalizarTecla(tecla, nomeFuncao)
  validarFuncao(callback, nomeFuncao)

  const aoReceberTecla = (evento) => {
    if (evento.repeat) return
    const pressionada = teclaDoEvento(evento.key)
    if (alvo !== QUALQUER && alvo !== pressionada) return

    if (alvo !== QUALQUER && TECLAS_DE_ROLAGEM.has(pressionada) && !estaDigitando(evento.target)) {
      evento.preventDefault()
    }
    callback(nomeDaTecla(evento.key))
  }

  document.addEventListener(tipo, aoReceberTecla)

  return function parar() {
    document.removeEventListener(tipo, aoReceberTecla)
  }
}

/**
 * Executa uma função quando uma tecla for pressionada.
 *
 * Dispara uma vez por toque: segurar a tecla não repete o callback. Para saber se a
 * tecla continua pressionada, use `teclaPressionada`.
 * Quando a tecla é `'espaço'` ou uma seta, a rolagem da página é bloqueada, exceto
 * dentro de campos de texto.
 *
 * @param {string} tecla - Ex.: `'a'`, `'7'`, `'espaço'`, `'enter'`, `'esc'`, `'seta cima'` ou `'qualquer'`.
 * @param {(tecla: string) => void} callback - Recebe o nome, em português, da tecla pressionada.
 * @returns {() => void} Função `parar()`, que remove o evento.
 * @example
 * Borg.aoPressionar('espaço', () => {
 *   Borg.alternarClasse('body', 'escuro')
 * })
 */
export function aoPressionar(tecla, callback) {
  return ouvirTecla('keydown', 'aoPressionar', tecla, callback)
}

/**
 * Executa uma função quando uma tecla for solta.
 *
 * @param {string} tecla - Ex.: `'a'`, `'7'`, `'espaço'`, `'enter'`, `'esc'`, `'seta cima'` ou `'qualquer'`.
 * @param {(tecla: string) => void} callback - Recebe o nome, em português, da tecla solta.
 * @returns {() => void} Função `parar()`, que remove o evento.
 * @example
 * Borg.aoSoltar('seta direita', () => {
 *   Borg.mudarTexto('#status', 'Parado')
 * })
 */
export function aoSoltar(tecla, callback) {
  return ouvirTecla('keyup', 'aoSoltar', tecla, callback)
}
