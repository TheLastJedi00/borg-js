import { URL_DO_SITE } from '../url.js'

/**
 * @typedef {{ html: string, css?: string, js: string }} Exemplo
 * @typedef {{
 *   nivelExtra?: number,
 *   pagina?: string,
 *   exemplos?: Record<string, Exemplo | undefined>,
 * }} Opcoes
 * - `nivelExtra`: quantos níveis os títulos descem (`<h2>` vira `###` com 1).
 * - `pagina`: página de onde vem o HTML, para completar links como `#problemas-comuns`.
 * - `exemplos`: código de cada playground, pelo id, para trocar o playground pelo código.
 */

/** Tags que não abrem um bloco: entram no texto do parágrafo em volta. */
const INLINE = new Set(['A', 'B', 'BR', 'CODE', 'EM', 'I', 'KBD', 'SPAN', 'STRONG', 'SMALL', 'MARK', 'ABBR'])

/**
 * Converte o HTML dos dados do site para Markdown, para alimentar agentes de IA.
 *
 * Entende parágrafos, títulos, listas, tabelas, código, avisos (`aviso()`), blocos de
 * código (`blocoDeCodigo()`) e playgrounds (`playground()`), que viram o código deles.
 * Os links ficam absolutos, com o domínio oficial.
 *
 * @param {string} html
 * @param {Opcoes} [opcoes]
 * @returns {string}
 */
export function htmlParaMarkdown(html, opcoes = {}) {
  const contexto = { nivelExtra: 0, pagina: 'index.html', exemplos: {}, ...opcoes }
  const modelo = document.createElement('template')
  modelo.innerHTML = html
  return blocos(modelo.content, contexto).join('\n\n').trim()
}

/**
 * Converte os filhos de um nó em blocos de Markdown (parágrafos, listas, código...).
 * @param {Node} no
 * @param {Required<Opcoes>} contexto
 * @returns {string[]}
 */
function blocos(no, contexto) {
  const resultado = []
  let soltos = []

  const fecharParagrafo = () => {
    const texto = juntarInline(soltos.map((filho) => inline(filho, contexto)).join(''))
    if (texto) resultado.push(texto)
    soltos = []
  }

  for (const filho of no.childNodes) {
    if (filho.nodeType === Node.TEXT_NODE || (filho.nodeType === Node.ELEMENT_NODE && INLINE.has(filho.tagName))) {
      soltos.push(filho)
      continue
    }
    if (filho.nodeType !== Node.ELEMENT_NODE) continue
    fecharParagrafo()
    resultado.push(...bloco(filho, contexto))
  }
  fecharParagrafo()
  return resultado.filter(Boolean)
}

/**
 * Converte um elemento de bloco.
 * @param {Element} el
 * @param {Required<Opcoes>} contexto
 * @returns {string[]}
 */
function bloco(el, contexto) {
  const tag = el.tagName
  const classes = el.classList

  if (/^H[1-6]$/.test(tag)) {
    const nivel = Math.min(6, Number(tag[1]) + contexto.nivelExtra)
    return [`${'#'.repeat(nivel)} ${juntarInline(inline(el, contexto))}`]
  }
  if (tag === 'P') return [juntarInline(inline(el, contexto))]
  if (tag === 'UL' || tag === 'OL') return [lista(el, contexto)]
  if (tag === 'TABLE') return [tabela(el, contexto)]
  if (tag === 'PRE') return [cerca(el.textContent, '')]
  if (classes.contains('bloco-codigo')) {
    return [cerca(el.querySelector('pre')?.textContent ?? el.textContent, el.dataset.linguagem ?? '')]
  }
  if (classes.contains('playground')) return exemplo(contexto.exemplos[el.dataset.playground])
  if (classes.contains('aviso')) {
    const rotulo = el.querySelector(':scope > strong')?.textContent.trim() ?? 'Nota'
    const corpo = el.querySelector(':scope > div') ?? el
    return [`> **${rotulo}:** ${blocos(corpo, contexto).join(' ')}`]
  }
  return blocos(el, contexto)
}

/**
 * Converte um nó de texto ou um elemento em linha (código, negrito, link...).
 * @param {Node} no
 * @param {Required<Opcoes>} contexto
 * @returns {string}
 */
function inline(no, contexto) {
  if (no.nodeType === Node.TEXT_NODE) return no.textContent.replace(/\s+/g, ' ')
  if (no.nodeType !== Node.ELEMENT_NODE) return ''

  const filhos = () => [...no.childNodes].map((filho) => inline(filho, contexto)).join('')
  switch (no.tagName) {
    case 'CODE':
    case 'KBD':
      return `\`${no.textContent}\``
    case 'STRONG':
    case 'B':
      return `**${filhos().trim()}**`
    case 'EM':
    case 'I':
      return `*${filhos().trim()}*`
    case 'BR':
      return '\n'
    case 'A':
      return `[${filhos().trim()}](${urlAbsoluta(no.getAttribute('href') ?? '', contexto.pagina)})`
    default:
      return filhos()
  }
}

/** Junta espaços repetidos e tira os das pontas, sem desfazer quebras de `<br>`. */
const juntarInline = (texto) =>
  texto
    .split('\n')
    .map((linha) => linha.replace(/ {2,}/g, ' ').trim())
    .join('\n')
    .trim()

/**
 * @param {string} href
 * @param {string} pagina
 * @returns {string}
 */
function urlAbsoluta(href, pagina) {
  if (/^[a-z]+:/i.test(href)) return href
  if (href.startsWith('#')) return `${URL_DO_SITE}/${pagina}${href}`
  if (href.startsWith('/')) return `${URL_DO_SITE}${href}`
  return `${URL_DO_SITE}/${href.replace(/^\.\//, '')}`
}

/**
 * @param {Element} el
 * @param {Required<Opcoes>} contexto
 */
function lista(el, contexto) {
  const numerada = el.tagName === 'OL'
  return [...el.children]
    .filter((item) => item.tagName === 'LI')
    .map((item, indice) => `${numerada ? `${indice + 1}.` : '-'} ${blocos(item, contexto).join(' ')}`)
    .join('\n')
}

/**
 * @param {Element} el
 * @param {Required<Opcoes>} contexto
 */
function tabela(el, contexto) {
  const celula = (td) => juntarInline(inline(td, contexto)).replace(/\n/g, ' ').replace(/\|/g, '\\|')
  const linhas = [...el.querySelectorAll('tr')].map((tr) => [...tr.children].map(celula))
  if (linhas.length === 0) return ''
  const [cabecalho, ...corpo] = linhas
  return [
    `| ${cabecalho.join(' | ')} |`,
    `| ${cabecalho.map(() => '---').join(' | ')} |`,
    ...corpo.map((linha) => `| ${linha.join(' | ')} |`),
  ].join('\n')
}

/**
 * @param {string} codigo
 * @param {string} linguagem
 */
function cerca(codigo, linguagem) {
  return `\`\`\`${linguagem}\n${codigo.trim()}\n\`\`\``
}

/** @param {Exemplo | undefined} codigo */
function exemplo(codigo) {
  if (!codigo) return []
  return [
    cerca(codigo.html, 'html'),
    codigo.css?.trim() ? cerca(codigo.css, 'css') : '',
    cerca(codigo.js, 'js'),
  ].filter(Boolean)
}
