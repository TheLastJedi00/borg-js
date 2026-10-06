import { describe, it, expect, vi, beforeEach } from 'vitest'
import { elemento } from '../../src/movimento/leitura.js'

describe('elemento', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="nave"></div><p class="item">1</p><p class="item">2</p>'
  })

  it('devolve o elemento do DOM encontrado pelo seletor', () => {
    expect(elemento('#nave')).toBe(document.getElementById('nave'))
  })

  it('devolve o primeiro quando o seletor encontra vários', () => {
    expect(elemento('.item').textContent).toBe('1')
  })

  it('devolve o próprio elemento quando recebe um', () => {
    const nave = document.getElementById('nave')
    expect(elemento(nave)).toBe(nave)
  })

  it('devolve null e avisa em português quando não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(elemento('#nao-existe')).toBeNull()
    expect(aviso.mock.calls[0][0]).toMatch(/\[Borg\] elemento.*#nao-existe/)
  })

  it('lança erro em português para um seletor inválido', () => {
    expect(() => elemento(42)).toThrow(/\[Borg\] elemento/)
  })
})
