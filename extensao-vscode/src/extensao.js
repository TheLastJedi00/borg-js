import * as vscode from 'vscode'
import { sugestoesDeFuncao, sugestoesDeTeclaNoDocumento } from './provedor.js'

/** Arquivos onde o autocomplete funciona. Em HTML, só dentro de `<script>`. */
const DOCUMENTOS = [{ language: 'javascript' }, { language: 'html' }]

/**
 * Converte um intervalo de offsets do documento em um `Range` do VS Code.
 * @param {vscode.TextDocument} documento
 * @param {number} de
 * @param {number} ate
 * @returns {vscode.Range}
 */
function intervalo(documento, de, ate) {
  return new vscode.Range(documento.positionAt(de), documento.positionAt(ate))
}

/** Sugere as funções da Borg com a chamada inteira e o `import` automático. */
const provedorDeFuncoes = {
  /**
   * @param {vscode.TextDocument} documento
   * @param {vscode.Position} posicao
   */
  provideCompletionItems(documento, posicao) {
    const offset = documento.offsetAt(posicao)
    const resultado = sugestoesDeFuncao(documento.getText(), offset, documento.languageId)
    if (!resultado) return undefined

    const palavra = intervalo(documento, resultado.inicioDaPalavra, offset)
    return resultado.itens.map(({ nome, assinatura, descricao, modelo, edicao }) => {
      const item = new vscode.CompletionItem(
        { label: nome, description: assinatura },
        vscode.CompletionItemKind.Function,
      )
      item.detail = 'Borg JS'
      item.documentation = new vscode.MarkdownString(descricao)
      item.insertText = new vscode.SnippetString(modelo)
      item.range = palavra
      if (edicao) {
        item.additionalTextEdits = [
          vscode.TextEdit.replace(intervalo(documento, edicao.de, edicao.ate), edicao.texto),
        ]
      }
      return item
    })
  },
}

/** Sugere os nomes de tecla dentro das aspas de `aoPressionar`, `aoSoltar` e `teclaPressionada`. */
const provedorDeTeclas = {
  /**
   * @param {vscode.TextDocument} documento
   * @param {vscode.Position} posicao
   */
  provideCompletionItems(documento, posicao) {
    const offset = documento.offsetAt(posicao)
    const resultado = sugestoesDeTeclaNoDocumento(documento.getText(), offset, documento.languageId)
    if (!resultado) return undefined

    const digitado = intervalo(documento, resultado.inicio, offset)
    return resultado.teclas.map((tecla) => {
      const item = new vscode.CompletionItem(
        { label: tecla, description: 'tecla' },
        vscode.CompletionItemKind.Constant,
      )
      item.detail = 'Borg JS'
      item.range = digitado
      return item
    })
  },
}

/**
 * Liga a extensão: registra os provedores de sugestão.
 * @param {vscode.ExtensionContext} contexto
 */
export function activate(contexto) {
  contexto.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(DOCUMENTOS, provedorDeFuncoes),
    vscode.languages.registerCompletionItemProvider(DOCUMENTOS, provedorDeTeclas, "'", '"'),
  )
}

/** Nada a desligar: os provedores saem junto com `contexto.subscriptions`. */
export function deactivate() {}
