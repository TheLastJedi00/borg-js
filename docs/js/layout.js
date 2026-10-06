import { icones } from './icones.js'

/** Páginas do menu principal, na ordem em que aparecem. */
export const PAGINAS = [
  { id: 'comecar', rotulo: 'Começar', href: './comecar.html' },
  { id: 'funcoes', rotulo: 'Funções', href: './funcoes.html' },
  { id: 'professores', rotulo: 'Professores', href: './professores.html' },
  { id: 'desafios', rotulo: 'Desafios', href: './desafios.html' },
  { id: 'projetos', rotulo: 'Projetos', href: './projetos.html' },
]

const URL_DO_REPOSITORIO = 'https://github.com/TheLastJedi00/borg-js'
const CHAVE_DO_TEMA = 'borg-tema'

/** @returns {'light' | 'dark'} */
function temaAtual() {
  const escolhido = document.documentElement.dataset.theme
  if (escolhido === 'light' || escolhido === 'dark') return escolhido
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** @param {HTMLButtonElement} botao */
function atualizarBotaoDoTema(botao) {
  const escuro = temaAtual() === 'dark'
  botao.innerHTML = escuro ? icones.sol : icones.lua
  botao.setAttribute('aria-label', escuro ? 'Usar tema claro' : 'Usar tema escuro')
  botao.title = botao.getAttribute('aria-label')
}

function htmlDoTopo(paginaAtual) {
  const links = PAGINAS.map(
    ({ id, rotulo, href }) =>
      `<li><a href="${href}"${id === paginaAtual ? ' aria-current="page"' : ''}>${rotulo}</a></li>`,
  ).join('')

  return `
    <div class="topo-dentro">
      <a class="marca" href="./index.html" aria-label="Borg JS, página inicial">
        <img src="/logo.svg" alt="" width="34" height="34" />
        <span>Borg JS</span>
      </a>
      <nav class="topo-menu" id="menu-principal" aria-label="Páginas">
        <ul>${links}</ul>
      </nav>
      <div class="topo-acoes">
        <button class="botao-icone" type="button" id="botao-tema"></button>
        <button class="botao-icone botao-menu" type="button" id="botao-menu"
          aria-controls="menu-principal" aria-expanded="false" aria-label="Abrir menu">${icones.menu}</button>
      </div>
    </div>
  `
}

function htmlDoRodape() {
  return `
    <div class="rodape-dentro">
      <a class="marca" href="./index.html"><img src="/logo.svg" alt="" width="28" height="28" /><span>Borg JS</span></a>
      <p>Biblioteca educacional, em português, para aprender a fazer páginas que reagem. Licença MIT.</p>
      <ul>
        ${PAGINAS.map(({ rotulo, href }) => `<li><a href="${href}">${rotulo}</a></li>`).join('')}
        <li><a href="${URL_DO_REPOSITORIO}">Código no GitHub</a></li>
      </ul>
    </div>
  `
}

/** Liga o botão de tema: alterna entre claro e escuro e salva a escolha. */
function ligarTema() {
  const botao = document.getElementById('botao-tema')
  atualizarBotaoDoTema(botao)

  botao.addEventListener('click', () => {
    const novo = temaAtual() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = novo
    try {
      localStorage.setItem(CHAVE_DO_TEMA, novo)
    } catch {
      // Sem localStorage (janela privada, por exemplo): o tema vale só até recarregar.
    }
    atualizarBotaoDoTema(botao)
    document.dispatchEvent(new CustomEvent('borg:tema', { detail: novo }))
  })

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => atualizarBotaoDoTema(botao))
}

/** Liga o menu recolhível do celular. */
function ligarMenuDoCelular() {
  const topo = document.getElementById('topo')
  const botao = document.getElementById('botao-menu')

  const definirAberto = (aberto) => {
    topo.classList.toggle('menu-aberto', aberto)
    botao.setAttribute('aria-expanded', String(aberto))
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu')
    botao.innerHTML = aberto ? icones.fechar : icones.menu
  }

  botao.addEventListener('click', () => definirAberto(!topo.classList.contains('menu-aberto')))
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && topo.classList.contains('menu-aberto')) {
      definirAberto(false)
      botao.focus()
    }
  })
}

/**
 * Monta o topo e o rodapé comuns a todas as páginas.
 * @returns {HTMLElement} o `<main>` onde a página coloca o seu conteúdo
 */
export function iniciarPagina() {
  const paginaAtual = document.body.dataset.pagina
  document.getElementById('topo').innerHTML = htmlDoTopo(paginaAtual)
  document.getElementById('rodape').innerHTML = htmlDoRodape()
  ligarTema()
  ligarMenuDoCelular()
  return document.getElementById('conteudo')
}
