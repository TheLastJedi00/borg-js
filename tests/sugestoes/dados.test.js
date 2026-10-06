import { describe, it, expect } from 'vitest'
import * as Borg from '../../src/index.js'
import { SUGESTOES, escolherModelo } from '../../sugestoes/dados.js'

const nomes = SUGESTOES.map(({ nome }) => nome)

describe('dados das sugestões', () => {
  it('tem uma sugestão para cada função pública, sem sobras nem repetições', () => {
    expect([...nomes].sort()).toEqual(Object.keys(Borg).sort())
  })

  it.each(SUGESTOES)('$nome tem assinatura, descrição e modelo que começa pelo nome', (sugestao) => {
    expect(sugestao.assinatura.startsWith(`${sugestao.nome}(`)).toBe(true)
    expect(sugestao.descricao.length).toBeGreaterThan(10)
    expect(sugestao.modelo).toContain(`${sugestao.nome}(`)
  })

  it.each(SUGESTOES.filter(({ nome }) => nome.startsWith('ao')))(
    '$nome escreve a arrow function com "// reação" no corpo',
    ({ modelo }) => {
      expect(modelo).toMatch(/\) => \{\n\t\$\{0:\/\/ reação\}\n\}\)$/)
    },
  )

  it.each(SUGESTOES.filter(({ assinatura }) => assinatura.includes('(seletor')))(
    '$nome usa o seletor genérico #meu-seletor',
    ({ modelo }) => {
      expect(modelo).toContain("'${1:#meu-seletor}'")
    },
  )

  it.each(SUGESTOES)('$nome não tem chaves dentro dos campos editáveis', ({ modelo }) => {
    expect(modelo).not.toMatch(/\$\{\d+:[^}]*\{/)
  })
})

describe('escolherModelo', () => {
  const elemento = SUGESTOES.find(({ nome }) => nome === 'elemento')
  const mostrar = SUGESTOES.find(({ nome }) => nome === 'mostrar')

  it('no começo da linha, elemento já cria a variável com o nome editável', () => {
    expect(escolherModelo(elemento, '  ')).toBe(
      "const ${1:meuElemento} = elemento('${2:#meu-seletor}')$0",
    )
  })

  it('depois de um = ou dentro de uma chamada, entra só a chamada', () => {
    expect(escolherModelo(elemento, 'const nave = ')).toBe("elemento('${1:#meu-seletor}')$0")
    expect(escolherModelo(elemento, 'moverPara(')).toBe("elemento('${1:#meu-seletor}')$0")
  })

  it('as outras funções usam sempre o mesmo modelo', () => {
    expect(escolherModelo(mostrar, '')).toBe(mostrar.modelo)
  })
})
