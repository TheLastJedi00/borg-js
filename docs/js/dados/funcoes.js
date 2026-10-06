/**
 * Documentação de cada função pública da Borg.
 *
 * O `html` e o `js` de cada exemplo são exibidos na página e executados de verdade no
 * palco. Assim, o código mostrado é exatamente o código que roda.
 */
export const funcoes = [
  {
    nome: 'aoClicar',
    parametros: 'seletor, callback',
    descricao: 'Executa uma função sempre que o elemento for clicado.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS (ex.: <code>\'#botao\'</code>) ou um elemento do DOM.'],
      ['callback', 'função', 'Executada a cada clique. Recebe o elemento clicado.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que remove o evento.',
    html: `
<button id="botao-contar">Clique em mim</button>
<p class="grande" id="cliques">0</p>`,
    js: `
let cliques = 0

Borg.aoClicar('#botao-contar', () => {
  cliques = cliques + 1
  Borg.mudarTexto('#cliques', cliques)
})`,
  },
  {
    nome: 'aoClicarNaTela',
    parametros: 'callback',
    descricao: 'Executa uma função sempre que houver um clique em qualquer lugar da página.',
    tabela: [
      ['callback', 'função', 'Recebe <code>{ x, y }</code>: a posição do clique, em pixels, a partir do canto superior esquerdo da janela.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que remove o evento.',
    html: `
<p class="dica">Clique em qualquer lugar da página</p>
<p class="grande" id="posicao-clique">—</p>`,
    js: `
Borg.aoClicarNaTela(({ x, y }) => {
  Borg.mudarTexto('#posicao-clique', x + ', ' + y)
})`,
  },
  {
    nome: 'aoMoverMouse',
    parametros: 'callback',
    descricao: 'Executa uma função sempre que o mouse se mover pela página.',
    tabela: [
      ['callback', 'função', 'Recebe <code>{ x, y }</code>: a posição atual do mouse, em pixels, a partir do canto superior esquerdo da janela.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que remove o evento.',
    html: `
<p class="dica">Mova o mouse para os lados</p>
<div class="barra-fundo"><div class="barra" id="barra-mouse"></div></div>`,
    js: `
Borg.aoMoverMouse(({ x }) => {
  const porcentagem = (x / window.innerWidth) * 100
  Borg.mudarEstilo('#barra-mouse', 'width', porcentagem + '%')
})`,
  },
  {
    nome: 'aoPressionar',
    parametros: 'tecla, callback',
    descricao:
      'Executa uma função quando uma tecla for pressionada. Dispara uma vez por toque: segurar a tecla não repete. Com <code>\'espaço\'</code> e as setas, a rolagem da página é bloqueada, exceto dentro de campos de texto.',
    tabela: [
      ['tecla', 'texto', '<code>\'a\'</code>, <code>\'7\'</code>, <code>\'espaço\'</code>, <code>\'enter\'</code>, <code>\'esc\'</code>, <code>\'seta cima\'</code>, <code>\'seta baixo\'</code>, <code>\'seta esquerda\'</code>, <code>\'seta direita\'</code> ou <code>\'qualquer\'</code>. Maiúsculas não fazem diferença.'],
      ['callback', 'função', 'Recebe o nome, em português, da tecla pressionada.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que remove o evento.',
    html: `
<p class="dica">Pressione qualquer tecla</p>
<p class="grande" id="ultima-tecla">—</p>`,
    js: `
Borg.aoPressionar('qualquer', (tecla) => {
  Borg.mudarTexto('#ultima-tecla', tecla)
})`,
  },
  {
    nome: 'aoSoltar',
    parametros: 'tecla, callback',
    descricao: 'Executa uma função quando uma tecla for solta.',
    tabela: [
      ['tecla', 'texto', 'Os mesmos nomes de <code>aoPressionar</code>.'],
      ['callback', 'função', 'Recebe o nome, em português, da tecla solta.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que remove o evento.',
    html: `
<p class="dica">Segure e solte a tecla <span class="tecla">k</span></p>
<p class="grande" id="estado-k">solta</p>`,
    js: `
Borg.aoPressionar('k', () => {
  Borg.mudarTexto('#estado-k', 'pressionada')
})

Borg.aoSoltar('k', () => {
  Borg.mudarTexto('#estado-k', 'solta')
})`,
  },
  {
    nome: 'teclaPressionada',
    parametros: 'tecla',
    descricao:
      'Diz se uma tecla está pressionada neste momento. É ideal para jogos, dentro de um loop. Quando a janela perde o foco, todas as teclas são consideradas soltas.',
    tabela: [['tecla', 'texto', 'Os mesmos nomes de <code>aoPressionar</code>.']],
    retorno: '<code>true</code> enquanto a tecla estiver pressionada, senão <code>false</code>.',
    html: `
<p class="dica">Segure <span class="tecla">a</span> ou <span class="tecla">d</span></p>
<div class="pista"><div class="caixa" id="jogador"></div></div>`,
    js: `
let x = 0

function loop() {
  if (Borg.teclaPressionada('d')) x = x + 4
  if (Borg.teclaPressionada('a')) x = x - 4
  x = Math.max(0, Math.min(x, 240))

  Borg.mudarEstilo('#jogador', 'left', x)
  requestAnimationFrame(loop)
}

loop()`,
  },
  {
    nome: 'mostrar',
    parametros: 'seletor',
    descricao:
      'Torna o elemento visível. Funciona com o atributo <code>hidden</code>, com <code>esconder</code> e com <code>display: none</code> vindo do CSS.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.']],
    retorno: 'Nada.',
    html: `
<button id="botao-mostrar">Mostrar segredo</button>
<p id="segredo" hidden>🦉 A coruja vê tudo!</p>`,
    js: `
Borg.aoClicar('#botao-mostrar', () => {
  Borg.mostrar('#segredo')
})`,
  },
  {
    nome: 'esconder',
    parametros: 'seletor',
    descricao: 'Esconde o elemento.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.']],
    retorno: 'Nada.',
    html: `
<div class="caixa" id="caixa-sumir"></div>
<button id="botao-esconder">Esconder</button>
<button id="botao-voltar">Voltar</button>`,
    js: `
Borg.aoClicar('#botao-esconder', () => {
  Borg.esconder('#caixa-sumir')
})

Borg.aoClicar('#botao-voltar', () => {
  Borg.mostrar('#caixa-sumir')
})`,
  },
  {
    nome: 'alternarClasse',
    parametros: 'seletor, classe',
    descricao: 'Adiciona a classe se o elemento não a tiver, e remove se tiver.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['classe', 'texto', 'Nome da classe, com ou sem ponto (<code>\'acesa\'</code> ou <code>\'.acesa\'</code>).'],
    ],
    retorno: 'Nada.',
    html: `
<div class="lampada" id="lampada"></div>
<button id="interruptor">Liga / desliga</button>`,
    js: `
Borg.aoClicar('#interruptor', () => {
  Borg.alternarClasse('#lampada', 'acesa')
})`,
  },
  {
    nome: 'mudarTexto',
    parametros: 'seletor, texto',
    descricao: 'Troca o texto do elemento. O texto é tratado como texto puro, e tags HTML não são interpretadas.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['texto', 'texto ou número', 'O novo texto.'],
    ],
    retorno: 'Nada.',
    html: `
<p class="grande" id="saudacao">Olá!</p>
<button id="botao-idioma">Trocar idioma</button>`,
    js: `
const saudacoes = ['Olá!', 'Hello!', '¡Hola!', 'Ciao!']
let indice = 0

Borg.aoClicar('#botao-idioma', () => {
  indice = (indice + 1) % saudacoes.length
  Borg.mudarTexto('#saudacao', saudacoes[indice])
})`,
  },
  {
    nome: 'mudarEstilo',
    parametros: 'seletor, propriedade, valor',
    descricao:
      'Altera um estilo CSS do elemento. Números viram pixels (<code>100</code> → <code>\'100px\'</code>), exceto em propriedades sem unidade, como <code>opacity</code> e <code>z-index</code>.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['propriedade', 'texto', 'Nome no formato do CSS (<code>\'border-radius\'</code>) ou do JS (<code>\'borderRadius\'</code>).'],
      ['valor', 'texto ou número', 'O valor do estilo.'],
    ],
    retorno: 'Nada.',
    html: `
<div class="caixa" id="caixa-estilo"></div>
<button id="botao-crescer">Crescer</button>
<button id="botao-redondo">Arredondar</button>`,
    js: `
let tamanho = 70

Borg.aoClicar('#botao-crescer', () => {
  tamanho = tamanho >= 130 ? 70 : tamanho + 20
  Borg.mudarEstilo('#caixa-estilo', 'width', tamanho)
  Borg.mudarEstilo('#caixa-estilo', 'height', tamanho)
})

Borg.aoClicar('#botao-redondo', () => {
  Borg.mudarEstilo('#caixa-estilo', 'border-radius', '50%')
})`,
  },
]
