/**
 * Componentes de conteúdo. Cada função devolve um trecho de HTML para usar nas páginas.
 */

const ROTULOS_DE_AVISO = { dica: 'Dica', cuidado: 'Cuidado' }

/**
 * Caixa de destaque para uma dica ou um cuidado.
 * @param {'dica' | 'cuidado'} tipo
 * @param {string} html
 * @returns {string}
 */
export function aviso(tipo, html) {
  return `<aside class="aviso aviso-${tipo}"><strong>${ROTULOS_DE_AVISO[tipo]}</strong><div>${html}</div></aside>`
}

/**
 * Cartão com título e texto. Com `href`, o cartão inteiro vira um link.
 * @param {{ titulo: string, texto: string, href?: string, extra?: string }} opcoes
 * @returns {string}
 */
export function cartao({ titulo, texto, href, extra = '' }) {
  const conteudo = `<h3>${titulo}</h3><p>${texto}</p>${extra}`
  return href
    ? `<a class="cartao cartao-link" href="${href}">${conteudo}</a>`
    : `<div class="cartao">${conteudo}</div>`
}

/**
 * Lista numerada de passos, para conteúdos que são de fato uma sequência.
 * @param {Array<{ titulo: string, html: string, id?: string }>} lista
 * @returns {string}
 */
export function passos(lista) {
  const itens = lista
    .map(
      ({ titulo, html, id }) =>
        `<li class="passo"${id ? ` id="${id}"` : ''}><h3>${titulo}</h3><div class="passo-corpo">${html}</div></li>`,
    )
    .join('')
  return `<ol class="passos">${itens}</ol>`
}

/**
 * Bloco que abre e fecha, como "Ver solução". Usa `<details>`, que já funciona com teclado.
 * @param {{ resumo: string, html: string, classe?: string }} opcoes
 * @returns {string}
 */
export function recolhivel({ resumo, html, classe = '' }) {
  return `<details class="recolhivel ${classe}"><summary>${resumo}</summary><div class="recolhivel-corpo">${html}</div></details>`
}
