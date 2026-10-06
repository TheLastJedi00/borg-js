import { iniciarPagina } from '../layout.js'
import { blocoDeCodigo, ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { playground, ativarPlaygrounds, obterPlayground } from '../playground/playground.js'
import { comImport, linhaDeImport } from '../config.js'
import { recolhivel } from '../componentes.js'
import { htmlDoMenuLateral, ligarMenuLateral, irParaAncora } from '../menu-lateral.js'
import { desafios, niveis } from '../dados/desafios.js'
import { icones } from '../icones.js'

/**
 * Código inicial e solução completos de um desafio, já com o `import`.
 * @param {(typeof desafios)[number]} desafio
 */
function codigosDo(desafio) {
  const { inicial, solucao, funcoes } = desafio
  return {
    inicial: { ...inicial, js: `${linhaDeImport(funcoes)}\n\n${inicial.js.trim()}\n` },
    solucao: {
      html: solucao.html ?? inicial.html,
      css: solucao.css ?? inicial.css,
      js: comImport(solucao.js),
    },
  }
}

/** @param {(typeof desafios)[number]} desafio */
function htmlDoDesafio(desafio) {
  const { inicial, solucao } = codigosDo(desafio)
  const mudouHtml = desafio.solucao.html !== undefined
  const mudouCss = desafio.solucao.css !== undefined

  return `
    <article class="desafio" id="${desafio.id}">
      <h3>${desafio.titulo}</h3>
      <div class="desafio-enunciado">${desafio.enunciado}</div>
      <p class="desafio-funcoes">
        Funções sugeridas:
        ${desafio.funcoes.map((nome) => `<a href="./funcoes.html#${nome}"><code>${nome}</code></a>`).join(', ')}
      </p>
      ${playground({ id: `pg-${desafio.id}`, titulo: desafio.titulo, ...inicial })}
      ${recolhivel({
        resumo: 'Ver solução',
        classe: 'desafio-solucao',
        html: `
          ${mudouHtml ? `<p>HTML</p>${blocoDeCodigo(solucao.html, 'html')}` : ''}
          ${mudouCss ? `<p>CSS</p>${blocoDeCodigo(solucao.css, 'css')}` : ''}
          ${mudouHtml || mudouCss ? '<p>JS</p>' : ''}
          ${blocoDeCodigo(solucao.js, 'js')}
          <button type="button" class="botao botao-secundario desafio-carregar" data-desafio="${desafio.id}">
            ${icones.rodar} Carregar no exemplo
          </button>
        `,
      })}
    </article>
  `
}

const niveisComDesafios = niveis
  .map((nivel) => ({ ...nivel, desafios: desafios.filter((desafio) => desafio.nivel === nivel.id) }))
  .filter((nivel) => nivel.desafios.length > 0)

const menu = htmlDoMenuLateral(
  niveisComDesafios.map((nivel) => ({
    titulo: nivel.rotulo,
    itens: nivel.desafios.map(({ id, titulo }) => ({ id, rotulo: titulo })),
  })),
)

const conteudo = iniciarPagina()
conteudo.innerHTML = `
  <div class="pagina com-lateral">
    ${menu}
    <div>
      <header class="pagina-cabecalho">
        <h1>Desafios</h1>
        <p>
          Exercícios do fácil ao difícil. Cada um já vem com um código inicial: resolva no próprio
          exemplo e só abra a solução depois de tentar.
        </p>
      </header>
      ${niveisComDesafios
        .map(
          (nivel) => `
            <section class="nivel" id="nivel-${nivel.id}">
              <h2>${nivel.rotulo}</h2>
              <p class="nivel-descricao">${nivel.descricao}</p>
              ${nivel.desafios.map(htmlDoDesafio).join('')}
            </section>`,
        )
        .join('')}
    </div>
  </div>
`

conteudo.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.desafio-carregar')
  if (!botao) return
  const desafio = desafios.find(({ id }) => id === botao.dataset.desafio)
  obterPlayground(`pg-${desafio.id}`)?.carregar(codigosDo(desafio).solucao)
  document.querySelector(`[data-playground="pg-${desafio.id}"]`).scrollIntoView({ block: 'center' })
})

ativarBlocosDeCodigo(conteudo)
ativarPlaygrounds(conteudo)
ligarMenuLateral(conteudo)
irParaAncora()
