import { describe, it, expect, vi, beforeEach } from 'vitest'
import { moverPor } from '../../src/movimento/posicionar.js'
import { posicao } from '../../src/movimento/leitura.js'
import { simularLayout } from './retangulo.js'

describe('moverPor', () => {
  let nave

  beforeEach(() => {
    document.body.innerHTML = '<div id="nave"></div><p class="item"></p><p class="item"></p>'
    nave = document.getElementById('nave')
    simularLayout(nave, { inicio: { x: 10, y: 20 } })
  })

  it('desloca o elemento a partir da posição atual', () => {
    moverPor('#nave', { x: 5, y: 7 })
    expect(posicao(nave)).toEqual({ x: 15, y: 27 })
    moverPor('#nave', { x: 5, y: 7 })
    expect(posicao(nave)).toEqual({ x: 20, y: 34 })
  })

  it('aceita números negativos para ir à esquerda e para cima', () => {
    moverPor(nave, { x: -10, y: -20 })
    expect(posicao(nave)).toEqual({ x: 0, y: 0 })
  })

  it('não muda o eixo que não foi informado', () => {
    moverPor(nave, { x: 3 })
    expect(posicao(nave)).toEqual({ x: 13, y: 20 })
  })

  it('desloca cada elemento a partir da posição dele', () => {
    const [a, b] = document.querySelectorAll('.item')
    simularLayout(a, { inicio: { x: 0, y: 0 } })
    simularLayout(b, { inicio: { x: 100, y: 100 } })
    moverPor('.item', { x: 1, y: 1 })
    expect(posicao(a)).toEqual({ x: 1, y: 1 })
    expect(posicao(b)).toEqual({ x: 101, y: 101 })
  })

  it('valida o deslocamento com mensagem em português', () => {
    expect(() => moverPor('#nave', {})).toThrow(/\[Borg\] moverPor/)
    expect(() => moverPor('#nave', { y: Number.NaN })).toThrow(TypeError)
  })

  it('avisa e não quebra quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => moverPor('#nao-existe', { x: 1 })).not.toThrow()
    expect(aviso.mock.calls[0][0]).toContain('[Borg] moverPor:')
  })
})
