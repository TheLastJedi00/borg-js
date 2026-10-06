import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { logoNoEstado, DESLOCAMENTO_DAS_PALPEBRAS } from '../../build/logo.js'

const ler = (arquivo) => readFileSync(join(process.cwd(), 'assets', arquivo), 'utf8')
const animada = ler('logo-animada.svg')

/** Tira as pálpebras (e o que mudou nelas) para comparar o resto do desenho. */
const semPalpebras = (svg) => svg.replace(/<g class="palpebras"[\s\S]*?<\/g>\s*<\/g>/, '')

describe('logoNoEstado', () => {
  it('a logo aberta é o desenho base, com as pálpebras no lugar', () => {
    const aberta = logoNoEstado(animada, 'aberta')
    expect(aberta).toContain('<g class="palpebras-cima">')
    expect(aberta).toContain('<g class="palpebras-baixo">')
    expect(aberta).not.toContain('transform=')
  })

  it('a logo fechada desce as pálpebras de cima e sobe as de baixo', () => {
    const fechada = logoNoEstado(animada, 'fechada')
    expect(fechada).toContain(`<g class="palpebras-cima" transform="translate(0 ${DESLOCAMENTO_DAS_PALPEBRAS})">`)
    expect(fechada).toContain(`<g class="palpebras-baixo" transform="translate(0 -${DESLOCAMENTO_DAS_PALPEBRAS})">`)
  })

  it('a fechada cobre as emendas com um contorno da mesma cor das pálpebras', () => {
    expect(logoNoEstado(animada, 'fechada')).toMatch(/<g class="palpebras" fill="#324E7B" stroke="#324E7B" stroke-width="\d+">/)
  })

  it('só as pálpebras mudam entre os dois estados', () => {
    expect(semPalpebras(logoNoEstado(animada, 'fechada'))).toBe(semPalpebras(logoNoEstado(animada, 'aberta')))
  })

  it('tem todas as partes nomeadas', () => {
    for (const parte of ['cabeca', 'bico', 'olhos', 'pupilas', 'palpebras', 'penas']) {
      expect(animada).toContain(`class="${parte}"`)
    }
  })

  it('rejeita um estado desconhecido', () => {
    expect(() => logoNoEstado(animada, 'piscando')).toThrow(/aberta.*fechada/)
  })
})

describe('arquivos gerados', () => {
  it.each([
    ['logo.svg', 'aberta'],
    ['logo-fechada.svg', 'fechada'],
  ])('assets/%s está igual ao gerado (rode npm run build:logo)', (arquivo, estado) => {
    expect(ler(arquivo)).toBe(logoNoEstado(animada, estado))
  })
})
