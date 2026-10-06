/**
 * Mostra com uma entrada suave os elementos marcados com `data-revelar` quando eles chegam
 * na tela. Usado com moderação, só nos blocos principais da página inicial. Com
 * `prefers-reduced-motion`, tudo aparece direto.
 * @param {ParentNode} [raiz]
 */
export function revelarAoRolar(raiz = document) {
  const elementos = raiz.querySelectorAll('[data-revelar]')
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elementos.forEach((elemento) => elemento.classList.add('revelado'))
    return
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const { isIntersecting, target } of entradas) {
        if (!isIntersecting) continue
        target.classList.add('revelado')
        observador.unobserve(target)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  elementos.forEach((elemento) => observador.observe(elemento))
}
