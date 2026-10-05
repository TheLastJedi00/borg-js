import { describe, it, expect, beforeEach } from 'vitest'
import { teclaPressionada, reiniciarEstadoDoTeclado } from '../../src/teclado/estado.js'

function evento(tipo, key) {
  document.body.dispatchEvent(new KeyboardEvent(tipo, { key, bubbles: true }))
}

describe('teclaPressionada', () => {
  beforeEach(() => {
    reiniciarEstadoDoTeclado()
    teclaPressionada('a') // começa a monitorar o teclado
  })

  it('retorna true enquanto a tecla está pressionada e false depois de solta', () => {
    expect(teclaPressionada('seta cima')).toBe(false)
    evento('keydown', 'ArrowUp')
    expect(teclaPressionada('seta cima')).toBe(true)
    evento('keyup', 'ArrowUp')
    expect(teclaPressionada('seta cima')).toBe(false)
  })

  it('não diferencia maiúsculas', () => {
    evento('keydown', 'A')
    expect(teclaPressionada('a')).toBe(true)
    evento('keyup', 'a')
    expect(teclaPressionada('A')).toBe(false)
  })

  it('acompanha várias teclas ao mesmo tempo', () => {
    evento('keydown', 'ArrowLeft')
    evento('keydown', ' ')
    expect(teclaPressionada('seta esquerda')).toBe(true)
    expect(teclaPressionada('espaço')).toBe(true)
  })

  it('com "qualquer", diz se há alguma tecla pressionada', () => {
    expect(teclaPressionada('qualquer')).toBe(false)
    evento('keydown', 'x')
    expect(teclaPressionada('qualquer')).toBe(true)
  })

  it('esquece as teclas quando a janela perde o foco', () => {
    evento('keydown', 'ArrowUp')
    window.dispatchEvent(new Event('blur'))
    expect(teclaPressionada('seta cima')).toBe(false)
  })

  it('valida a tecla com mensagem em português', () => {
    expect(() => teclaPressionada('pular')).toThrow(/\[Borg\] teclaPressionada/)
  })
})
