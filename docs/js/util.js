/**
 * Escapa um texto para ser exibido dentro do HTML.
 * @param {string} texto
 * @returns {string}
 */
export function escaparHtml(texto) {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * Monta um bloco de código.
 * @param {string} texto
 * @returns {string}
 */
export function blocoDeCodigo(texto) {
  return `<pre><code>${escaparHtml(texto.trim())}</code></pre>`
}
