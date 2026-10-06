import { describe, it, expect } from 'vitest'
import { URL_DO_SITE, URL_BORG_MJS, URL_BORG_JS, linhaDeImport, comImport } from '../../docs/js/config.js'

describe('config do site', () => {
  it('usa o domínio oficial', () => {
    expect(URL_DO_SITE).toBe('https://borg.lenoborges.br')
  })

  it('deriva as URLs dos dois builds a partir do domínio', () => {
    expect(URL_BORG_MJS).toBe(`${URL_DO_SITE}/borg.mjs`)
    expect(URL_BORG_JS).toBe(`${URL_DO_SITE}/borg.js`)
  })
})

describe('linhaDeImport', () => {
  it('monta o import com exports nomeados a partir da URL pública', () => {
    expect(linhaDeImport(['aoClicar', 'mostrar'])).toBe(
      `import { aoClicar, mostrar } from '${URL_BORG_MJS}'`,
    )
  })
})

describe('comImport', () => {
  it('adiciona o import das funções usadas, na ordem em que aparecem', () => {
    const js = "mostrar('#a')\naoClicar('#b', () => mudarTexto('#c', 1))"

    expect(comImport(js)).toBe(
      `import { mostrar, aoClicar, mudarTexto } from '${URL_BORG_MJS}'\n\n${js}`,
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
