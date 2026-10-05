import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mudarTexto } from '../../src/helpers/texto.js'

describe('mudarTexto', () => {
  beforeEach(() => {
    document.body.innerHTML = '<h1 id="titulo">Antigo</h1><span class="contador">0</span><span class="contador">0</span>'
  })

  it('troca o texto do elemento', () => {
    mudarTexto('#titulo', 'Novo')
    expect(document.getElementById('titulo').textContent).toBe('Novo')
  })

  it('aceita números', () => {
    mudarTexto('.contador', 42)
    document.querySelectorAll('.contador').forEach((c) => expect(c.textContent).toBe('42'))
  })

  it('trata o texto como texto, sem interpretar HTML', () => {
    mudarTexto('#titulo', '<b>oi</b>')
    const titulo = document.getElementById('titulo')
    expect(titulo.textContent).toBe('<b>oi</b>')
    expect(titulo.querySelector('b')).toBeNull()
  })

  it('valida o texto com mensagem em português', () => {
    expect(() => mudarTexto('#titulo')).toThrow(/\[Borg\] mudarTexto.*texto/)
    expect(() => mudarTexto('#titulo', {})).toThrow(TypeError)
  })

  it('avisa quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mudarTexto('#nao-existe', 'x')
    expect(aviso).toHaveBeenCalledOnce()
  })
})
