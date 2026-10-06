import { autocompletion, completionKeymap, snippet } from '@codemirror/autocomplete'
import { javascriptLanguage } from '@codemirror/lang-javascript'
import { syntaxTree } from '@codemirror/language'
import { keymap } from '@codemirror/view'
import { SUGESTOES, escolherModelo } from '../../../sugestoes/dados.js'
import { paraModeloDoCodeMirror } from '../../../sugestoes/modelo.js'
import { editarImport } from '../../../sugestoes/importar.js'
import { sugestoesDeTecla } from '../../../sugestoes/teclas.js'

/** @typedef {import('@codemirror/autocomplete').CompletionContext} CompletionContext */
/** @typedef {import('@codemirror/autocomplete').CompletionResult} CompletionResult */

/** Nós da árvore de sintaxe onde nomes de função não fazem sentido. */
const SEM_SUGESTAO = new Set(['String', 'TemplateString', 'LineComment', 'BlockComment'])

/**
 * Diz se a posição está dentro de um nó com um dos nomes, olhando os ancestrais.
 * @param {import('@codemirror/state').EditorState} estado
 * @param {number} posicao
 * @param {(nome: string) => boolean} teste
 * @returns {boolean}
 */
function estaDentroDe(estado, posicao, teste) {
  for (let no = syntaxTree(estado).resolveInner(posicao, -1); no; no = no.parent) {
    if (teste(no.name)) return true
  }
  return false
}

/**
 * Cria o `apply` de uma sugestão: acerta o `import` da Borg (se for o caso) e insere o
 * modelo com os campos editáveis.
 * @param {import('../../../sugestoes/dados.js').Sugestao} sugestao
 * @param {string} textoAntesNaLinha
 * @param {boolean} importar
 */
function aplicarSugestao(sugestao, textoAntesNaLinha, importar) {
  const inserir = snippet(paraModeloDoCodeMirror(escolherModelo(sugestao, textoAntesNaLinha)))

  return (vista, opcao, de, ate) => {
    const edicao = importar ? editarImport(vista.state.doc.toString(), sugestao.nome) : null
    if (edicao) {
      const transacao = vista.state.update({
        changes: { from: edicao.de, to: edicao.ate, insert: edicao.texto },
      })
      vista.dispatch(transacao)
      de = transacao.changes.mapPos(de, 1)
      ate = transacao.changes.mapPos(ate, 1)
    }
    inserir(vista, opcao, de, ate)
  }
}

/**
 * Sugere as funções da Borg, já com a chamada completa.
 *
 * - Dentro das chaves de um `import`, sugere só o nome.
 * - Depois de `Borg.`, escreve a chamada sem criar `import`.
 * - Nos outros casos, escreve a chamada e cria ou completa o `import` da Borg.
 *
 * @param {CompletionContext} contexto
 * @returns {CompletionResult|null}
 */
export function fonteDeFuncoes(contexto) {
  const palavra = contexto.matchBefore(/[\w$]+/)
  if (!palavra || (palavra.from === palavra.to && !contexto.explicit)) return null
  if (estaDentroDe(contexto.state, contexto.pos, (nome) => SEM_SUGESTAO.has(nome))) return null

  const linha = contexto.state.doc.lineAt(palavra.from)
  const textoAntesNaLinha = linha.text.slice(0, palavra.from - linha.from)
  const noImport = estaDentroDe(contexto.state, contexto.pos, (nome) => nome === 'ImportDeclaration')
  const depoisDoPonto = textoAntesNaLinha.endsWith('.')
  if (depoisDoPonto && !textoAntesNaLinha.endsWith('Borg.')) return null

  return {
    from: palavra.from,
    validFor: /^[\w$]*$/,
    options: SUGESTOES.map((sugestao) => ({
      label: sugestao.nome,
      detail: sugestao.assinatura,
      info: sugestao.descricao,
      type: 'function',
      boost: 1,
      apply: noImport ? sugestao.nome : aplicarSugestao(sugestao, textoAntesNaLinha, !depoisDoPonto),
    })),
  }
}

/**
 * Sugere os nomes de tecla dentro das aspas de `aoPressionar`, `aoSoltar` e `teclaPressionada`.
 * @param {CompletionContext} contexto
 * @returns {CompletionResult|null}
 */
export function fonteDeTeclas(contexto) {
  const linha = contexto.state.doc.lineAt(contexto.pos)
  const sugestao = sugestoesDeTecla(linha.text.slice(0, contexto.pos - linha.from))
  if (!sugestao) return null

  return {
    from: linha.from + sugestao.inicio,
    validFor: /^[^'"]*$/,
    options: sugestao.teclas.map((tecla) => ({ label: tecla, type: 'constant', detail: 'tecla' })),
  }
}

/**
 * Autocomplete da Borg para os editores JavaScript do playground. Soma às sugestões
 * do próprio JavaScript (variáveis do código, palavras-chave).
 * @returns {import('@codemirror/state').Extension}
 */
export function autocompleteDaBorg() {
  return [
    autocompletion(),
    javascriptLanguage.data.of({ autocomplete: fonteDeFuncoes }),
    javascriptLanguage.data.of({ autocomplete: fonteDeTeclas }),
    keymap.of(completionKeymap),
  ]
}
