import { describe, it, expect, vi } from 'vitest'
import { avisar, validarFuncao, validarTexto } from '../../src/nucleo/mensagens.js'

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
