import { describe, it, expect, vi, beforeEach } from 'vitest'
import { posicao, tamanho } from '../../src/movimento/leitura.js'
import { simularRetangulo } from './retangulo.js'

describe('posicao e tamanho', () => {
  let nave

  beforeEach(() => {
    document.body.innerHTML = '<div id="nave"></div><p class="item"></p><p class="item"></p>'
    nave = document.getElementById('nave')
    simularRetangulo(nave, { x: 40, y: 25, largura: 60, altura: 30 })
  })

  it('posicao devolve só o vetor { x, y } do canto superior esquerdo', () => {
    expect(posicao('#nave')).toEqual({ x: 40, y: 25 })
  })

  it('posicao aceita o elemento no lugar do seletor', () => {
    expect(posicao(nave)).toEqual({ x: 40, y: 25 })
  })

  it('posicao lê a posição atual a cada chamada', () => {
    simularRetangulo(nave, { x: 41, y: 25, largura: 60, altura: 30 })
    expect(posicao(nave).x).toBe(41)
  })

  it('tamanho devolve { largura, altura }', () => {
    expect(tamanho('#nave')).toEqual({ largura: 60, altura: 30 })
  })

  it('usam o primeiro elemento quando o seletor encontra vários', () => {
    const [primeiro] = document.querySelectorAll('.item')
    simularRetangulo(primeiro, { x: 1, y: 2, largura: 3, altura: 4 })
    expect(posicao('.item')).toEqual({ x: 1, y: 2 })
    expect(tamanho('.item')).toEqual({ largura: 3, altura: 4 })
  })

  it.each([
    ['posicao', posicao],
    ['tamanho', tamanho],
  ])('%s devolve null e avisa quando não encontra nada', (nome, funcao) => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(funcao('#nao-existe')).toBeNull()
    expect(aviso.mock.calls[0][0]).toContain(`[Borg] ${nome}:`)
  })
})
