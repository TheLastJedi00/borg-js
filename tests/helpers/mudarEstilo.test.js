import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mudarEstilo } from '../../src/helpers/estilo.js'

describe('mudarEstilo', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="caixa"></div><p class="item"></p><p class="item"></p>'
  })

  const caixa = () => document.getElementById('caixa')

  it('aceita o nome da propriedade no formato do CSS', () => {
    mudarEstilo('#caixa', 'background-color', 'red')
    expect(caixa().style.backgroundColor).toBe('red')
  })

  it('aceita o nome da propriedade no formato do JS', () => {
    mudarEstilo('#caixa', 'backgroundColor', 'blue')
    expect(caixa().style.backgroundColor).toBe('blue')
  })

  it('converte números em pixels', () => {
    mudarEstilo('#caixa', 'width', 120)
    expect(caixa().style.width).toBe('120px')
  })

  it('não adiciona px em propriedades sem unidade', () => {
    mudarEstilo('#caixa', 'opacity', 0.5)
    mudarEstilo('#caixa', 'z-index', 3)
    expect(caixa().style.opacity).toBe('0.5')
    expect(caixa().style.zIndex).toBe('3')
  })

  it('aceita variáveis CSS', () => {
    mudarEstilo('#caixa', '--cor', 'green')
    expect(caixa().style.getPropertyValue('--cor')).toBe('green')
  })

  it('aplica em todos os elementos encontrados', () => {
    mudarEstilo('.item', 'color', 'red')
    document.querySelectorAll('.item').forEach((item) => expect(item.style.color).toBe('red'))
  })

  it('avisa em português quando o navegador não aceita a propriedade ou o valor', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mudarEstilo('#caixa', 'color', 'nao-e-uma-cor')
    expect(aviso).toHaveBeenCalledOnce()
    expect(aviso.mock.calls[0][0]).toMatch(/\[Borg\] mudarEstilo.*color/)
  })

  it('valida os parâmetros com mensagens em português', () => {
    expect(() => mudarEstilo('#caixa', '', 'red')).toThrow(/\[Borg\] mudarEstilo.*propriedade/)
    expect(() => mudarEstilo('#caixa', 'color')).toThrow(/\[Borg\] mudarEstilo.*valor/)
  })
})
