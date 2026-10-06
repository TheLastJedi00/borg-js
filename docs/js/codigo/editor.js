import { EditorState } from '@codemirror/state'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { syntaxHighlighting, HighlightStyle, bracketMatching, indentOnInput } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { tags } from '@lezer/highlight'

/** @typedef {'html' | 'js' | 'css'} Linguagem */

const linguagens = { html, js: javascript, css }

/** Cores do realce. Usam os tokens do CSS, então seguem o site. */
const realce = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword, tags.operatorKeyword], color: 'var(--codigo-palavra)' },
  { tag: [tags.string, tags.special(tags.string)], color: 'var(--codigo-texto-literal)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--codigo-numero)' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--codigo-funcao)' },
  { tag: [tags.tagName, tags.angleBracket], color: 'var(--codigo-tag)' },
  { tag: [tags.attributeName, tags.propertyName], color: 'var(--codigo-atributo)' },
  { tag: tags.attributeValue, color: 'var(--codigo-texto-literal)' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--codigo-comentario)', fontStyle: 'italic' },
  { tag: [tags.className, tags.labelName], color: 'var(--codigo-funcao)' },
  { tag: tags.invalid, color: 'var(--coral)' },
])

const tema = EditorView.theme(
  {
    '&': {
      color: 'var(--codigo-texto)',
      backgroundColor: 'var(--codigo-fundo)',
      fontSize: '0.86rem',
    },
    '.cm-scroller': {
      fontFamily: 'var(--fonte-codigo)',
      lineHeight: '1.6',
    },
    '.cm-content': {
      padding: '14px 0',
      caretColor: 'var(--ambar)',
    },
    '.cm-line': {
      padding: '0 20px',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--ambar)',
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      backgroundColor: 'rgb(94 234 212 / 0.25) !important',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--codigo-fundo)',
      color: 'var(--codigo-comentario)',
      border: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 4px 0 14px',
      minWidth: '32px',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgb(255 255 255 / 0.04)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--codigo-texto)',
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgb(251 191 36 / 0.2)',
      outline: '1px solid rgb(251 191 36 / 0.5)',
    },
  },
  { dark: true },
)

/**
 * Cria um editor de código dentro de `pai`.
 * @param {{
 *   pai: HTMLElement,
 *   codigo: string,
 *   linguagem: Linguagem,
 *   somenteLeitura?: boolean,
 *   rotulo?: string,
 *   aoMudar?: (codigo: string) => void,
 * }} opcoes
 * @returns {EditorView}
 */
export function criarEditor({ pai, codigo, linguagem, somenteLeitura = false, rotulo, aoMudar }) {
  const comuns = [
    tema,
    syntaxHighlighting(realce),
    linguagens[linguagem](),
    // Quebrar linhas longas é melhor para iniciantes do que rolar para o lado, ainda mais no celular.
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({ 'aria-label': rotulo ?? `Código ${linguagem.toUpperCase()}` }),
  ]

  const extensoes = somenteLeitura
    ? [...comuns, EditorState.readOnly.of(true), EditorView.editable.of(false)]
    : [
        ...comuns,
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        EditorState.tabSize.of(2),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.updateListener.of((atualizacao) => {
          if (atualizacao.docChanged) aoMudar?.(atualizacao.state.doc.toString())
        }),
      ]

  return new EditorView({ parent: pai, state: EditorState.create({ doc: codigo, extensions: extensoes }) })
}

/**
 * Troca todo o código de um editor.
 * @param {EditorView} editor
 * @param {string} codigo
 */
export function trocarCodigo(editor, codigo) {
  editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: codigo } })
}
