import { describe, it, expect } from 'vitest'
import { tokensFaltando, mensagemDeTokensFaltando } from '../../build/publicacao.js'

const variaveis = (faltando) => faltando.map(({ variavel }) => variavel)

describe('tokensFaltando', () => {
  it('não falta nada quando os dois tokens estão definidos', () => {
    expect(tokensFaltando({ VSCE_PAT: 'a', OVSX_PAT: 'b' })).toEqual([])
  })

  it('aponta cada token ausente ou vazio', () => {
    expect(variaveis(tokensFaltando({}))).toEqual(['VSCE_PAT', 'OVSX_PAT'])
    expect(variaveis(tokensFaltando({ VSCE_PAT: '  ', OVSX_PAT: 'b' }))).toEqual(['VSCE_PAT'])
  })

  it('com --azure-credential, o Marketplace não precisa de VSCE_PAT', () => {
    expect(variaveis(tokensFaltando({}, { azureCredential: true }))).toEqual(['OVSX_PAT'])
  })
})

describe('mensagemDeTokensFaltando', () => {
  it('diz que nada foi publicado e qual variável definir', () => {
    const mensagem = mensagemDeTokensFaltando(tokensFaltando({ VSCE_PAT: 'a' }))
    expect(mensagem).toMatch(/Nada foi publicado/)
    expect(mensagem).toMatch(/OVSX_PAT \(Open VSX\)/)
    expect(mensagem).not.toMatch(/VSCE_PAT/)
  })
})
