import { vi } from 'vitest'

/**
 * Simula o retângulo do elemento na tela, já que o jsdom não calcula layout.
 * @param {Element} alvo
 * @param {{ x: number, y: number, largura: number, altura: number }} retangulo
 */
export function simularRetangulo(alvo, { x, y, largura, altura }) {
  vi.spyOn(alvo, 'getBoundingClientRect').mockReturnValue({
    x,
    y,
    left: x,
    top: y,
    width: largura,
    height: altura,
    right: x + largura,
    bottom: y + altura,
    toJSON() {},
  })
}

/**
 * Simula o layout de um elemento: enquanto ele não tem `position: fixed`, fica em `inicio`;
 * depois, o retângulo segue `left` e `top`, somados a um `desvio` (como margem ou transform).
 * @param {HTMLElement} alvo
 * @param {{ inicio?: { x: number, y: number }, largura?: number, altura?: number, desvio?: { x: number, y: number } }} [opcoes]
 */
export function simularLayout(alvo, opcoes = {}) {
  const { inicio = { x: 0, y: 0 }, largura = 50, altura = 50, desvio = { x: 0, y: 0 } } = opcoes
  vi.spyOn(alvo, 'getBoundingClientRect').mockImplementation(() => {
    const fixo = alvo.style.position === 'fixed'
    const x = fixo ? parseFloat(alvo.style.left) + desvio.x : inicio.x
    const y = fixo ? parseFloat(alvo.style.top) + desvio.y : inicio.y
    return {
      x,
      y,
      left: x,
      top: y,
      width: largura,
      height: altura,
      right: x + largura,
      bottom: y + altura,
      toJSON() {},
    }
  })
}
