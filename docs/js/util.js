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

/** Quanto esperar pela área de transferência antes de tentar o jeito antigo. */
const LIMITE_PARA_COPIAR = 1500

/**
 * Copia pelo jeito antigo, com um campo de texto escondido. Funciona onde a API nova é
 * bloqueada ou fica esperando uma permissão.
 * @param {string} texto
 * @returns {boolean}
 */
function copiarPeloCampo(texto) {
  const campo = document.createElement('textarea')
  campo.value = texto
  campo.setAttribute('readonly', '')
  campo.style.cssText = 'position: fixed; opacity: 0; pointer-events: none'
  document.body.append(campo)
  campo.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    campo.remove()
  }
}

/**
 * Copia um texto para a área de transferência.
 * @param {string} texto
 * @returns {Promise<boolean>} se deu certo
 */
export async function copiarTexto(texto) {
  try {
    await Promise.race([
      navigator.clipboard.writeText(texto),
      new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error('demorou')), LIMITE_PARA_COPIAR)),
    ])
    return true
  } catch {
    return copiarPeloCampo(texto)
  }
}

/**
 * Liga um botão que copia um texto e mostra "Copiado!" por um instante.
 * Um botão só com ícone troca o ícone e o `aria-label`, sem texto.
 * @param {HTMLButtonElement} botao
 * @param {() => string | Promise<string>} obterTexto - Pode devolver uma promessa, para textos carregados sob demanda.
 */
export function ligarBotaoDeCopiar(botao, obterTexto) {
  const original = botao.innerHTML
  const rotuloOriginal = botao.getAttribute('aria-label')
  let temporizador

  botao.addEventListener('click', async () => {
    const copiou = await copiarTexto(await obterTexto())
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

/**
 * Baixa um texto como arquivo, com o nome dado.
 * @param {string} conteudo
 * @param {string} nome - Ex.: `'index.html'`, `'AGENTS.md'`.
 * @param {string} tipo - Tipo MIME, ex.: `'text/html'`.
 */
export function baixarArquivo(conteudo, nome, tipo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: `${tipo};charset=utf-8` }))
  const link = document.createElement('a')
  link.href = url
  link.download = nome
  link.click()
  URL.revokeObjectURL(url)
}
