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
