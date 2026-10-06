import { describe, it, expect, vi } from 'vitest'
import { avisar, validarFuncao, validarTexto, validarVetor } from '../../src/nucleo/mensagens.js'

describe('mensagens', () => {
  it('avisar escreve no console com o prefixo [Borg]', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    avisar('olá')
    expect(aviso).toHaveBeenCalledWith('[Borg] olá')
  })

  it('validarFuncao aceita funções', () => {
    expect(() => validarFuncao(() => {}, 'aoClicar')).not.toThrow()
  })

  it('validarFuncao lança TypeError em português para não funções', () => {
    expect(() => validarFuncao('oi', 'aoClicar')).toThrow(TypeError)
    expect(() => validarFuncao(undefined, 'aoClicar')).toThrow(/\[Borg\] aoClicar.*função/)
  })

  it('validarTexto aceita strings não vazias e rejeita o resto', () => {
    expect(() => validarTexto('ativo', 'alternarClasse', 'classe')).not.toThrow()
    expect(() => validarTexto('', 'alternarClasse', 'classe')).toThrow(/\[Borg\] alternarClasse.*classe/)
    expect(() => validarTexto(3, 'alternarClasse', 'classe')).toThrow(TypeError)
  })
})

describe('validarVetor', () => {
  it('aceita um vetor com x e y, ou com só um dos eixos', () => {
    expect(() => validarVetor({ x: 10, y: -5 }, 'moverPara')).not.toThrow()
    expect(() => validarVetor({ x: 0 }, 'moverPara')).not.toThrow()
    expect(() => validarVetor({ y: 3.5 }, 'moverPor')).not.toThrow()
  })

  it('ignora outras propriedades do objeto', () => {
    expect(() => validarVetor({ x: 1, y: 2, largura: 30 }, 'moverPara')).not.toThrow()
  })

  it.each([
    ['nada', undefined],
    ['null', null],
    ['um número', 10],
    ['um array', [1, 2]],
    ['um objeto sem x nem y', { largura: 10 }],
  ])('rejeita %s com um exemplo de uso', (_, valor) => {
    expect(() => validarVetor(valor, 'moverPara')).toThrow(TypeError)
    expect(() => validarVetor(valor, 'moverPara')).toThrow(
      /\[Borg\] moverPara.*\{ x: 100, y: 50 \}/,
    )
  })

  it.each([
    ['texto', { x: '10' }],
    ['NaN', { x: Number.NaN }],
    ['infinito', { y: Infinity }],
  ])('rejeita um eixo que não é número finito (%s)', (_, valor) => {
    expect(() => validarVetor(valor, 'moverPor')).toThrow(/\[Borg\] moverPor.*número/)
  })
})
