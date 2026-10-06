import { describe, it, expect } from 'vitest'
import {
  regiaoDeCodigo,
  sugestoesDeFuncao,
  sugestoesDeTeclaNoDocumento,
} from '../../extensao-vscode/src/provedor.js'
import { URL_BORG_MJS } from '../../docs/js/config.js'

/** Separa o texto e a posição do cursor, marcada com `|`. */
function comCursor(textoComCursor) {
  return { texto: textoComCursor.replace('|', ''), posicao: textoComCursor.indexOf('|') }
}

function funcoes(textoComCursor, linguagem = 'javascript') {
  const { texto, posicao } = comCursor(textoComCursor)
  return sugestoesDeFuncao(texto, posicao, linguagem)
}

const item = (resultado, nome) => resultado.itens.find((sugestao) => sugestao.nome === nome)

describe('regiaoDeCodigo', () => {
  it('em arquivos JavaScript, o arquivo inteiro é código de módulo', () => {
    expect(regiaoDeCodigo('abc', 1, 'javascript')).toEqual({ inicio: 0, fim: 3, modulo: true })
  })

  it('em HTML, só vale dentro de <script>, e diz se é módulo', () => {
    const html = '<p>oi</p>\n<script type="module">\nmodulo1\n</script>\n<script>\nclassico2\n</script>'
    expect(regiaoDeCodigo(html, 2, 'html')).toBeNull()
    const modulo = regiaoDeCodigo(html, html.indexOf('modulo1'), 'html')
    expect(html.slice(modulo.inicio, modulo.fim)).toBe('\nmodulo1\n')
    expect(modulo.modulo).toBe(true)
    expect(regiaoDeCodigo(html, html.indexOf('classico2'), 'html').modulo).toBe(false)
  })

  it('ignora <script> com src e outras linguagens', () => {
    const html = '<script src="borg.js">x</script>'
    expect(regiaoDeCodigo(html, html.indexOf('x'), 'html')).toBeNull()
    expect(regiaoDeCodigo('x', 0, 'css')).toBeNull()
  })
})

describe('sugestoesDeFuncao', () => {
  it('sugere todas as funções da Borg a partir do começo da palavra', () => {
    const resultado = funcoes('const a = 1\naoCli|')
    expect(resultado.inicioDaPalavra).toBe('const a = 1\n'.length)
    expect(item(resultado, 'aoClicar')).toMatchObject({
      assinatura: 'aoClicar(seletor, callback)',
      modelo: "aoClicar('${1:#meu-seletor}', (${2:elemento}) => {\n\t${0:// reação}\n})",
    })
  })

  it('em JavaScript, cria o import da Borg ao aceitar', () => {
    const resultado = funcoes('mostr|')
    expect(item(resultado, 'mostrar').edicao).toEqual({
      de: 0,
      ate: 0,
      texto: `import { mostrar } from '${URL_BORG_MJS}'\n\n`,
    })
  })

  it('completa o import que já existe', () => {
    const codigo = `import { mostrar } from '${URL_BORG_MJS}'\n\nescon|`
    expect(item(funcoes(codigo), 'esconder').edicao.texto).toBe(
      `import { esconder, mostrar } from '${URL_BORG_MJS}'`,
    )
    expect(item(funcoes(codigo), 'mostrar').edicao).toBeNull()
  })

  it('dentro das chaves do import, sugere só o nome', () => {
    const resultado = funcoes(`import { mostrar, escon| } from '${URL_BORG_MJS}'`)
    expect(item(resultado, 'esconder')).toMatchObject({ modelo: 'esconder', edicao: null })
  })

  it('depois de Borg., escreve a chamada sem import; depois de outro ponto, não sugere', () => {
    expect(item(funcoes('Borg.mostr|'), 'mostrar')).toMatchObject({
      modelo: "mostrar('${1:#meu-seletor}')$0",
      edicao: null,
    })
    expect(funcoes('console.mostr|')).toBeNull()
  })

  it('não sugere dentro de texto ou de comentário', () => {
    expect(funcoes("mudarTexto('#a', 'aoCli|")).toBeNull()
    expect(funcoes('// aoCli|')).toBeNull()
  })

  it('no começo da linha, elemento cria a variável', () => {
    expect(item(funcoes('  elem|'), 'elemento').modelo).toBe(
      "const ${1:meuElemento} = elemento('${2:#meu-seletor}')$0",
    )
  })

  it('em <script type="module"> no HTML, o import entra no começo do script', () => {
    const html = '<body>\n<script type="module">\nmostr|\n</script>'
    const { texto, posicao } = comCursor(html)
    const edicao = item(sugestoesDeFuncao(texto, posicao, 'html'), 'mostrar').edicao
    expect(edicao.de).toBe(texto.indexOf('\nmostr'))
    expect(edicao.texto).toBe(`import { mostrar } from '${URL_BORG_MJS}'\n\n`)
  })

  it('em <script> sem módulo no HTML, usa o objeto global Borg e não cria import', () => {
    const html = '<script>\naoCli|\n</script>'
    const { texto, posicao } = comCursor(html)
    const resultado = sugestoesDeFuncao(texto, posicao, 'html')
    expect(item(resultado, 'aoClicar').modelo.startsWith("Borg.aoClicar('${1:#meu-seletor}'")).toBe(true)
    expect(item(resultado, 'aoClicar').edicao).toBeNull()
  })

  it('em <script> sem módulo, elemento no começo da linha vira const x = Borg.elemento(...)', () => {
    const { texto, posicao } = comCursor('<script>\nelem|\n</script>')
    expect(item(sugestoesDeFuncao(texto, posicao, 'html'), 'elemento').modelo).toBe(
      "const ${1:meuElemento} = Borg.elemento('${2:#meu-seletor}')$0",
    )
  })

  it('fora de <script> no HTML, não sugere', () => {
    const { texto, posicao } = comCursor('<p>aoCli|</p>')
    expect(sugestoesDeFuncao(texto, posicao, 'html')).toBeNull()
  })
})

describe('sugestoesDeTeclaNoDocumento', () => {
  it('sugere teclas dentro das aspas, com o início do que já foi digitado', () => {
    const { texto, posicao } = comCursor("x()\naoPressionar('se|')")
    const resultado = sugestoesDeTeclaNoDocumento(texto, posicao, 'javascript')
    expect(resultado.inicio).toBe(texto.indexOf('se'))
    expect(resultado.teclas).toContain('seta cima')
  })

  it('funciona dentro de <script> no HTML e não sugere fora dele', () => {
    const dentro = comCursor("<script>teclaPressionada('|')</script>")
    expect(sugestoesDeTeclaNoDocumento(dentro.texto, dentro.posicao, 'html')).not.toBeNull()
    const fora = comCursor("<p>aoPressionar('|')</p>")
    expect(sugestoesDeTeclaNoDocumento(fora.texto, fora.posicao, 'html')).toBeNull()
  })
})
