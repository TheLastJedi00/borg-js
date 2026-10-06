import { NOMES_DE_TECLA } from '../src/teclado/teclas.js'

/** Cursor dentro das aspas do primeiro argumento de uma função que recebe tecla. */
const DENTRO_DA_TECLA = /\b(?:aoPressionar|aoSoltar|teclaPressionada)\(\s*(['"])([^'"]*)$/

/**
 * Diz se o cursor está dentro das aspas da tecla de `aoPressionar`, `aoSoltar` ou
 * `teclaPressionada` e, se estiver, quais nomes de tecla sugerir.
 *
 * @param {string} textoAntes - O texto antes do cursor (basta a linha atual).
 * @returns {{ inicio: number, teclas: string[] }|null} `inicio` é a posição, em `textoAntes`,
 *   onde começa o que já foi digitado da tecla.
 */
export function sugestoesDeTecla(textoAntes) {
  const encontrado = DENTRO_DA_TECLA.exec(textoAntes)
  if (!encontrado) return null
  return { inicio: textoAntes.length - encontrado[2].length, teclas: NOMES_DE_TECLA }
}
