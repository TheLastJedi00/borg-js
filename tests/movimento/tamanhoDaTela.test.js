import { describe, it, expect, vi } from 'vitest'
import { tamanhoDaTela } from '../../src/movimento/leitura.js'

describe('tamanhoDaTela', () => {
  it('devolve a largura e a altura da janela visível', () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(720)
    expect(tamanhoDaTela()).toEqual({ largura: 1280, altura: 720 })
  })
})
