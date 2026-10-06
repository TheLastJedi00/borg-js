import { iniciarPagina } from '../layout.js'
import { ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { playground, ativarPlaygrounds } from '../playground/playground.js'
import { gerarHtmlDoProjeto } from '../playground/projeto.js'
import { comImport } from '../config.js'
import { ligarBotaoDeCopiar, baixarArquivo } from '../util.js'
import { aviso } from '../componentes.js'
import { htmlDoMenuLateral, ligarMenuLateral, irParaAncora } from '../menu-lateral.js'
import { projetos } from '../dados/projetos.js'
import { icones } from '../icones.js'

/** @param {(typeof projetos)[number]} projeto */
function htmlDoProjeto(projeto) {
  return `
    <section class="projeto" id="${projeto.id}">
      <h2>${projeto.titulo}</h2>
      <p class="projeto-descricao">${projeto.descricao}</p>
      <div class="projeto-acoes">
        <button type="button" class="botao botao-principal" data-copiar="${projeto.id}">${icones.copiar} Copiar projeto inteiro</button>
        <button type="button" class="botao botao-secundario" data-baixar="${projeto.id}">${icones.baixar} Baixar index.html</button>
      </div>
      ${playground({
        id: `pg-${projeto.id}`,
        titulo: projeto.titulo,
        altura: projeto.altura,
        estiloBase: false,
        html: projeto.html,
        css: projeto.css,
        js: comImport(projeto.js),
      })}
      <div class="projeto-estudo">
        <h3>O que observar no código</h3>
        <ul>${projeto.observar.map((item) => `<li>${item}</li>`).join('')}</ul>
        <p class="projeto-funcoes">
          Funções usadas:
          ${projeto.funcoes.map((nome) => `<a href="./funcoes.html#${nome}"><code>${nome}</code></a>`).join(', ')}
        </p>
      </div>
    </section>
  `
}

/** @param {string} id */
const arquivoDo = (id) => {
  const projeto = projetos.find((item) => item.id === id)
  return gerarHtmlDoProjeto(projeto)
}

const menu = htmlDoMenuLateral([
  { titulo: 'Projetos', itens: projetos.map(({ id, titulo }) => ({ id, rotulo: titulo })) },
])

const conteudo = iniciarPagina()
conteudo.innerHTML = `
  <div class="pagina com-lateral">
    ${menu}
    <div>
      <header class="pagina-cabecalho">
        <h1>Projetos</h1>
        <p>Projetos completos para estudar, modificar e usar como ponto de partida.</p>
      </header>
      ${aviso('dica', '<strong>Copiar projeto inteiro</strong> gera um único <code>index.html</code> com HTML, CSS e JS. Cole em um arquivo novo e abra pelo Live Server, como no <a href="./comecar.html#passo-abrir">guia Começar</a>.')}
      ${projetos.map(htmlDoProjeto).join('')}
    </div>
  </div>
`

conteudo.querySelectorAll('[data-copiar]').forEach((botao) => {
  ligarBotaoDeCopiar(botao, () => arquivoDo(botao.dataset.copiar))
})

conteudo.querySelectorAll('[data-baixar]').forEach((botao) => {
  botao.addEventListener('click', () => baixarArquivo(arquivoDo(botao.dataset.baixar), 'index.html', 'text/html'))
})

ativarBlocosDeCodigo(conteudo)
ativarPlaygrounds(conteudo)
ligarMenuLateral(conteudo)
irParaAncora()
