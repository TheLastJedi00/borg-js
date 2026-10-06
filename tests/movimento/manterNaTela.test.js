import { describe, it, expect, vi, beforeEach } from 'vitest'
import { manterNaTela, moverPara } from '../../src/movimento/posicionar.js'
import { posicao } from '../../src/movimento/leitura.js'
import { simularLayout } from './retangulo.js'

describe('manterNaTela', () => {
  let nave

  beforeEach(() => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)
    document.body.innerHTML = '<div id="nave"></div><p class="item"></p><p class="item"></p>'
    nave = document.getElementById('nave')
    simularLayout(nave, { inicio: { x: 100, y: 100 }, largura: 50, altura: 40 })
  })

  it('não mexe e retorna false quando o elemento está dentro da tela', () => {
    expect(manterNaTela('#nave')).toBe(false)
    expect(nave.style.position).toBe('')
  })

  it.each([
    ['esquerda', { x: -30, y: 100 }, { x: 0, y: 100 }],
    ['direita', { x: 790, y: 100 }, { x: 750, y: 100 }],
    ['de cima', { x: 100, y: -5 }, { x: 100, y: 0 }],
    ['de baixo', { x: 100, y: 590 }, { x: 100, y: 560 }],
  ])('traz de volta quem passou da borda %s e retorna true', (_, fora, dentro) => {
    moverPara(nave, fora)
    expect(manterNaTela(nave)).toBe(true)
    expect(posicao(nave)).toEqual(dentro)
  })

  it('encosta no canto quando passou de duas bordas', () => {
    moverPara(nave, { x: 900, y: 700 })
    manterNaTela(nave)
    expect(posicao(nave)).toEqual({ x: 750, y: 560 })
  })

  it('alinha à esquerda e ao topo um elemento maior que a tela', () => {
    simularLayout(nave, { inicio: { x: -10, y: -10 }, largura: 1000, altura: 900 })
    manterNaTela(nave)
    expect(posicao(nave)).toEqual({ x: 0, y: 0 })
  })

  it('ajusta todos os elementos do seletor e retorna true se algum foi ajustado', () => {
    const [a, b] = document.querySelectorAll('.item')
    simularLayout(a, { inicio: { x: 10, y: 10 } })
    simularLayout(b, { inicio: { x: -10, y: 10 } })
    expect(manterNaTela('.item')).toBe(true)
    expect(posicao(a)).toEqual({ x: 10, y: 10 })
    expect(posicao(b)).toEqual({ x: 0, y: 10 })
  })

  it('avisa e retorna false quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(manterNaTela('#nao-existe')).toBe(false)
    expect(aviso.mock.calls[0][0]).toContain('[Borg] manterNaTela:')
  })
})
