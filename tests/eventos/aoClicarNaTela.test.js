import { describe, it, expect, vi, beforeEach } from 'vitest'
import { aoClicarNaTela } from '../../src/eventos/mouse.js'

function clicarEm(alvo, x, y) {
  alvo.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: y }))
}

describe('aoClicarNaTela', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="caixa"></div>'
  })

  it('executa o callback com a posição { x, y } do clique', () => {
    const callback = vi.fn()
    aoClicarNaTela(callback)
    clicarEm(document.body, 120, 45)
    expect(callback).toHaveBeenCalledWith({ x: 120, y: 45 })
  })

  it('reage a cliques em qualquer elemento da página', () => {
    const callback = vi.fn()
    aoClicarNaTela(callback)
    clicarEm(document.getElementById('caixa'), 10, 20)
    expect(callback).toHaveBeenCalledWith({ x: 10, y: 20 })
  })

  it('retorna parar(), que remove o evento', () => {
    const callback = vi.fn()
    const parar = aoClicarNaTela(callback)
    parar()
    clicarEm(document.body, 1, 1)
    expect(callback).not.toHaveBeenCalled()
  })

  it('lança erro em português quando o callback não é função', () => {
    expect(() => aoClicarNaTela()).toThrow(/\[Borg\] aoClicarNaTela/)
  })
})
