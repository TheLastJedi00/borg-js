import { erroDeTipo, validarTexto } from '../nucleo/mensagens.js'

/** Valor interno que representa a tecla especial `'qualquer'`. */
export const QUALQUER = '*qualquer*'

/** Nomes em português → `KeyboardEvent.key` em minúsculas. */
const NOMES_ESPECIAIS = {
  espaço: ' ',
  espaco: ' ',
  enter: 'enter',
  esc: 'escape',
  'seta cima': 'arrowup',
  'seta baixo': 'arrowdown',
  'seta esquerda': 'arrowleft',
  'seta direita': 'arrowright',
  qualquer: QUALQUER,
}

/** Nomes de tecla especiais aceitos pela Borg, sem apelidos. Usados no autocomplete. */
export const NOMES_DE_TECLA = Object.keys(NOMES_ESPECIAIS).filter((nome) => nome !== 'espaco')

/** `KeyboardEvent.key` em minúsculas → nome em português. */
const NOMES_EM_PORTUGUES = {
  ' ': 'espaço',
  enter: 'enter',
  escape: 'esc',
  arrowup: 'seta cima',
  arrowdown: 'seta baixo',
  arrowleft: 'seta esquerda',
  arrowright: 'seta direita',
}

const EXEMPLOS = "'a', '7', 'espaço', 'enter', 'esc', 'seta cima', 'seta baixo', 'seta esquerda', 'seta direita' ou 'qualquer'"

/**
 * Converte o nome de uma tecla em português para o formato interno usado na comparação.
 * @param {string} tecla - Ex.: `'a'`, `'espaço'`, `'seta cima'`, `'qualquer'`.
 * @param {string} nomeFuncao - Nome da função da Borg, usado nas mensagens.
 * @returns {string}
 */
export function normalizarTecla(tecla, nomeFuncao) {
  validarTexto(tecla, nomeFuncao, 'tecla')
  const nome = tecla.trim().toLowerCase().replace(/\s+/g, ' ')

  if (nome in NOMES_ESPECIAIS) return NOMES_ESPECIAIS[nome]
  if ([...nome].length === 1) return nome

  throw erroDeTipo(nomeFuncao, `não conheço a tecla "${tecla}". Use, por exemplo: ${EXEMPLOS}.`)
}

/**
 * Converte o `KeyboardEvent.key` para o formato interno (minúsculas).
 * @param {string} key
 * @returns {string}
 */
export function teclaDoEvento(key) {
  return key.toLowerCase()
}

/**
 * Traduz o `KeyboardEvent.key` para o nome em português entregue aos callbacks.
 * @param {string} key
 * @returns {string}
 */
export function nomeDaTecla(key) {
  const tecla = teclaDoEvento(key)
  return NOMES_EM_PORTUGUES[tecla] ?? tecla
}
