import { secoesComoFunciona } from '../dados/como-funciona.js'
import { funcoes } from '../dados/funcoes.js'
import { ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { iniciarPagina } from '../layout.js'
import { playground, ativarPlaygrounds } from '../playground/playground.js'
import { comImport } from '../config.js'
import { aviso } from '../componentes.js'

iniciarPagina().innerHTML = `
  <div class="pagina com-lateral">
    <nav class="lateral menu-lateral" aria-label="Nesta página">
      <p>Como funciona</p>
      <ul id="menu-como-funciona"></ul>
      <p>Funções</p>
      <ul id="menu-funcoes"></ul>
    </nav>
    <div id="secoes">
      <header class="pagina-cabecalho">
        <h1>Funções</h1>
        <p>Todas as funções da Borg: o que cada uma recebe, o que devolve e um exemplo que você pode editar.</p>
      </header>
    </div>
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
 * Monta o HTML da seção de uma função: descrição, avisos, parâmetros, retorno e exemplo.
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
    ${(funcao.avisos ?? []).map(([tipo, html]) => aviso(tipo, html)).join('')}
    <h3>Parâmetros</h3>
    <div class="tabela"><table>
      <thead><tr><th>Nome</th><th>Tipo</th><th>Descrição</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table></div>
    <h3>Retorno</h3>
    <p>${funcao.retorno}</p>
    <h3>Exemplo</h3>
    ${playground({
      id: `exemplo-${funcao.nome}`,
      titulo: funcao.nome,
      html: funcao.html,
      css: funcao.css,
      js: comImport(funcao.js),
    })}
  `
}

const menuComoFunciona = document.getElementById('menu-como-funciona')
secoesComoFunciona.forEach((secao) => adicionarSecao(menuComoFunciona, secao))

const menuFuncoes = document.getElementById('menu-funcoes')
funcoes.forEach((funcao) => {
  adicionarSecao(
    menuFuncoes,
    { id: funcao.nome, rotulo: funcao.nome, html: htmlDaFuncao(funcao) },
    'secao funcao',
  )
})

ativarBlocosDeCodigo()
ativarPlaygrounds()
