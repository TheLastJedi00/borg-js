import { describe, it, expect, afterEach } from 'vitest'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { CompletionContext } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { fonteDeFuncoes, fonteDeTeclas } from '../../docs/js/codigo/autocomplete.js'
import { URL_BORG_MJS } from '../../docs/js/config.js'

/** Cria um estado com o cursor onde estiver o `|`. */
function estadoCom(textoComCursor) {
  const cursor = textoComCursor.indexOf('|')
  const doc = textoComCursor.replace('|', '')
  return EditorState.create({ doc, selection: { anchor: cursor }, extensions: [javascript()] })
}

function completar(fonte, textoComCursor, explicito = false) {
  const estado = estadoCom(textoComCursor)
  return fonte(new CompletionContext(estado, estado.selection.main.head, explicito))
}

// O jsdom não mede layout; o CodeMirror pede essas medidas depois de cada atualização.
Range.prototype.getClientRects ??= () => []
Range.prototype.getBoundingClientRect ??= () => new DOMRect()

let vista

afterEach(() => {
  vista?.destroy()
  vista = undefined
})

/** Aceita a sugestão `nome` em um editor de verdade e devolve o código final. */
function aceitar(textoComCursor, nome) {
  const estado = estadoCom(textoComCursor)
  vista = new EditorView({ state: estado, parent: document.body })
  const resultado = fonteDeFuncoes(new CompletionContext(estado, estado.selection.main.head, false))
  const opcao = resultado.options.find(({ label }) => label === nome)
  const ate = estado.selection.main.head
  if (typeof opcao.apply === 'string') {
    vista.dispatch({ changes: { from: resultado.from, to: ate, insert: opcao.apply } })
  } else {
    opcao.apply(vista, opcao, resultado.from, ate)
  }
  return vista.state.doc.toString()
}

describe('fonteDeFuncoes', () => {
  it('sugere as funções da Borg com assinatura e descrição', () => {
    const resultado = completar(fonteDeFuncoes, 'aoCli|')
    const aoClicar = resultado.options.find(({ label }) => label === 'aoClicar')
    expect(aoClicar.detail).toBe('aoClicar(seletor, callback)')
    expect(aoClicar.info).toMatch(/clicado/)
    expect(resultado.from).toBe(0)
  })

  it('não sugere sem palavra digitada, dentro de texto ou de comentário', () => {
    expect(completar(fonteDeFuncoes, '|')).toBeNull()
    expect(completar(fonteDeFuncoes, "mudarTexto('#a', 'aoCli|')")).toBeNull()
    expect(completar(fonteDeFuncoes, '// aoCli|')).toBeNull()
  })

  it('escreve a chamada completa com o seletor genérico e a arrow function', () => {
    const codigo = aceitar('aoCli|', 'aoClicar')
    expect(codigo).toContain("aoClicar('#meu-seletor', (elemento) => {\n  // reação\n})")
  })

  it('cria o import da Borg ao aceitar a sugestão', () => {
    const codigo = aceitar('mostr|', 'mostrar')
    expect(codigo).toBe(`import { mostrar } from '${URL_BORG_MJS}'\n\nmostrar('#meu-seletor')`)
  })

  it('completa o import que já existe', () => {
    const codigo = aceitar(`import { mostrar } from '${URL_BORG_MJS}'\n\nescon|`, 'esconder')
    expect(codigo).toBe(`import { esconder, mostrar } from '${URL_BORG_MJS}'\n\nesconder('#meu-seletor')`)
  })

  it('dentro das chaves do import, sugere só o nome', () => {
    const codigo = aceitar(`import { mostrar, escon| } from '${URL_BORG_MJS}'`, 'esconder')
    expect(codigo).toBe(`import { mostrar, esconder } from '${URL_BORG_MJS}'`)
  })

  it('depois de Borg., escreve a chamada sem criar import', () => {
    const codigo = aceitar('Borg.mostr|', 'mostrar')
    expect(codigo).toBe("Borg.mostrar('#meu-seletor')")
  })

  it('no começo da linha, elemento cria a variável', () => {
    expect(aceitar('elem|', 'elemento')).toContain("const meuElemento = elemento('#meu-seletor')")
    expect(aceitar('const nave = elem|', 'elemento')).toContain("const nave = elemento('#meu-seletor')")
  })
})

describe('fonteDeTeclas', () => {
  it('sugere nomes de tecla dentro das aspas de aoPressionar', () => {
    const resultado = completar(fonteDeTeclas, "aoPressionar('se|')")
    expect(resultado.from).toBe("aoPressionar('".length)
    expect(resultado.options.map(({ label }) => label)).toContain('seta cima')
  })

  it('não sugere fora das funções de teclado', () => {
    expect(completar(fonteDeTeclas, "aoClicar('se|')")).toBeNull()
  })
})
