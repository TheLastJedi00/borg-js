import { describe, it, expect, vi, beforeEach } from 'vitest'
import { alternarClasse } from '../../src/helpers/classes.js'

describe('alternarClasse', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="caixa"></div><p class="item ativo"></p><p class="item"></p>'
  })

  it('adiciona a classe quando ela não existe e remove quando existe', () => {
    const caixa = document.getElementById('caixa')
    alternarClasse('#caixa', 'ativo')
    expect(caixa.classList.contains('ativo')).toBe(true)
    alternarClasse('#caixa', 'ativo')
    expect(caixa.classList.contains('ativo')).toBe(false)
  })

  it('alterna em cada elemento de forma independente', () => {
    alternarClasse('.item', 'ativo')
    const [primeiro, segundo] = document.querySelectorAll('.item')
    expect(primeiro.classList.contains('ativo')).toBe(false)
    expect(segundo.classList.contains('ativo')).toBe(true)
  })

  it('aceita o nome da classe com ponto, como no CSS', () => {
    alternarClasse('#caixa', '.ativo')
    expect(document.getElementById('caixa').className).toBe('ativo')
  })

  it('valida a classe com mensagem em português', () => {
    expect(() => alternarClasse('#caixa')).toThrow(/\[Borg\] alternarClasse.*classe/)
    expect(() => alternarClasse('#caixa', 'duas classes')).toThrow(/\[Borg\] alternarClasse.*espaço/)
  })

  it('avisa quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    alternarClasse('#nao-existe', 'ativo')
    expect(aviso).toHaveBeenCalledOnce()
  })
})
