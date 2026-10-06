import { SUGESTOES, escolherModelo } from '../../sugestoes/dados.js'
import { editarImport } from '../../sugestoes/importar.js'
import { sugestoesDeTecla } from '../../sugestoes/teclas.js'

/**
 * Lógica do autocomplete da extensão, sem depender da API do VS Code. Trabalha com o
 * texto do documento e posições (offsets), que `extensao.js` converte para o editor.
 */

/**
 * Trecho do documento que é código JavaScript.
 * @typedef {{ inicio: number, fim: number, modulo: boolean }} Regiao
 */

/**
 * Item de sugestão de função.
 * @typedef {{
 *   nome: string,
 *   assinatura: string,
 *   descricao: string,
 *   modelo: string,
 *   edicao: import('../../sugestoes/importar.js').Edicao | null,
 * }} ItemDeFuncao
 */

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)(?:<\/script\s*>|$)/gi

/**
 * Encontra o trecho de JavaScript onde está o cursor.
 *
 * Em `.js`/`.mjs`, é o arquivo inteiro, tratado como módulo. Em `.html`, é o conteúdo do
 * `<script>` onde o cursor está (sem `src`); ele é módulo se tiver `type="module"`.
 *
 * @param {string} texto - O documento inteiro.
 * @param {number} posicao - Offset do cursor.
 * @param {string} linguagem - `languageId` do VS Code.
 * @returns {Regiao|null}
 */
export function regiaoDeCodigo(texto, posicao, linguagem) {
  if (linguagem === 'javascript') return { inicio: 0, fim: texto.length, modulo: true }
  if (linguagem !== 'html') return null

  for (const encontrado of texto.matchAll(SCRIPT)) {
    const [trecho, atributos, conteudo] = encontrado
    const inicio = encontrado.index + trecho.indexOf('>') + 1
    const fim = inicio + conteudo.length
    if (posicao < inicio || posicao > fim) continue
    if (/\bsrc\s*=/i.test(atributos)) return null
    return { inicio, fim, modulo: /\btype\s*=\s*["']?module\b/i.test(atributos) }
  }
  return null
}

/**
 * Diz se o fim da linha está dentro de um texto entre aspas ou de um comentário `//`.
 * @param {string} linha
 * @returns {boolean}
 */
function dentroDeTextoOuComentario(linha) {
  let aspas = null
  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i]
    if (aspas) {
      if (caractere === '\\') i++
      else if (caractere === aspas) aspas = null
    } else if (caractere === '"' || caractere === "'" || caractere === '`') {
      aspas = caractere
    } else if (caractere === '/' && linha[i + 1] === '/') {
      return true
    }
  }
  return aspas !== null
}

/**
 * Sugestões de função da Borg para a posição do cursor.
 *
 * - Dentro das chaves de um `import`, só o nome.
 * - Depois de `Borg.`, a chamada sem `import`.
 * - Em `<script>` sem módulo, a chamada com o objeto global (`Borg.aoClicar(...)`).
 * - Nos outros casos, a chamada e a edição que cria ou completa o `import` da Borg.
 *
 * @param {string} texto
 * @param {number} posicao
 * @param {string} linguagem
 * @returns {{ inicioDaPalavra: number, itens: ItemDeFuncao[] }|null}
 */
export function sugestoesDeFuncao(texto, posicao, linguagem) {
  const regiao = regiaoDeCodigo(texto, posicao, linguagem)
  if (!regiao) return null

  const antes = texto.slice(regiao.inicio, posicao)
  const inicioDaPalavra = posicao - /[\w$]*$/.exec(antes)[0].length
  const comecoDaLinha = Math.max(regiao.inicio, texto.lastIndexOf('\n', inicioDaPalavra - 1) + 1)
  const linhaAntes = texto.slice(comecoDaLinha, inicioDaPalavra)

  if (dentroDeTextoOuComentario(linhaAntes)) return null
  const depoisDeBorg = linhaAntes.endsWith('Borg.')
  if (linhaAntes.endsWith('.') && !depoisDeBorg) return null

  const noImport = /import\s*\{[^}]*$/.test(texto.slice(regiao.inicio, inicioDaPalavra))
  const codigo = texto.slice(regiao.inicio, regiao.fim)

  const itens = SUGESTOES.map((sugestao) => {
    const { nome, assinatura, descricao } = sugestao
    if (noImport) return { nome, assinatura, descricao, modelo: nome, edicao: null }

    let modelo = escolherModelo(sugestao, linhaAntes)
    let edicao = null
    if (!regiao.modulo && !depoisDeBorg) {
      modelo = modelo.replace(`${nome}(`, `Borg.${nome}(`)
    } else if (regiao.modulo && !depoisDeBorg) {
      const doImport = editarImport(codigo, nome)
      if (doImport) {
        edicao = { ...doImport, de: doImport.de + regiao.inicio, ate: doImport.ate + regiao.inicio }
      }
    }
    return { nome, assinatura, descricao, modelo, edicao }
  })

  return { inicioDaPalavra, itens }
}

/**
 * Sugestões de nome de tecla dentro das aspas de `aoPressionar`, `aoSoltar` e `teclaPressionada`.
 * @param {string} texto
 * @param {number} posicao
 * @param {string} linguagem
 * @returns {{ inicio: number, teclas: string[] }|null} `inicio` é o offset onde começa o que já foi digitado.
 */
export function sugestoesDeTeclaNoDocumento(texto, posicao, linguagem) {
  const regiao = regiaoDeCodigo(texto, posicao, linguagem)
  if (!regiao) return null

  const comecoDaLinha = Math.max(regiao.inicio, texto.lastIndexOf('\n', posicao - 1) + 1)
  const sugestao = sugestoesDeTecla(texto.slice(comecoDaLinha, posicao))
  if (!sugestao) return null
  return { inicio: comecoDaLinha + sugestao.inicio, teclas: sugestao.teclas }
}
