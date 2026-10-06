import { describe, it, expect } from 'vitest'
import { snippet } from '@codemirror/autocomplete'
import { EditorState } from '@codemirror/state'
import { paraModeloDoCodeMirror } from '../../sugestoes/modelo.js'
import { SUGESTOES } from '../../sugestoes/dados.js'

describe('paraModeloDoCodeMirror', () => {
  it('mantém campos com texto e o $0 com texto, que o CodeMirror já entende', () => {
    expect(paraModeloDoCodeMirror("aoClicar('${1:#meu-seletor}', () => {\n\t${0:// reação}\n})")).toBe(
      "aoClicar('${1:#meu-seletor}', () => {\n\t${0:// reação}\n})",
    )
  })

  it('converte $1 e $0 sem chaves', () => {
    expect(paraModeloDoCodeMirror("mostrar('$1')$0")).toBe("mostrar('${1}')${0}")
  })

  it('converte uma escolha do VS Code no primeiro valor', () => {
    expect(paraModeloDoCodeMirror("aoPressionar('${1|espaço,enter|}')")).toBe("aoPressionar('${1:espaço}')")
  })

  it('desfaz o escape de $ do VS Code', () => {
    expect(paraModeloDoCodeMirror('custa \\$5')).toBe('custa $5')
  })

  it('escapa #{ literal, que o CodeMirror leria como campo', () => {
    expect(paraModeloDoCodeMirror('cor #{1}')).toBe('cor #\\{1}')
  })

  it.each(SUGESTOES)('o modelo de $nome vira um snippet válido do CodeMirror', ({ modelo }) => {
    const estado = EditorState.create({ doc: '' })
    let inserido = ''
    const aplicar = snippet(paraModeloDoCodeMirror(modelo))
    aplicar(
      {
        state: estado,
        dispatch: (transacao) => {
          inserido = transacao.state.doc.toString()
        },
      },
      null,
      0,
      0,
    )
    expect(inserido).not.toMatch(/[$#]\{/)
    expect(inserido).toContain('(')
  })
})
