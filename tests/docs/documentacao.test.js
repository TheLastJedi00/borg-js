import './ambiente-do-navegador.js'
import { describe, it, expect } from 'vitest'
import * as Borg from '../../src/index.js'
import { documentacaoEmMarkdown } from '../../docs/js/ia/documentacao.js'
import { URL_BORG_MJS, URL_BORG_JS, URL_DO_SITE } from '../../docs/js/config.js'
import { NOMES_DE_TECLA } from '../../src/teclado/teclas.js'

const md = documentacaoEmMarkdown()

/** Tira os blocos de código, onde HTML é esperado. */
const semCodigo = (texto) => texto.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

describe('documentacaoEmMarkdown', () => {
  it('começa com o título e diz de onde veio', () => {
    expect(md).toMatch(/^# Borg JS/)
    expect(md).toContain(URL_DO_SITE)
  })

  it('tem as seções na ordem combinada', () => {
    const secoes = ['## O que é a Borg JS', '## Como usar', '## Regras gerais', '## Funções', '## Receitas', '## Problemas comuns']
    const posicoes = secoes.map((secao) => md.indexOf(secao))
    posicoes.forEach((posicao, i) => expect(posicao, secoes[i]).toBeGreaterThan(-1))
    expect([...posicoes].sort((a, b) => a - b)).toEqual(posicoes)
  })

  it.each(Object.keys(Borg))('documenta %s com assinatura', (nome) => {
    expect(md).toMatch(new RegExp(`^#### \`${nome}\\(`, 'm'))
  })

  it('explica como usar com import e sem import', () => {
    expect(md).toContain(URL_BORG_MJS)
    expect(md).toContain(URL_BORG_JS)
    expect(md).toContain('type="module"')
  })

  it('lista os nomes de tecla aceitos', () => {
    NOMES_DE_TECLA.forEach((tecla) => expect(md).toContain(`'${tecla}'`))
  })

  it('cada exemplo de função traz o import da Borg', () => {
    const exemplosJs = [...md.matchAll(/```js\n([\s\S]*?)```/g)].map(([, codigo]) => codigo)
    const chamamABorg = exemplosJs.filter((codigo) => Object.keys(Borg).some((nome) => codigo.includes(`${nome}(`)))
    expect(chamamABorg.length).toBeGreaterThan(Object.keys(Borg).length)
    chamamABorg
      .filter((codigo) => !codigo.includes('Borg.'))
      .forEach((codigo) => expect(codigo).toContain(`from '${URL_BORG_MJS}'`))
  })

  it('não sobra HTML fora dos blocos de código', () => {
    expect(semCodigo(md)).not.toMatch(/<\/?(p|code|strong|em|a|div|aside|ul|li|table|h\d)\b/)
  })

  it('traz os problemas comuns como tabela', () => {
    expect(md).toContain('| O que aparece | O que fazer |')
    expect(md).toContain('Cannot use import statement outside a module')
  })
})
