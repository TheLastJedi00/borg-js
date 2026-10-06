import * as Borg from '../../../src/index.js'
import { secoesDeInicio } from '../dados/inicio.js'
import { funcoes } from '../dados/funcoes.js'
import { blocoDeCodigo, ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { iniciarPagina } from '../layout.js'

// Deixa a Borg disponível como no uso com <script src="borg.js">.
window.Borg = Borg

iniciarPagina().innerHTML = `
  <div class="pagina com-lateral">
    <nav class="lateral menu-lateral" aria-label="Seções">
      <p>Começando</p>
      <ul id="menu-inicio"></ul>
      <p>Funções</p>
      <ul id="menu-funcoes"></ul>
    </nav>
    <div id="secoes"></div>
  </div>
`
const conteudo = document.getElementById('secoes')

/**
 * Adiciona uma seção à página e um link no menu.
 * @param {HTMLElement} menu
 * @param {{ id: string, rotulo: string, html: string }} secao
 * @param {string} [classe]
 * @returns {HTMLElement}
 */
function adicionarSecao(menu, { id, rotulo, html }, classe = 'secao') {
  const elemento = document.createElement('section')
  elemento.id = id
  elemento.className = classe
  elemento.innerHTML = html
  conteudo.append(elemento)

  const item = document.createElement('li')
  const link = document.createElement('a')
  link.href = `#${id}`
  link.textContent = rotulo
  item.append(link)
  menu.append(item)
  return elemento
}

/**
 * Monta o HTML da seção de uma função: descrição, parâmetros, retorno e exemplo.
 * @param {(typeof funcoes)[number]} funcao
 * @returns {string}
 */
function htmlDaFuncao(funcao) {
  const linhas = funcao.tabela
    .map(([nome, tipo, descricao]) => `<tr><td><code>${nome}</code></td><td>${tipo}</td><td>${descricao}</td></tr>`)
    .join('')

  return `
    <h2>${funcao.nome}<span class="parametros">(${funcao.parametros})</span></h2>
    <p>${funcao.descricao}</p>
    <h3>Parâmetros</h3>
    <div class="tabela"><table>
      <thead><tr><th>Nome</th><th>Tipo</th><th>Descrição</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table></div>
    <h3>Retorno</h3>
    <p>${funcao.retorno}</p>
    <h3>Exemplo</h3>
    <div class="exemplo">
      <div>
        ${blocoDeCodigo(funcao.html)}
        ${blocoDeCodigo(funcao.js)}
      </div>
      <div class="palco">${funcao.html}</div>
    </div>
  `
}

const menuInicio = document.getElementById('menu-inicio')
secoesDeInicio.forEach((secao) => adicionarSecao(menuInicio, secao))

const menuFuncoes = document.getElementById('menu-funcoes')
funcoes.forEach((funcao) => {
  adicionarSecao(
    menuFuncoes,
    { id: funcao.nome, rotulo: funcao.nome, html: htmlDaFuncao(funcao) },
    'secao funcao',
  )
  // Roda o mesmo código que aparece na página, cada exemplo no seu próprio escopo.
  new Function('Borg', funcao.js)(Borg)
})

ativarBlocosDeCodigo()
