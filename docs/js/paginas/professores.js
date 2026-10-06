import { iniciarPagina } from '../layout.js'
import { ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { aviso } from '../componentes.js'
import { htmlDoMenuLateral, ligarMenuLateral, irParaAncora } from '../menu-lateral.js'

/**
 * Sequência sugerida de aulas. Cada uma tem um objetivo, as funções da Borg, o que o aluno
 * pratica de JavaScript e os desafios recomendados (ids da página Desafios).
 */
const aulas = [
  {
    titulo: 'Primeiro clique',
    objetivo: 'Entender que uma página pode reagir: quando algo acontece, um código roda.',
    funcoes: ['aoClicar', 'mudarTexto'],
    javascript: 'variáveis, funções de seta (<code>() =&gt; {}</code>), somar 1 a um número',
    roteiro:
      'Faça o guia <a href="./comecar.html">Começar</a> junto com a turma. Depois, troque o <code>mostrar</code> por um contador com <code>mudarTexto</code>.',
    desafios: [['contador', 'Contador com botão de zerar']],
  },
  {
    titulo: 'Mostrar e esconder',
    objetivo: 'Mudar o que aparece na tela e usar classes do CSS para mudar a aparência.',
    funcoes: ['mostrar', 'esconder', 'alternarClasse'],
    javascript: 'mais de uma reação na mesma página, seletores de id e de classe',
    roteiro:
      'Comece pelo CSS: crie a classe <code>.escuro</code> com a turma. Depois, mostre que o JavaScript só liga e desliga a classe.',
    desafios: [
      ['pergunta-resposta', 'Mostrar a resposta'],
      ['modo-escuro', 'Modo escuro com uma tecla'],
    ],
  },
  {
    titulo: 'Estilo que muda',
    objetivo: 'Mudar o CSS de um elemento a partir de um valor que o código calcula.',
    funcoes: ['mudarEstilo'],
    javascript: 'arrays, índice, o operador <code>%</code> para voltar ao começo',
    roteiro:
      'Mostre a diferença entre trocar uma classe (aula 2) e mudar um estilo direto. Quando cada um é melhor?',
    desafios: [['semaforo', 'Semáforo']],
  },
  {
    titulo: 'O mouse na tela',
    objetivo: 'Usar a posição do mouse, em números, para posicionar elementos.',
    funcoes: ['aoClicarNaTela', 'aoMoverMouse'],
    javascript: 'objetos e desestruturação (<code>({ x, y })</code>), contas com a posição',
    roteiro:
      'Peça para a turma mostrar <code>x</code> e <code>y</code> na tela com <code>mudarTexto</code> antes de mover qualquer coisa.',
    desafios: [['segue-mouse', 'Quadrado que segue o mouse']],
  },
  {
    titulo: 'Teclado',
    objetivo: 'Reagir a teclas específicas e perceber a diferença entre pressionar e soltar.',
    funcoes: ['aoPressionar', 'aoSoltar'],
    javascript: '<code>if</code> e comparações, números negativos',
    roteiro:
      'Use <code>aoPressionar(\'qualquer\', ...)</code> para a turma descobrir o nome em português de cada tecla.',
    desafios: [['placar-teclas', 'Placar com as setas']],
  },
  {
    titulo: 'Mini jogo',
    objetivo: 'Juntar tudo em um jogo simples, com movimento contínuo e limites na tela.',
    funcoes: ['teclaPressionada'],
    javascript: 'o loop com <code>requestAnimationFrame</code>, <code>Math.min</code> e <code>Math.max</code>',
    roteiro:
      'Explique por que <code>aoPressionar</code> não serve para movimento contínuo e por que o loop resolve. Termine com o projeto do <a href="./projetos.html#jogo-setas">jogo com as setas</a>.',
    desafios: [
      ['mover-setas', 'Mover um quadrado com as setas'],
      ['alvo', 'Clique no alvo'],
    ],
  },
]

const htmlDasAulas = aulas
  .map(
    (aula) => `
      <li class="aula">
        <h3>${aula.titulo}</h3>
        <p class="aula-objetivo">${aula.objetivo}</p>
        <dl>
          <div><dt>Funções</dt><dd>${aula.funcoes.map((nome) => `<a href="./funcoes.html#${nome}"><code>${nome}</code></a>`).join(', ')}</dd></div>
          <div><dt>JavaScript praticado</dt><dd>${aula.javascript}</dd></div>
          <div><dt>Como conduzir</dt><dd>${aula.roteiro}</dd></div>
          <div><dt>Desafio</dt><dd>${aula.desafios.map(([id, titulo]) => `<a href="./desafios.html#${id}">${titulo}</a>`).join(' e ')}</dd></div>
        </dl>
      </li>`,
  )
  .join('')

const secoes = [
  {
    id: 'o-que-e',
    rotulo: 'O que é e para quem',
    html: `
      <h2>O que é e para quem</h2>
      <p>
        A Borg JS é uma biblioteca de funções em português para fazer páginas reagirem a cliques, ao
        mouse e ao teclado. Ela foi pensada para as primeiras aulas de JavaScript, com alunos que já
        conhecem o básico de HTML e CSS.
      </p>
      <p>
        Funciona bem no ensino médio, em cursos técnicos e nos primeiros semestres de cursos de
        computação. Não precisa instalar nada: o aluno importa a Borg por um endereço na internet.
      </p>
    `,
  },
  {
    id: 'o-que-esconde',
    rotulo: 'O que a Borg esconde',
    html: `
      <h2>O que a Borg esconde, e por quê</h2>
      <p>Para mostrar uma mensagem no clique, um iniciante precisaria entender, de uma vez:</p>
      <ul>
        <li><code>document.querySelector</code> e o que fazer quando ele devolve <code>null</code>;</li>
        <li><code>addEventListener</code>, o nome do evento em inglês e o objeto <code>event</code>;</li>
        <li><code>event.key</code>, com nomes como <code>' '</code> e <code>'ArrowUp'</code>;</li>
        <li><code>preventDefault</code>, para a barra de espaço não rolar a página;</li>
        <li><code>element.style</code>, com nomes em camelCase e unidades como <code>px</code>.</li>
      </ul>
      <p>
        A Borg cuida disso. Assim, as primeiras aulas ficam no que importa: <strong>quando algo
        acontece, o que deve mudar</strong>. O aluno pratica variáveis, funções e condições com
        resultado visível desde o primeiro dia.
      </p>
      ${aviso('dica', 'A Borg não substitui o JavaScript, ela adia a parte burocrática. Quando a turma estiver confortável, use a tabela <a href="#borg-para-js">Da Borg ao JavaScript puro</a> para fazer a transição.')}
    `,
  },
  {
    id: 'aulas',
    rotulo: 'Sequência de aulas',
    html: `
      <h2>Sequência de aulas</h2>
      <p>
        Seis aulas de cerca de 50 minutos, cada uma apoiada na anterior. Uma divisão que funciona bem:
        10 minutos de demonstração, 20 de código junto com a turma e 20 para o desafio.
      </p>
      <ol class="aulas">${htmlDasAulas}</ol>
    `,
  },
]

const menu = htmlDoMenuLateral([{ titulo: 'Guia do professor', itens: secoes }])

const conteudo = iniciarPagina()
conteudo.innerHTML = `
  <div class="pagina com-lateral">
    ${menu}
    <div>
      <header class="pagina-cabecalho">
        <h1>Guia do professor</h1>
        <p>Como usar a Borg JS em sala: uma sequência de seis aulas, os erros mais comuns dos alunos e como passar para o JavaScript puro.</p>
      </header>
      ${secoes.map(({ id, html }) => `<section id="${id}" class="secao prosa">${html}</section>`).join('')}
    </div>
  </div>
`

ativarBlocosDeCodigo(conteudo)
ligarMenuLateral(conteudo)
irParaAncora()
