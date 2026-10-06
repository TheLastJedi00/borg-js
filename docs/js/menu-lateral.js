/**
 * Menu lateral de uma página longa: grupos de links, destaque da seção visível e, no
 * celular, um bloco recolhível "Nesta página".
 */

const TELA_LARGA = matchMedia('(min-width: 901px)')

/**
 * @typedef {{ titulo: string, itens: Array<{ id: string, rotulo: string, codigo?: boolean }> }} GrupoDoMenu
 */

/**
 * Monta o HTML do menu.
 * @param {GrupoDoMenu[]} grupos
 * @returns {string}
 */
export function htmlDoMenuLateral(grupos) {
  const htmlDosGrupos = grupos
    .map(
      ({ titulo, itens }) => `
        <p>${titulo}</p>
        <ul>
          ${itens
            .map(
              ({ id, rotulo, codigo }) =>
                `<li><a href="#${id}"${codigo ? ' class="nome-funcao"' : ''}>${rotulo}</a></li>`,
            )
            .join('')}
        </ul>`,
    )
    .join('')

  return `
    <nav class="lateral menu-lateral" aria-label="Nesta página">
      <details class="menu-lateral-recolhivel" open>
        <summary>Nesta página</summary>
        <div class="menu-lateral-grupos">${htmlDosGrupos}</div>
      </details>
    </nav>
  `
}

/**
 * Liga o menu: abre no computador e fecha no celular, fecha ao escolher um link no celular e
 * destaca o link da seção que está na tela.
 * @param {HTMLElement} raiz elemento que contém o menu e as seções
 */
export function ligarMenuLateral(raiz) {
  const detalhes = raiz.querySelector('.menu-lateral-recolhivel')
  const links = [...raiz.querySelectorAll('.menu-lateral a')]

  const ajustarAoTamanho = () => (detalhes.open = TELA_LARGA.matches)
  ajustarAoTamanho()
  TELA_LARGA.addEventListener('change', ajustarAoTamanho)

  links.forEach((link) =>
    link.addEventListener('click', () => {
      if (!TELA_LARGA.matches) detalhes.open = false
    }),
  )

  const marcar = (id) =>
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true')
      else link.removeAttribute('aria-current')
    })

  // A seção atual é a última cujo topo já passou de 30% da altura da tela. Conferir a
  // posição a cada rolagem continua certo mesmo quando os exemplos mudam de altura.
  const secoes = links.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean)
  let agendado = false
  const atualizar = () => {
    agendado = false
    const limite = innerHeight * 0.3
    const atual = secoes.findLast((secao) => secao.getBoundingClientRect().top <= limite) ?? secoes[0]
    if (atual) marcar(atual.id)
  }
  addEventListener(
    'scroll',
    () => {
      if (agendado) return
      agendado = true
      requestAnimationFrame(atualizar)
    },
    { passive: true },
  )
  atualizar()
}

/** Vai até a seção do endereço (`#...`), que só existe depois que a página é montada. */
export function irParaAncora() {
  if (!location.hash) return
  document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
}
