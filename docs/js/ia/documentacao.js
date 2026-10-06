import { htmlParaMarkdown } from './markdown.js'
import { URL_DO_SITE, URL_BORG_MJS, linhaDeImport, comImport } from '../config.js'
import { funcoes } from '../dados/funcoes.js'
import { secoesComoFunciona } from '../dados/como-funciona.js'
import { secaoSemImport } from '../dados/sem-import.js'
import { secaoMovimentoSuave } from '../dados/movimento-suave.js'
import { HTML_DO_PROJETO, REACAO, problemasComuns } from '../dados/comecar.js'
import { codigoDoPlayground } from '../playground/playground.js'
import { NOMES_DE_TECLA } from '../../../src/teclado/teclas.js'

/** O código de cada playground, pelo id, para o Markdown trocar o playground pelo código. */
const exemplos = new Proxy({}, { get: (_, id) => codigoDoPlayground(String(id)) })

/** Converte uma seção HTML do site, com os títulos um nível abaixo. */
const secao = ({ html }, pagina) => htmlParaMarkdown(html, { nivelExtra: 1, pagina, exemplos })

const cerca = (codigo, linguagem) => `\`\`\`${linguagem}\n${codigo.trim()}\n\`\`\``

function introducao() {
  return `# Borg JS — documentação completa

Documentação da biblioteca **Borg JS** para agentes de IA, gerada a partir do site oficial: ${URL_DO_SITE}

## O que é a Borg JS

A Borg JS é uma biblioteca JavaScript **educacional**, com funções **em português**, para fazer páginas reagirem a cliques, ao mouse e ao teclado e moverem elementos na tela. Ela esconde a parte trabalhosa do DOM (\`querySelector\`, \`addEventListener\`, nomes de tecla em inglês, unidades do CSS) para quem está aprendendo se concentrar em **quando algo acontece, o que deve mudar**, e no design com HTML e CSS.

É feita para alunos iniciantes e para professores das primeiras aulas de JavaScript. Use só as funções listadas aqui, com os nomes exatos.`
}

function comoUsar() {
  return `## Como usar

### Com import (recomendado)

O aluno importa as funções que vai usar direto do site, sem baixar nada. O código precisa estar em um \`<script type="module">\`, e a página precisa ser aberta por um servidor local (por exemplo, a extensão Live Server do VS Code); abrir o arquivo com dois cliques (\`file://\`) não funciona com módulos.

\`index.html\`:

${cerca(HTML_DO_PROJETO, 'html')}

\`main.js\`:

${cerca(comImport(REACAO), 'js')}

O \`import\` lista entre chaves as funções usadas. Precisou de outra, acrescente o nome:

${cerca(linhaDeImport(['aoClicar', 'mostrar', 'mudarTexto']), 'js')}

${secao(secaoSemImport, 'funcoes.html')}`
}

function regrasGerais() {
  const teclas = NOMES_DE_TECLA.map((tecla) => `\`'${tecla}'\``).join(', ')
  return `## Regras gerais

${secoesComoFunciona.map((item) => secao(item, 'funcoes.html')).join('\n\n')}

### Nomes de tecla

As funções de teclado (\`aoPressionar\`, \`aoSoltar\`, \`teclaPressionada\`) recebem o nome da tecla em português, sem diferença entre maiúsculas e minúsculas: letras e números (\`'a'\`, \`'7'\`) e ${teclas}. A tecla \`'qualquer'\` reage a qualquer tecla.`
}

/** @param {(typeof funcoes)[number]} funcao */
function documentacaoDaFuncao(funcao) {
  const md = (html) => htmlParaMarkdown(html, { pagina: 'funcoes.html' })
  const parametros = funcao.tabela
    .map(([nome, tipo, descricao]) => `| \`${nome}\` | ${tipo} | ${md(descricao).replace(/\|/g, '\\|')} |`)
    .join('\n')
  const avisos = (funcao.avisos ?? [])
    .map(([tipo, html]) => `> **${tipo === 'cuidado' ? 'Cuidado' : 'Dica'}:** ${md(html)}`)
    .join('\n\n')

  return [
    `#### \`${funcao.nome}(${funcao.parametros})\``,
    md(funcao.descricao),
    `| Parâmetro | Tipo | Descrição |\n| --- | --- | --- |\n${parametros}`,
    `**Retorno:** ${md(funcao.retorno)}`,
    avisos,
    `Exemplo (${URL_DO_SITE}/funcoes.html#${funcao.nome}):`,
    cerca(funcao.html, 'html'),
    funcao.css?.trim() ? cerca(funcao.css, 'css') : '',
    cerca(comImport(funcao.js), 'js'),
  ]
    .filter(Boolean)
    .join('\n\n')
}

function referencia() {
  const grupos = [...new Set(funcoes.map(({ grupo }) => grupo))]
  return `## Funções

Todas vêm de \`${URL_BORG_MJS}\`. As que começam com \`ao\` devolvem uma função \`parar()\`.

${grupos
  .map((grupo) => `### ${grupo}\n\n${funcoes.filter((f) => f.grupo === grupo).map(documentacaoDaFuncao).join('\n\n')}`)
  .join('\n\n')}`
}

function receitas() {
  return `## Receitas\n\n${secao(secaoMovimentoSuave, 'funcoes.html')}`
}

function problemas() {
  const linhas = problemasComuns
    .map(([sintoma, solucao]) =>
      [sintoma, solucao].map((html) => htmlParaMarkdown(html, { pagina: 'comecar.html' }).replace(/\|/g, '\\|')),
    )
    .map(([sintoma, solucao]) => `| ${sintoma} | ${solucao} |`)
    .join('\n')
  return `## Problemas comuns\n\n| O que aparece | O que fazer |\n| --- | --- |\n${linhas}`
}

/**
 * Monta a documentação completa da Borg em Markdown, a partir dos mesmos dados do site,
 * para colar em um agente de IA. Nada é escrito duas vezes: se o site muda, isto muda junto.
 * @returns {string}
 */
export function documentacaoEmMarkdown() {
  return `${[introducao(), comoUsar(), regrasGerais(), referencia(), receitas(), problemas()].join('\n\n')}\n`
}
