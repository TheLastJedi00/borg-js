import { describe, it, expect, vi } from 'vitest'
import { aoSoltar } from '../../src/teclado/eventos.js'

function soltar(key) {
  document.body.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
}

function pressionar(key) {
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

describe('aoSoltar', () => {
  it('executa o callback quando a tecla é solta, e não quando é pressionada', () => {
    const callback = vi.fn()
    aoSoltar('seta direita', callback)
    pressionar('ArrowRight')
    expect(callback).not.toHaveBeenCalled()
    soltar('ArrowRight')
    expect(callback).toHaveBeenCalledWith('seta direita')
  })

  it('com "qualquer", reage a qualquer tecla solta', () => {
    const callback = vi.fn()
    aoSoltar('qualquer', callback)
    soltar('z')
    expect(callback).toHaveBeenCalledWith('z')
  })

  it('retorna parar(), que remove o evento', () => {
    const callback = vi.fn()
    aoSoltar('a', callback)()
    soltar('a')
    expect(callback).not.toHaveBeenCalled()
  })

  it('valida os parâmetros com mensagens em português', () => {
    expect(() => aoSoltar('', () => {})).toThrow(/\[Borg\] aoSoltar/)
    expect(() => aoSoltar('a', 1)).toThrow(/\[Borg\] aoSoltar/)
  })
})
