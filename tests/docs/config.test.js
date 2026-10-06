import { describe, it, expect } from 'vitest'
import {
  URL_DO_SITE,
  URL_BORG_MJS,
  URL_BORG_JS,
  URL_EXTENSAO_MARKETPLACE,
  URL_EXTENSAO_OPEN_VSX,
  linhaDeImport,
  comImport,
} from '../../docs/js/config.js'
import extensao from '../../extensao-vscode/package.json'

describe('config do site', () => {
  it('usa o domínio oficial', () => {
    expect(URL_DO_SITE).toBe('https://borg.lenoborges.br')
  })

  it('deriva as URLs dos dois builds a partir do domínio', () => {
    expect(URL_BORG_MJS).toBe(`${URL_DO_SITE}/borg.mjs`)
    expect(URL_BORG_JS).toBe(`${URL_DO_SITE}/borg.js`)
  })

  it('aponta para a extensão com o mesmo publisher e nome do package.json dela', () => {
    const { publisher, name } = extensao
    expect(URL_EXTENSAO_MARKETPLACE).toBe(`https://marketplace.visualstudio.com/items?itemName=${publisher}.${name}`)
    expect(URL_EXTENSAO_OPEN_VSX).toBe(`https://open-vsx.org/extension/${publisher}/${name}`)
  })
})

describe('linhaDeImport', () => {
  it('monta o import com exports nomeados a partir da URL pública', () => {
    expect(linhaDeImport(['aoClicar', 'mostrar'])).toBe(
      `import { aoClicar, mostrar } from '${URL_BORG_MJS}'`,
    )
  })

  it('quebra em várias linhas quando passaria de 80 caracteres', () => {
    const nomes = ['aoMoverMouse', 'mudarEstilo', 'aoClicarNaTela', 'alternarClasse']
    expect(linhaDeImport(nomes)).toBe(
      `import {\n  aoMoverMouse,\n  mudarEstilo,\n  aoClicarNaTela,\n  alternarClasse,\n} from '${URL_BORG_MJS}'`,
    )
  })
})

describe('comImport', () => {
  it('adiciona o import das funções usadas, na ordem em que aparecem', () => {
    const js = "mostrar('#a')\naoClicar('#b', () => mudarTexto('#c', 1))"

    expect(comImport(js)).toBe(
      `${linhaDeImport(['mostrar', 'aoClicar', 'mudarTexto'])}\n\n${js}`,
    )
  })

  it('ignora espaços em branco nas pontas do código', () => {
    expect(comImport("\n\nesconder('#a')\n")).toBe(
      `import { esconder } from '${URL_BORG_MJS}'\n\nesconder('#a')`,
    )
  })

  it('conta cada função só uma vez', () => {
    expect(comImport("mostrar('#a')\nmostrar('#b')")).toMatch(/^import \{ mostrar \} from/)
  })

  it('só considera chamadas, não palavras soltas em textos', () => {
    expect(comImport("aoClicar('#b', () => {}) // mostrar depois")).toMatch(/^import \{ aoClicar \} from/)
  })

  it('não mexe no código que já importa a Borg', () => {
    const js = `import { mostrar } from '${URL_BORG_MJS}'\n\nmostrar('#a')`
    expect(comImport(js)).toBe(js)
  })

  it('não adiciona import quando nenhuma função da Borg é usada', () => {
    expect(comImport('console.log(1)')).toBe('console.log(1)')
  })
})
