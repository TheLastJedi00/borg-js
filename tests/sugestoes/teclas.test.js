import { describe, it, expect } from 'vitest'
import { sugestoesDeTecla } from '../../sugestoes/teclas.js'
import { normalizarTecla } from '../../src/teclado/teclas.js'

describe('sugestoesDeTecla', () => {
  it.each(['aoPressionar', 'aoSoltar', 'teclaPressionada'])(
    'reconhece as aspas do primeiro argumento de %s',
    (nome) => {
      const sugestao = sugestoesDeTecla(`if (${nome}('`)
      expect(sugestao.teclas).toContain('espaço')
      expect(sugestao.teclas).toContain('seta cima')
    },
  )

  it('indica onde começa o que já foi digitado da tecla', () => {
    const texto = "aoPressionar('seta"
    expect(sugestoesDeTecla(texto).inicio).toBe(texto.length - 'seta'.length)
  })

  it('aceita aspas duplas e espaço antes das aspas', () => {
    expect(sugestoesDeTecla('aoSoltar( "es')).not.toBeNull()
  })

  it('não sugere fora das aspas, em outros argumentos ou em outras funções', () => {
    expect(sugestoesDeTecla('aoPressionar(')).toBeNull()
    expect(sugestoesDeTecla("aoPressionar('a', '")).toBeNull()
    expect(sugestoesDeTecla("aoPressionar('espaço') + '")).toBeNull()
    expect(sugestoesDeTecla("aoClicar('")).toBeNull()
  })

  it('só sugere nomes que a Borg aceita, sem o apelido sem acento', () => {
    const { teclas } = sugestoesDeTecla("aoPressionar('")
    teclas.forEach((tecla) => expect(() => normalizarTecla(tecla, 'teste')).not.toThrow())
    expect(teclas).not.toContain('espaco')
  })
})
