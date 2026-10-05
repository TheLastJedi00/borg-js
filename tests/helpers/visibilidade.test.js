import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mostrar, esconder } from '../../src/helpers/visibilidade.js'

const visivel = (elemento) => getComputedStyle(elemento).display !== 'none'

describe('mostrar e esconder', () => {
  beforeEach(() => {
    document.head.innerHTML = '<style>.oculto-no-css { display: none; }</style>'
    document.body.innerHTML = `
      <p id="texto">Olá</p>
      <p id="com-hidden" hidden>Escondido</p>
      <div id="flex" style="display: flex">Flex</div>
      <span id="no-css" class="oculto-no-css">CSS</span>
      <li class="item">1</li>
      <li class="item">2</li>
    `
  })

  it('esconder deixa o elemento invisível', () => {
    const texto = document.getElementById('texto')
    esconder('#texto')
    expect(visivel(texto)).toBe(false)
  })

  it('mostrar exibe um elemento com o atributo hidden', () => {
    const elemento = document.getElementById('com-hidden')
    mostrar('#com-hidden')
    expect(elemento.hidden).toBe(false)
    expect(visivel(elemento)).toBe(true)
  })

  it('mostrar exibe um elemento escondido por uma classe do CSS', () => {
    const elemento = document.getElementById('no-css')
    mostrar(elemento)
    expect(visivel(elemento)).toBe(true)
  })

  it('esconder e depois mostrar restaura o display original do elemento', () => {
    const elemento = document.getElementById('flex')
    esconder('#flex')
    mostrar('#flex')
    expect(elemento.style.display).toBe('flex')
  })

  it('funcionam para vários elementos de uma vez', () => {
    esconder('.item')
    document.querySelectorAll('.item').forEach((item) => expect(visivel(item)).toBe(false))
    mostrar('.item')
    document.querySelectorAll('.item').forEach((item) => expect(visivel(item)).toBe(true))
  })

  it('chamar duas vezes não causa problema', () => {
    const elemento = document.getElementById('flex')
    esconder('#flex')
    esconder('#flex')
    mostrar('#flex')
    mostrar('#flex')
    expect(elemento.style.display).toBe('flex')
  })

  it('avisam quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mostrar('#nao-existe')
    esconder('#nao-existe')
    expect(aviso).toHaveBeenCalledTimes(2)
    expect(aviso.mock.calls[0][0]).toContain('mostrar')
    expect(aviso.mock.calls[1][0]).toContain('esconder')
  })
})
