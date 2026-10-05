import { describe, it, expect, vi } from 'vitest'
import { aoMoverMouse } from '../../src/eventos/mouse.js'

function moverPara(x, y) {
  document.body.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }))
}

describe('aoMoverMouse', () => {
  it('executa o callback com a posição { x, y } a cada movimento', () => {
    const callback = vi.fn()
    aoMoverMouse(callback)
    moverPara(5, 6)
    moverPara(7, 8)
    expect(callback).toHaveBeenNthCalledWith(1, { x: 5, y: 6 })
    expect(callback).toHaveBeenNthCalledWith(2, { x: 7, y: 8 })
  })

  it('retorna parar(), que remove o evento', () => {
    const callback = vi.fn()
    aoMoverMouse(callback)()
    moverPara(1, 1)
    expect(callback).not.toHaveBeenCalled()
  })

  it('lança erro em português quando o callback não é função', () => {
    expect(() => aoMoverMouse(null)).toThrow(/\[Borg\] aoMoverMouse/)
  })
})
