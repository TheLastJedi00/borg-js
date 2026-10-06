import { describe, it, expect, vi, beforeEach } from 'vitest'
import { moverPara } from '../../src/movimento/posicionar.js'
import { posicao } from '../../src/movimento/leitura.js'
import { simularLayout } from './retangulo.js'

describe('moverPara', () => {
  let nave

  beforeEach(() => {
    document.body.innerHTML = '<div id="nave"></div><p class="item"></p><p class="item"></p>'
    nave = document.getElementById('nave')
    simularLayout(nave, { inicio: { x: 10, y: 20 } })
  })

  it('coloca o elemento no ponto da tela com position fixed', () => {
    moverPara('#nave', { x: 100, y: 50 })
    expect(nave.style.position).toBe('fixed')
    expect(nave.style.left).toBe('100px')
    expect(nave.style.top).toBe('50px')
  })

  it('mantém o eixo que não foi informado', () => {
    moverPara(nave, { x: 100 })
    expect(posicao(nave)).toEqual({ x: 100, y: 20 })
  })

  it('compensa margem ou transform para o canto do elemento ir ao ponto pedido', () => {
    simularLayout(nave, { inicio: { x: 10, y: 20 }, desvio: { x: 8, y: -25 } })
    moverPara(nave, { x: 100, y: 50 })
    expect(posicao(nave)).toEqual({ x: 100, y: 50 })
  })

  it('permite incrementar a partir da posição atual', () => {
    moverPara(nave, { x: posicao(nave).x + 1 })
    moverPara(nave, { x: posicao(nave).x + 1 })
    expect(posicao(nave)).toEqual({ x: 12, y: 20 })
  })

  it('move todos os elementos do seletor', () => {
    document.querySelectorAll('.item').forEach((item) => simularLayout(item))
    moverPara('.item', { x: 5, y: 6 })
    document.querySelectorAll('.item').forEach((item) => expect(posicao(item)).toEqual({ x: 5, y: 6 }))
  })

  it('aceita a posição entregue por aoMoverMouse', () => {
    moverPara(nave, { x: 30, y: 40 })
    expect(posicao(nave)).toEqual({ x: 30, y: 40 })
  })

  it('valida a posição com mensagem em português', () => {
    expect(() => moverPara('#nave', 100)).toThrow(/\[Borg\] moverPara.*\{ x: 100, y: 50 \}/)
    expect(() => moverPara('#nave', { x: '10' })).toThrow(TypeError)
  })

  it('avisa e não quebra quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => moverPara('#nao-existe', { x: 1 })).not.toThrow()
    expect(aviso.mock.calls[0][0]).toContain('[Borg] moverPara:')
  })
})
