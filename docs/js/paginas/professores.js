import { iniciarPagina } from '../layout.js'
import { blocoDeCodigo, ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { comImport } from '../config.js'
import { aviso } from '../componentes.js'
import { htmlDoMenuLateral, ligarMenuLateral, irParaAncora } from '../menu-lateral.js'
import { icones } from '../icones.js'
import { ligarBotaoDeCopiar, baixarArquivo } from '../util.js'
import { htmlDoBotaoParaIa, ligarBotaoParaIa } from '../ia/botao.js'
import { AJUSTES_DO_PROFESSOR, REGRAS_DE_TUTOR } from '../dados/tutor.js'

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
    titulo: 'Movimento na tela',
    objetivo: 'Colocar e deslocar elementos com coordenadas e ler onde eles estão agora.',
    funcoes: ['elemento', 'posicao', 'moverPara', 'moverPor', 'manterNaTela'],
    javascript: 'variáveis que guardam elementos, objetos <code>{ x, y }</code>, somar à posição atual',
    roteiro:
      'Comece com <code>const nave = elemento(\'#nave\')</code> e mostre que a variável vale em qualquer função. Depois compare <code>moverPara(nave, { x: posicao(nave).x + 10 })</code> com o atalho <code>moverPor(nave, { x: 10 })</code>.',
    desafios: [
      ['mira', 'Mira que segue o mouse'],
      ['quadrado-na-tela', 'Quadrado que não sai da tela'],
    ],
  },
  {
    titulo: 'Mini jogo',
    objetivo: 'Juntar tudo em um jogo simples, com movimento contínuo, limites na tela e colisão.',
    funcoes: ['teclaPressionada', 'manterNaTela', 'colidiu'],
    javascript: 'o loop com <code>requestAnimationFrame</code>, condições que combinam várias teclas',
    roteiro:
      'Explique por que <code>aoPressionar</code> não serve para movimento contínuo e por que o loop resolve. Use <code>colidiu</code> para o jogador pegar algo. Termine com o projeto do <a href="./projetos.html#jogo-setas">jogo com as setas</a>.',
    desafios: [
      ['mover-setas', 'Mover um quadrado com as setas'],
      ['pegar-estrelas', 'Pegar as estrelas'],
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
        Sete aulas de cerca de 50 minutos, cada uma apoiada na anterior. Uma divisão que funciona bem:
        10 minutos de demonstração, 20 de código junto com a turma e 20 para o desafio.
      </p>
      <ol class="aulas">${htmlDasAulas}</ol>
    `,
  },
]

/** Erro do aluno → o que aparece → como orientar. */
const errosComuns = [
  [
    'Esquecer o <code>#</code> ou o <code>.</code> no seletor: <code>aoClicar(\'botao\', ...)</code>',
    '<code>[Borg] aoClicar: nenhum elemento encontrado para "botao". Confira o seletor no seu HTML.</code>',
    'Peça para comparar o seletor com o HTML, letra por letra. Lembre: <code>#</code> para id, <code>.</code> para classe.',
  ],
  [
    'Chamar a função em vez de passá-la: <code>aoClicar(\'#b\', mostrar(\'#m\'))</code>',
    'A mensagem aparece antes do clique, e depois: <code>[Borg] aoClicar: o parâmetro "callback" precisa ser uma função, mas recebeu nada (undefined).</code>',
    'Explique a diferença entre <em>fazer agora</em> e <em>fazer quando clicar</em>. A reação vai dentro de <code>() =&gt; { }</code>.',
  ],
  [
    'Escrever a tecla em inglês: <code>aoPressionar(\'space\', ...)</code>',
    '<code>[Borg] aoPressionar: não conheço a tecla "space". Use, por exemplo: ...</code>',
    'A própria mensagem lista os nomes válidos. Mostre <code>aoPressionar(\'qualquer\', ...)</code> para descobrir o nome de cada tecla.',
  ],
  [
    'Criar a variável dentro da reação: <code>() =&gt; { let pontos = 0; pontos++ }</code>',
    'O contador nunca passa de 1.',
    'Cada clique roda a função de novo e recria a variável. Ela precisa ser criada fora, antes do <code>aoClicar</code>.',
  ],
  [
    'Usar <code>aoPressionar</code> para mover um personagem.',
    'O personagem anda um passo por toque e não continua andando quando a tecla é segurada.',
    'Segurar não repete o <code>aoPressionar</code>, de propósito. Para movimento contínuo, use <code>teclaPressionada</code> dentro de um loop (aula 7).',
  ],
  [
    'Dar à variável o nome da função: <code>const elemento = elemento(\'#nave\')</code>',
    '<code>Identifier \'elemento\' has already been declared</code> (ou, dentro de uma função, <code>Cannot access \'elemento\' before initialization</code>)',
    'A variável esconde a função de mesmo nome. Peça um nome que diga o que o elemento é: <code>const nave = elemento(\'#nave\')</code>.',
  ],
  [
    'Mover algo que estava no meio do texto com <code>moverPara</code>.',
    'O resto da página "sobe" e ocupa o lugar do elemento.',
    'O elemento passa a usar <code>position: fixed</code> e sai do fluxo da página. Para peças de jogo, isso é o esperado; para o resto, deixe um espaço reservado no HTML.',
  ],
  [
    'Abrir o <code>index.html</code> com dois cliques.',
    'Nada reage, e o console fala em <code>CORS</code> ou <code>origin \'null\'</code>.',
    'Módulos precisam de um servidor. Use o Live Server do VS Code (veja o <a href="./comecar.html#passo-abrir">passo 5 do guia</a>).',
  ],
]

/** Função da Borg → equivalente em JavaScript puro. */
const equivalentes = [
  ['aoClicar(seletor, fn)', "document.querySelectorAll(seletor).forEach((el) => {\n  el.addEventListener('click', () => fn(el))\n})"],
  ['aoClicarNaTela(fn)', "document.addEventListener('click', (e) => {\n  fn({ x: e.clientX, y: e.clientY })\n})"],
  ['aoMoverMouse(fn)', "document.addEventListener('mousemove', (e) => {\n  fn({ x: e.clientX, y: e.clientY })\n})"],
  ["aoPressionar('espaço', fn)", "document.addEventListener('keydown', (e) => {\n  if (e.key === ' ' && !e.repeat) {\n    e.preventDefault()\n    fn()\n  }\n})"],
  ["aoSoltar('a', fn)", "document.addEventListener('keyup', (e) => {\n  if (e.key === 'a') fn()\n})"],
  ["teclaPressionada('a')", "const teclas = new Set()\ndocument.addEventListener('keydown', (e) => teclas.add(e.key))\ndocument.addEventListener('keyup', (e) => teclas.delete(e.key))\n\nteclas.has('a')"],
  ['mostrar(seletor)', "el.hidden = false\nel.style.display = ''"],
  ['esconder(seletor)', "el.style.display = 'none'"],
  ["alternarClasse(seletor, 'ativo')", "el.classList.toggle('ativo')"],
  ['mudarTexto(seletor, texto)', 'el.textContent = texto'],
  ["mudarEstilo(seletor, 'left', 10)", "el.style.left = '10px'"],
  ['parar()', "el.removeEventListener('click', reacao)"],
  ['elemento(seletor)', 'document.querySelector(seletor)'],
  ['posicao(el)', 'const r = el.getBoundingClientRect()\nconst posicao = { x: r.left, y: r.top }'],
  ['tamanho(el)', 'const r = el.getBoundingClientRect()\nconst tamanho = { largura: r.width, altura: r.height }'],
  ['tamanhoDaTela()', 'const tela = { largura: innerWidth, altura: innerHeight }'],
  ['moverPara(el, { x, y })', "el.style.position = 'fixed'\nel.style.left = x + 'px'\nel.style.top = y + 'px'"],
  ['moverPor(el, { x, y })', "const r = el.getBoundingClientRect()\nel.style.position = 'fixed'\nel.style.left = r.left + x + 'px'\nel.style.top = r.top + y + 'px'"],
  ['colidiu(a, b)', 'const ra = a.getBoundingClientRect()\nconst rb = b.getBoundingClientRect()\nconst colidiu = ra.left < rb.right && ra.right > rb.left &&\n  ra.top < rb.bottom && ra.bottom > rb.top'],
  ['estaNaTela(el)', 'const r = el.getBoundingClientRect()\nconst naTela = r.right > 0 && r.bottom > 0 &&\n  r.left < innerWidth && r.top < innerHeight'],
  ['aoEntrarNaTela(el, fn)', 'new IntersectionObserver((entradas) => {\n  entradas.forEach((e) => {\n    if (e.isIntersecting) fn(e.target)\n  })\n}).observe(el)'],
]

secoes.push(
  {
    id: 'erros-comuns',
    rotulo: 'Erros comuns dos alunos',
    html: `
      <h2>Erros comuns dos alunos</h2>
      <p>
        Quase todos aparecem no console. Ensine a turma a abrir o console (<kbd>F12</kbd>) antes de
        pedir ajuda: as mensagens <code>[Borg]</code> dizem o que aconteceu e como corrigir.
      </p>
      <div class="tabela tabela-erros"><table>
        <thead><tr><th>O aluno faz</th><th>O que aparece</th><th>Como orientar</th></tr></thead>
        <tbody>
          ${errosComuns.map((linha) => `<tr>${linha.map((celula) => `<td>${celula}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table></div>
    `,
  },
  {
    id: 'borg-para-js',
    rotulo: 'Da Borg ao JavaScript puro',
    html: `
      <h2>Da Borg ao JavaScript puro</h2>
      <p>
        Quando a turma estiver pronta, mostre o que cada função faz por baixo. Nos exemplos,
        <code>el</code> é um elemento já encontrado com <code>document.querySelector(seletor)</code>.
      </p>
      <div class="equivalentes">
        ${equivalentes
          .map(
            ([borg, puro]) => `
              <div class="equivalente">
                <p><code>${borg}</code></p>
                ${blocoDeCodigo(puro, 'js')}
              </div>`,
          )
          .join('')}
      </div>
      ${aviso('dica', 'Uma boa atividade de transição: pegar um desafio que a turma já resolveu com a Borg e reescrever sem ela, usando a tabela acima.')}
    `,
  },
  {
    id: 'desafios-em-aula',
    rotulo: 'Desafios e projetos em aula',
    html: `
      <h2>Como usar os desafios e os projetos em aula</h2>
      <ul>
        <li>
          Cada <a href="./desafios.html">desafio</a> tem enunciado, funções sugeridas e um código
          inicial que já roda no site. O aluno resolve ali mesmo, sem instalar nada.
        </li>
        <li>
          A solução fica fechada em <strong>Ver solução</strong>. Peça para a turma tentar antes e use
          a solução na correção coletiva. O botão <strong>Carregar no exemplo</strong> coloca a
          solução no playground para comparar.
        </li>
        <li>Os níveis acompanham as aulas: fáceis nas aulas 1 e 2, médios nas aulas 3 a 6 e difíceis na aula 7. A aula 6 também usa a mira, um desafio fácil, para aquecer.</li>
        <li>
          O playground não salva o que o aluno escreve. Para guardar, ele copia o código para os
          arquivos do projeto dele com o botão <strong>Copiar</strong>.
        </li>
        <li>
          Os <a href="./projetos.html">projetos</a> são para estudar código mais longo. O botão
          <strong>Copiar projeto inteiro</strong> gera um único <code>index.html</code>, que funciona
          aberto pelo Live Server.
        </li>
        <li>Para avaliar, peça uma mudança em um projeto, como contar pontos no jogo ou adicionar uma pergunta ao quiz.</li>
      </ul>
      ${blocoDeCodigo(comImport("// Exemplo de mudança pedida no quiz: mostrar a nota no fim\nmudarTexto('#nota', acertos + ' de ' + perguntas.length)"), 'js')}
    `,
  },
)

secoes.push({
  id: 'ia-na-aula',
  rotulo: 'IA na aula',
  html: `
    <h2>IA na aula</h2>
    <p>
      Muitos alunos já usam IA para programar. Ela ajuda quando explica e atrapalha quando escreve
      o código pelo aluno: o exercício fica pronto, mas ninguém aprendeu. A proposta aqui é usar a IA
      como <strong>tutor</strong>: ela conhece toda a documentação da Borg, mas responde com
      perguntas e dicas em etapas, pede para o aluno explicar o que entendeu e ensina a ler as
      mensagens <code>[Borg]</code>.
    </p>
    <h3>Crie o AGENTS.md no projeto do aluno</h3>
    <ol>
      <li>Baixe o arquivo <strong>AGENTS.md</strong> no botão abaixo.</li>
      <li>Coloque na raiz do projeto do aluno, ao lado do <code>index.html</code> e do <code>main.js</code>.</li>
      <li>Abra o arquivo e preencha o bloco <strong>Ajustes do professor</strong>: a turma, o assunto e o que está liberado.</li>
    </ol>
    <pre class="arvore" aria-label="Pasta meu-projeto com os arquivos index.html, main.js e AGENTS.md">meu-projeto/
├── index.html
├── main.js
└── AGENTS.md</pre>
    <div class="acoes-ia">
      <button type="button" class="botao botao-principal" id="baixar-agents">${icones.baixar}Baixar AGENTS.md</button>
      <button type="button" class="botao botao-secundario" id="copiar-agents">${icones.copiar}Copiar AGENTS.md</button>
      ${htmlDoBotaoParaIa({ id: 'copiar-para-ia-professor' })}
    </div>
    ${aviso('dica', 'O AGENTS.md tem as regras de tutor e, logo depois, a documentação completa da Borg, a mesma do botão <strong>Copiar para IA</strong>. Assim a IA sabe tudo da Borg e não inventa funções.')}
    <h3>Quais ferramentas leem o arquivo</h3>
    <div class="tabela"><table>
      <thead><tr><th>Ferramenta</th><th>O que fazer</th></tr></thead>
      <tbody>
        <tr><td>GitHub Copilot no VS Code, Cursor, Codex</td><td>Leem o <code>AGENTS.md</code> da raiz do projeto sozinhos. No Copilot, o arquivo <code>.github/copilot-instructions.md</code>, com o mesmo conteúdo, também funciona.</td></tr>
        <tr><td>Claude Code</td><td>Crie um <code>CLAUDE.md</code> com a linha <code>@AGENTS.md</code>, ou copie o conteúdo do <code>AGENTS.md</code> para ele.</td></tr>
        <tr><td>Chat no navegador (ChatGPT, Gemini, Claude)</td><td>Anexe o arquivo ou cole o conteúdo no começo da conversa, antes da primeira pergunta.</td></tr>
      </tbody>
    </table></div>
    <h3>O que o prompt pede para a IA</h3>
    <p>Esta é a parte de regras do arquivo. Leia antes de entregar para a turma e ajuste se quiser:</p>
    ${blocoDeCodigo(`${AJUSTES_DO_PROFESSOR}\n\n${REGRAS_DE_TUTOR}`, 'texto')}
    ${aviso('cuidado', 'Nenhum prompt garante que a IA nunca vai entregar a resposta. Combine o AGENTS.md com o que já funciona em sala: peça para o aluno explicar o próprio código e mudar uma parte na sua frente.')}
  `,
})

const menu = htmlDoMenuLateral([{ titulo: 'Guia do professor', itens: secoes }])

const conteudo = iniciarPagina()
conteudo.innerHTML = `
  <div class="pagina com-lateral">
    ${menu}
    <div>
      <header class="pagina-cabecalho">
        <h1>Guia do professor</h1>
        <p>Como usar a Borg JS em sala: uma sequência de sete aulas, os erros mais comuns dos alunos e como passar para o JavaScript puro.</p>
      </header>
      ${secoes.map(({ id, html }) => `<section id="${id}" class="secao">${html}</section>`).join('')}
    </div>
  </div>
`

ativarBlocosDeCodigo(conteudo)
ligarMenuLateral(conteudo)
ligarBotoesDoAgents()
irParaAncora()

/** AGENTS.md montado sob demanda: ele traz a documentação inteira. */
let agents
function carregarAgents() {
  agents ??= import('../ia/agents.js').then((modulo) => modulo.gerarAgentsMd())
  return agents
}

function ligarBotoesDoAgents() {
  const baixar = document.getElementById('baixar-agents')
  const copiar = document.getElementById('copiar-agents')
  for (const botao of [baixar, copiar]) {
    botao.addEventListener('pointerenter', carregarAgents, { once: true })
    botao.addEventListener('focus', carregarAgents, { once: true })
  }
  baixar.addEventListener('click', async () => baixarArquivo(await carregarAgents(), 'AGENTS.md', 'text/markdown'))
  ligarBotaoDeCopiar(copiar, carregarAgents)
  ligarBotaoParaIa(document.getElementById('copiar-para-ia-professor'))
}
