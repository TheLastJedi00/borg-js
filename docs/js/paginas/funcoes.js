import { secoesComoFunciona } from '../dados/como-funciona.js'
import { funcoes } from '../dados/funcoes.js'
import { secaoSemImport } from '../dados/sem-import.js'
import { ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { iniciarPagina } from '../layout.js'
import { playground, ativarPlaygrounds } from '../playground/playground.js'
import { comImport } from '../config.js'
import { aviso } from '../componentes.js'
import { htmlDoMenuLateral, ligarMenuLateral, irParaAncora } from '../menu-lateral.js'

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

/** @param {{ id: string, html: string }} secao */
const htmlDaSecao = ({ id, html }, classe = 'secao') => `<section id="${id}" class="${classe}">${html}</section>`

const gruposDeFuncoes = [...new Set(funcoes.map(({ grupo }) => grupo))]

const menu = htmlDoMenuLateral([
  { titulo: 'Como funciona', itens: secoesComoFunciona },
  ...gruposDeFuncoes.map((grupo) => ({
    titulo: grupo,
    itens: funcoes
      .filter((funcao) => funcao.grupo === grupo)
      .map(({ nome }) => ({ id: nome, rotulo: nome, codigo: true })),
  })),
  { titulo: 'Outras formas', itens: [secaoSemImport] },
])

const conteudo = iniciarPagina()
conteudo.innerHTML = `
  <div class="pagina com-lateral">
    ${menu}
    <div>
      <header class="pagina-cabecalho">
        <h1>Funções</h1>
        <p>Todas as funções da Borg: o que cada uma recebe, o que devolve e um exemplo que você pode editar.</p>
      </header>
      ${secoesComoFunciona.map((secao) => htmlDaSecao(secao)).join('')}
      ${funcoes.map((funcao) => htmlDaSecao({ id: funcao.nome, html: htmlDaFuncao(funcao) }, 'secao funcao')).join('')}
      ${htmlDaSecao(secaoSemImport)}
    </div>
  </div>
`

ativarBlocosDeCodigo(conteudo)
ativarPlaygrounds(conteudo)
ligarMenuLateral(conteudo)
irParaAncora()
