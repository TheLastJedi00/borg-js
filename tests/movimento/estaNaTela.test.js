import { describe, it, expect, vi, beforeEach } from 'vitest'
import { estaNaTela } from '../../src/movimento/tela.js'
import { simularRetangulo } from './retangulo.js'

describe('estaNaTela', () => {
  let caixa

  beforeEach(() => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)
    document.body.innerHTML = '<div id="caixa"></div>'
    caixa = document.getElementById('caixa')
  })

  it('retorna true quando o elemento está inteiro na tela', () => {
    simularRetangulo(caixa, { x: 10, y: 10, largura: 50, altura: 50 })
    expect(estaNaTela('#caixa')).toBe(true)
  })

  it('retorna true quando só uma parte aparece', () => {
    simularRetangulo(caixa, { x: -40, y: 580, largura: 50, altura: 50 })
    expect(estaNaTela(caixa)).toBe(true)
  })

  it.each([
    ['abaixo da tela', { x: 10, y: 600 }],
    ['acima da tela', { x: 10, y: -50 }],
    ['à esquerda', { x: -50, y: 10 }],
    ['à direita', { x: 800, y: 10 }],
  ])('retorna false quando está %s', (_, { x, y }) => {
    simularRetangulo(caixa, { x, y, largura: 50, altura: 50 })
    expect(estaNaTela(caixa)).toBe(false)
  })

  it('retorna false para um elemento escondido (sem tamanho)', () => {
    simularRetangulo(caixa, { x: 10, y: 10, largura: 0, altura: 0 })
    expect(estaNaTela(caixa)).toBe(false)
  })

  it('avisa e retorna false quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(estaNaTela('#nao-existe')).toBe(false)
    expect(aviso.mock.calls[0][0]).toContain('[Borg] estaNaTela:')
  })
})
