import { criarEditor } from './editor.js'
import { escaparHtml, ligarBotaoDeCopiar } from '../util.js'
import { icones } from '../icones.js'

/**
 * Descobre a linguagem de um trecho: começa com `<` é HTML, senão é JS.
 * @param {string} codigo
 * @returns {import('./editor.js').Linguagem}
 */
function adivinharLinguagem(codigo) {
  return codigo.startsWith('<') ? 'html' : 'js'
}

/**
 * Monta o HTML de um bloco de código. Ele aparece como texto simples até
 * `ativarBlocosDeCodigo` trocá-lo por um editor somente leitura com realce e botão "Copiar".
 * @param {string} texto
 * @param {import('./editor.js').Linguagem} [linguagem]
 * @returns {string}
 */
export function blocoDeCodigo(texto, linguagem) {
  const codigo = texto.trim()
  return `<div class="bloco-codigo" data-linguagem="${linguagem ?? adivinharLinguagem(codigo)}"><pre><code>${escaparHtml(codigo)}</code></pre></div>`
}

/**
 * Ativa todos os blocos de código dentro de `raiz`.
 * @param {ParentNode} [raiz]
 */
export function ativarBlocosDeCodigo(raiz = document) {
  raiz.querySelectorAll('.bloco-codigo:not([data-ativo])').forEach((bloco) => {
    const pre = bloco.querySelector('pre')
    const codigo = pre.textContent
    bloco.dataset.ativo = ''
    pre.remove()

    criarEditor({ pai: bloco, codigo, linguagem: bloco.dataset.linguagem, somenteLeitura: true })

    const botao = document.createElement('button')
    botao.type = 'button'
    botao.className = 'botao-ferramenta bloco-copiar'
    botao.innerHTML = `${icones.copiar}Copiar`
    ligarBotaoDeCopiar(botao, () => codigo)
    bloco.append(botao)
  })
}
