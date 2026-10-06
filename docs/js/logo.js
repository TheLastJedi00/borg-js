import logoAnimada from '../../assets/logo-animada.svg?raw'

/** Quanto dura uma piscada, em milissegundos. */
const DURACAO_DA_PISCADA = 150

/** Intervalo entre piscadas automáticas, em milissegundos. */
const PISCADA_MINIMA = 4000
const PISCADA_MAXIMA = 7000

let instancias = 0

/** Quem pediu menos movimento não vê animações automáticas. */
export const prefereMenosMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Devolve o SVG da logo (assets/logo-animada.svg) para colocar direto no HTML.
 *
 * Cada chamada troca os ids internos (gradientes e máscara) por ids próprios, para a logo
 * poder aparecer mais de uma vez na página. Sem `rotulo`, ela é decorativa e fica
 * escondida dos leitores de tela. A classe `fechada` fecha os olhos (ver componentes.css).
 *
 * @param {{ classe?: string, id?: string, rotulo?: string }} [opcoes]
 * @returns {string}
 */
export function svgDaLogo({ classe = 'logo', id, rotulo } = {}) {
  instancias += 1
  let svg = logoAnimada.replace(/<!--[\s\S]*?-->\s*/, '').trim()

  for (const [, original] of logoAnimada.matchAll(/\bid="([^"]+)"/g)) {
    const novo = `${original}-${instancias}`
    svg = svg.replaceAll(`id="${original}"`, `id="${novo}"`).replaceAll(`url(#${original})`, `url(#${novo})`)
  }

  const atributos = [`class="${classe}"`]
  if (id) atributos.push(`id="${id}"`)
  atributos.push(rotulo ? `role="img" aria-label="${rotulo}"` : 'aria-hidden="true"')

  return svg.replace(/^<svg ([^>]*?) role="img" aria-label="Borg JS"/, `<svg ${atributos.join(' ')} $1`)
}

/**
 * Fecha os olhos da logo por um instante.
 * @param {Element} logo
 * @param {number} [duracao]
 */
export function piscar(logo, duracao = DURACAO_DA_PISCADA) {
  logo.classList.add('fechada')
  setTimeout(() => logo.classList.remove('fechada'), duracao)
}

/**
 * Faz a logo piscar sozinha, em intervalos sorteados entre 4 e 7 segundos.
 * Com `prefers-reduced-motion`, não faz nada.
 * @param {Element} logo
 * @returns {() => void} Função que para as piscadas.
 */
export function piscarSozinha(logo) {
  if (prefereMenosMovimento()) return () => {}

  let temporizador
  const agendar = () => {
    const espera = PISCADA_MINIMA + Math.random() * (PISCADA_MAXIMA - PISCADA_MINIMA)
    temporizador = setTimeout(() => {
      piscar(logo)
      agendar()
    }, espera)
  }
  agendar()

  return () => clearTimeout(temporizador)
}
