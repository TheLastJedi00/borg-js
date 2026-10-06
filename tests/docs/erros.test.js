import { describe, it, expect } from 'vitest'
import { explicarErro } from '../../docs/js/playground/erros.js'

describe('explicarErro', () => {
  it('explica uma função importada que a Borg não tem', () => {
    const dica = explicarErro(
      "Uncaught SyntaxError: The requested module 'https://borg.lenoborges.com.br/borg.mjs' does not provide an export named 'aoClicr'",
    )
    expect(dica).toContain('aoClicr')
    expect(dica).toContain('import')
  })

  it('explica um nome que não foi definido', () => {
    const dica = explicarErro('Uncaught ReferenceError: mostrar is not defined')
    expect(dica).toContain('mostrar')
    expect(dica).toMatch(/importar|import/)
  })

  it('explica erros de sintaxe', () => {
    expect(explicarErro('Uncaught SyntaxError: Unexpected end of input')).toMatch(/parênteses|chaves/)
    expect(explicarErro("Uncaught SyntaxError: Unexpected token '}'")).toMatch(/parênteses|chaves/)
    expect(explicarErro('Uncaught SyntaxError: missing ) after argument list')).toMatch(/parênteses|chaves/)
  })

  it('explica o uso de um elemento que não existe', () => {
    expect(explicarErro("Cannot read properties of null (reading 'addEventListener')")).toContain('seletor')
  })

  it('não inventa dica para mensagens da própria Borg, que já explicam o problema', () => {
    expect(explicarErro('[Borg] aoClicar: nenhum elemento encontrado para "#x".')).toBeNull()
  })

  it('devolve null quando não conhece o erro', () => {
    expect(explicarErro('algo totalmente diferente')).toBeNull()
  })
})
