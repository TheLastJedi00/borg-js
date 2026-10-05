import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolverElementos } from '../../src/nucleo/elementos.js'

describe('resolverElementos', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="botao">A</button>
      <p class="item">1</p>
      <p class="item">2</p>
    `
  })

  it('encontra um elemento por seletor CSS', () => {
    const elementos = resolverElementos('#botao', 'teste')
    expect(elementos).toHaveLength(1)
    expect(elementos[0].id).toBe('botao')
  })

  it('encontra todos os elementos que combinam com o seletor', () => {
    expect(resolverElementos('.item', 'teste')).toHaveLength(2)
  })

  it('aceita um elemento do DOM', () => {
    const botao = document.getElementById('botao')
    expect(resolverElementos(botao, 'teste')).toEqual([botao])
  })

  it('aceita uma lista de elementos (NodeList ou array)', () => {
    const itens = document.querySelectorAll('.item')
    expect(resolverElementos(itens, 'teste')).toHaveLength(2)
    expect(resolverElementos([...itens], 'teste')).toHaveLength(2)
  })

  it('avisa em português e retorna lista vazia quando nada é encontrado', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(resolverElementos('#nao-existe', 'aoClicar')).toEqual([])
    expect(aviso).toHaveBeenCalledOnce()
    expect(aviso.mock.calls[0][0]).toContain('[Borg]')
    expect(aviso.mock.calls[0][0]).toContain('#nao-existe')
    expect(aviso.mock.calls[0][0]).toContain('aoClicar')
  })

  it('lança erro explicativo para seletor CSS inválido', () => {
    expect(() => resolverElementos('##', 'aoClicar')).toThrow(/\[Borg\].*seletor/i)
  })

  it('lança erro explicativo para tipo inválido', () => {
    expect(() => resolverElementos(42, 'aoClicar')).toThrow(TypeError)
    expect(() => resolverElementos(undefined, 'aoClicar')).toThrow(/\[Borg\].*aoClicar/)
  })
})
