import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/**
 * Quanto as pálpebras andam para fechar o olho, nas unidades do SVG. Vem dos frames
 * "Borg Eye Open" e "Borg Eye Closed" do Figma: a de cima desce 130, a de baixo sobe 130.
 */
export const DESLOCAMENTO_DAS_PALPEBRAS = 130

/** Contorno que cobre as emendas entre as pálpebras e o branco do olho quando ele fecha. */
const CONTORNO_FECHADO = 8

/**
 * Gera a logo estática em um dos estados, a partir de `assets/logo-animada.svg`.
 * @param {string} svg - O conteúdo de `logo-animada.svg`.
 * @param {'aberta'|'fechada'} estado
 * @returns {string}
 */
export function logoNoEstado(svg, estado) {
  if (estado === 'aberta') return svg
  if (estado !== 'fechada') {
    throw new Error(`Estado da logo desconhecido: "${estado}". Use "aberta" ou "fechada".`)
  }
  return svg
    .replace('<g class="palpebras" fill="#324E7B">', `<g class="palpebras" fill="#324E7B" stroke="#324E7B" stroke-width="${CONTORNO_FECHADO}">`)
    .replace('<g class="palpebras-cima">', `<g class="palpebras-cima" transform="translate(0 ${DESLOCAMENTO_DAS_PALPEBRAS})">`)
    .replace('<g class="palpebras-baixo">', `<g class="palpebras-baixo" transform="translate(0 -${DESLOCAMENTO_DAS_PALPEBRAS})">`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pasta = new URL('../assets/', import.meta.url)
  const animada = await readFile(new URL('logo-animada.svg', pasta), 'utf8')
  await writeFile(new URL('logo.svg', pasta), logoNoEstado(animada, 'aberta'))
  await writeFile(new URL('logo-fechada.svg', pasta), logoNoEstado(animada, 'fechada'))
  console.log('Logo gerada: assets/logo.svg e assets/logo-fechada.svg')
}
