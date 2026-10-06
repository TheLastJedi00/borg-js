import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { aoEntrarNaTela, aoSairDaTela } from '../../src/movimento/tela.js'

/** IntersectionObserver falso: o teste decide quando cada elemento entra ou sai. */
class ObservadorFalso {
  static instancias = []

  constructor(callback) {
    this.callback = callback
    this.observados = []
    this.desligado = false
    ObservadorFalso.instancias.push(this)
  }

  observe(alvo) {
    this.observados.push(alvo)
  }

  disconnect() {
    this.desligado = true
    this.observados = []
  }

  /** @param {Array<[Element, boolean]>} mudancas */
  notificar(mudancas) {
    const entradas = mudancas
      .filter(([alvo]) => this.observados.includes(alvo))
      .map(([target, isIntersecting]) => ({ target, isIntersecting }))
    if (entradas.length > 0) this.callback(entradas, this)
  }
}

const notificar = (...mudancas) =>
  ObservadorFalso.instancias.forEach((observador) => observador.notificar(mudancas))

describe('aoEntrarNaTela e aoSairDaTela', () => {
  let a
  let b

  beforeEach(() => {
    ObservadorFalso.instancias = []
    vi.stubGlobal('IntersectionObserver', ObservadorFalso)
    document.body.innerHTML = '<div id="a" class="item"></div><div id="b" class="item"></div>'
    a = document.getElementById('a')
    b = document.getElementById('b')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('aoEntrarNaTela chama o callback com o elemento quando ele aparece', () => {
    const callback = vi.fn()
    aoEntrarNaTela('#a', callback)
    notificar([a, false])
    expect(callback).not.toHaveBeenCalled()
    notificar([a, true])
    expect(callback).toHaveBeenCalledExactlyOnceWith(a)
  })

  it('aoEntrarNaTela dispara uma vez na chamada se o elemento já está na tela', () => {
    const callback = vi.fn()
    aoEntrarNaTela('#a', callback)
    notificar([a, true])
    expect(callback).toHaveBeenCalledOnce()
  })

  it('aoSairDaTela chama o callback quando o elemento some da tela', () => {
    const callback = vi.fn()
    aoSairDaTela('#a', callback)
    notificar([a, true])
    notificar([a, false])
    expect(callback).toHaveBeenCalledExactlyOnceWith(a)
  })

  it('aoSairDaTela não dispara na chamada para um elemento que já está fora', () => {
    const callback = vi.fn()
    aoSairDaTela('#a', callback)
    notificar([a, false])
    expect(callback).not.toHaveBeenCalled()
    notificar([a, true])
    notificar([a, false])
    expect(callback).toHaveBeenCalledOnce()
  })

  it('acompanha cada elemento do seletor separadamente', () => {
    const callback = vi.fn()
    aoSairDaTela('.item', callback)
    notificar([a, false], [b, true])
    notificar([b, false])
    expect(callback).toHaveBeenCalledExactlyOnceWith(b)
  })

  it.each([
    ['aoEntrarNaTela', aoEntrarNaTela],
    ['aoSairDaTela', aoSairDaTela],
  ])('%s retorna parar(), que desliga o observador', (_, funcao) => {
    const callback = vi.fn()
    const parar = funcao('#a', callback)
    parar()
    expect(ObservadorFalso.instancias[0].desligado).toBe(true)
    notificar([a, true])
    notificar([a, false])
    expect(callback).not.toHaveBeenCalled()
  })

  it.each([
    ['aoEntrarNaTela', aoEntrarNaTela],
    ['aoSairDaTela', aoSairDaTela],
  ])('%s valida o callback com mensagem em português', (nome, funcao) => {
    expect(() => funcao('#a', 'oi')).toThrow(new RegExp(`${nome}.*função`))
  })

  it('avisa e retorna parar() mesmo quando o seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const parar = aoEntrarNaTela('#nao-existe', () => {})
    expect(aviso.mock.calls[0][0]).toContain('[Borg] aoEntrarNaTela:')
    expect(() => parar()).not.toThrow()
  })
})
