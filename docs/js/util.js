import { icones } from './icones.js'

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
 * Copia um texto para a área de transferência.
 * @param {string} texto
 * @returns {Promise<boolean>} se deu certo
 */
export async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    return false
  }
}

/**
 * Liga um botão que copia um texto e mostra "Copiado!" por um instante.
 * Um botão só com ícone troca o ícone e o `aria-label`, sem texto.
 * @param {HTMLButtonElement} botao
 * @param {() => string} obterTexto
 */
export function ligarBotaoDeCopiar(botao, obterTexto) {
  const original = botao.innerHTML
  const rotuloOriginal = botao.getAttribute('aria-label')
  let temporizador

  botao.addEventListener('click', async () => {
    const copiou = await copiarTexto(obterTexto())
    if (rotuloOriginal) {
      botao.innerHTML = copiou ? icones.ok : original
      botao.setAttribute('aria-label', copiou ? 'Copiado!' : 'Não deu para copiar. Selecione o texto e use Ctrl+C')
      clearTimeout(temporizador)
      temporizador = setTimeout(() => {
        botao.innerHTML = original
        botao.setAttribute('aria-label', rotuloOriginal)
      }, 1800)
      return
    }
    botao.innerHTML = copiou ? `${icones.ok}Copiado!` : 'Selecione e copie com Ctrl+C'
    clearTimeout(temporizador)
    temporizador = setTimeout(() => (botao.innerHTML = original), 1800)
  })
}
