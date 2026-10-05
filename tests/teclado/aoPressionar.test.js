import { describe, it, expect, vi, beforeEach } from 'vitest'
import { aoPressionar } from '../../src/teclado/eventos.js'

function pressionar(key, opcoes = {}, alvo = document.body) {
  const evento = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opcoes })
  alvo.dispatchEvent(evento)
  return evento
}

describe('aoPressionar', () => {
  beforeEach(() => {
    document.body.innerHTML = '<input id="campo">'
  })

  it('executa o callback quando a tecla é pressionada', () => {
    const callback = vi.fn()
    aoPressionar('a', callback)
    pressionar('a')
    expect(callback).toHaveBeenCalledWith('a')
  })

  it('não diferencia maiúsculas (Shift + A também conta)', () => {
    const callback = vi.fn()
    aoPressionar('a', callback)
    pressionar('A', { shiftKey: true })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('ignora outras teclas', () => {
    const callback = vi.fn()
    aoPressionar('enter', callback)
    pressionar('a')
    expect(callback).not.toHaveBeenCalled()
  })

  it('reconhece nomes especiais em português', () => {
    const callback = vi.fn()
    aoPressionar('seta cima', callback)
    aoPressionar('espaço', callback)
    pressionar('ArrowUp')
    pressionar(' ')
    expect(callback).toHaveBeenNthCalledWith(1, 'seta cima')
    expect(callback).toHaveBeenNthCalledWith(2, 'espaço')
  })

  it('com "qualquer", reage a qualquer tecla e entrega o nome dela em português', () => {
    const callback = vi.fn()
    aoPressionar('qualquer', callback)
    pressionar('x')
    pressionar('Escape')
    expect(callback).toHaveBeenNthCalledWith(1, 'x')
    expect(callback).toHaveBeenNthCalledWith(2, 'esc')
  })

  it('dispara uma vez por toque, ignorando a repetição de tecla segurada', () => {
    const callback = vi.fn()
    aoPressionar('a', callback)
    pressionar('a')
    pressionar('a', { repeat: true })
    expect(callback).toHaveBeenCalledOnce()
  })

  it('impede a rolagem da página para espaço e setas registrados', () => {
    aoPressionar('espaço', () => {})
    aoPressionar('seta baixo', () => {})
    expect(pressionar(' ').defaultPrevented).toBe(true)
    expect(pressionar('ArrowDown').defaultPrevented).toBe(true)
  })

  it('não impede a digitação de espaço dentro de campos de texto', () => {
    aoPressionar('espaço', () => {})
    const evento = pressionar(' ', {}, document.getElementById('campo'))
    expect(evento.defaultPrevented).toBe(false)
  })

  it('retorna parar(), que remove o evento', () => {
    const callback = vi.fn()
    aoPressionar('a', callback)()
    pressionar('a')
    expect(callback).not.toHaveBeenCalled()
  })

  it('valida a tecla e o callback com mensagens em português', () => {
    expect(() => aoPressionar('seta', () => {})).toThrow(/\[Borg\] aoPressionar/)
    expect(() => aoPressionar('a')).toThrow(/\[Borg\] aoPressionar.*função/)
  })
})
