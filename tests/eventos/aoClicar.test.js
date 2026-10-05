import { describe, it, expect, vi, beforeEach } from 'vitest'
import { aoClicar } from '../../src/eventos/mouse.js'

describe('aoClicar', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="botao">A</button>
      <button class="opcao">1</button>
      <button class="opcao">2</button>
    `
  })

  it('executa o callback quando o elemento é clicado', () => {
    const callback = vi.fn()
    aoClicar('#botao', callback)
    document.getElementById('botao').click()
    expect(callback).toHaveBeenCalledOnce()
  })

  it('entrega ao callback o elemento clicado', () => {
    const callback = vi.fn()
    aoClicar('.opcao', callback)
    const [, segunda] = document.querySelectorAll('.opcao')
    segunda.click()
    expect(callback).toHaveBeenCalledWith(segunda)
  })

  it('vale para todos os elementos encontrados pelo seletor', () => {
    const callback = vi.fn()
    aoClicar('.opcao', callback)
    document.querySelectorAll('.opcao').forEach((botao) => botao.click())
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('aceita um elemento do DOM', () => {
    const callback = vi.fn()
    const botao = document.getElementById('botao')
    aoClicar(botao, callback)
    botao.click()
    expect(callback).toHaveBeenCalledWith(botao)
  })

  it('retorna parar(), que remove o evento de todos os elementos', () => {
    const callback = vi.fn()
    const parar = aoClicar('.opcao', callback)
    expect(typeof parar).toBe('function')
    parar()
    document.querySelectorAll('.opcao').forEach((botao) => botao.click())
    expect(callback).not.toHaveBeenCalled()
  })

  it('lança erro em português quando o callback não é função', () => {
    expect(() => aoClicar('#botao', 'oi')).toThrow(/\[Borg\] aoClicar/)
  })

  it('apenas avisa quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const parar = aoClicar('#nao-existe', () => {})
    expect(aviso).toHaveBeenCalledOnce()
    expect(() => parar()).not.toThrow()
  })
})
