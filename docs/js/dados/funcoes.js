/**
 * Documentação de cada função pública da Borg.
 *
 * O `html`, o `css` e o `js` de cada exemplo vão para um playground: aparecem na página e
 * rodam de verdade no resultado. O `js` é escrito sem o `import`; a página coloca no topo o
 * `import` das funções usadas (veja `comImport`).
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
    css: `
.grande {
  font-size: 2.5rem;
  font-weight: 700;
}`,
    js: `
let cliques = 0

aoClicar('#botao-contar', () => {
  cliques = cliques + 1
  mudarTexto('#cliques', cliques)
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
<p class="dica">Clique em qualquer lugar do resultado</p>
<p class="grande" id="posicao-clique">—</p>`,
    css: `
.dica {
  opacity: 0.7;
}

.grande {
  font-size: 2.5rem;
  font-weight: 700;
}`,
    js: `
aoClicarNaTela(({ x, y }) => {
  mudarTexto('#posicao-clique', x + ', ' + y)
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
<div class="barra-fundo">
  <div class="barra" id="barra-mouse"></div>
</div>`,
    css: `
.dica {
  opacity: 0.7;
}

.barra-fundo {
  width: 100%;
  height: 16px;
  border-radius: 999px;
  background: #cfe0e2;
  overflow: hidden;
}

.barra {
  width: 0;
  height: 100%;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
aoMoverMouse(({ x }) => {
  const porcentagem = (x / window.innerWidth) * 100
  mudarEstilo('#barra-mouse', 'width', porcentagem + '%')
})`,
  },
  {
    nome: 'aoPressionar',
    parametros: 'tecla, callback',
    descricao: 'Executa uma função quando uma tecla for pressionada.',
    tabela: [
      ['tecla', 'texto', '<code>\'a\'</code>, <code>\'7\'</code>, <code>\'espaço\'</code>, <code>\'enter\'</code>, <code>\'esc\'</code>, <code>\'seta cima\'</code>, <code>\'seta baixo\'</code>, <code>\'seta esquerda\'</code>, <code>\'seta direita\'</code> ou <code>\'qualquer\'</code>. Maiúsculas não fazem diferença.'],
      ['callback', 'função', 'Recebe o nome, em português, da tecla pressionada.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que remove o evento.',
    html: `
<p class="dica">Clique aqui e pressione qualquer tecla</p>
<p class="grande" id="ultima-tecla">—</p>`,
    css: `
.dica {
  opacity: 0.7;
}

.grande {
  font-size: 2.5rem;
  font-weight: 700;
}`,
    js: `
aoPressionar('qualquer', (tecla) => {
  mudarTexto('#ultima-tecla', tecla)
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
<p class="dica">Clique aqui, segure e solte a tecla <kbd>k</kbd></p>
<p class="grande" id="estado-k">solta</p>`,
    css: `
.dica {
  opacity: 0.7;
}

.grande {
  font-size: 2.5rem;
  font-weight: 700;
}`,
    js: `
aoPressionar('k', () => {
  mudarTexto('#estado-k', 'pressionada')
})

aoSoltar('k', () => {
  mudarTexto('#estado-k', 'solta')
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
<p class="dica">Clique aqui e segure <kbd>a</kbd> ou <kbd>d</kbd></p>
<div class="pista">
  <div class="jogador" id="jogador"></div>
</div>`,
    css: `
.dica {
  opacity: 0.7;
}

.pista {
  position: relative;
  width: 100%;
  height: 60px;
  border-radius: 12px;
  background: rgb(56 189 248 / 0.15);
}

.jogador {
  position: absolute;
  top: 5px;
  left: 0;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
let x = 0

function loop() {
  const limite = document.querySelector('.pista').clientWidth - 50

  if (teclaPressionada('d')) x = x + 4
  if (teclaPressionada('a')) x = x - 4
  x = Math.max(0, Math.min(x, limite))

  mudarEstilo('#jogador', 'left', x)
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
aoClicar('#botao-mostrar', () => {
  mostrar('#segredo')
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
    css: `
.caixa {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
aoClicar('#botao-esconder', () => {
  esconder('#caixa-sumir')
})

aoClicar('#botao-voltar', () => {
  mostrar('#caixa-sumir')
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
    css: `
.lampada {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #94a3b8;
  transition: background 0.2s, box-shadow 0.2s;
}

.lampada.acesa {
  background: #fbbf24;
  box-shadow: 0 0 32px #fbbf24;
}`,
    js: `
aoClicar('#interruptor', () => {
  alternarClasse('#lampada', 'acesa')
})`,
  },
  {
    nome: 'mudarTexto',
    parametros: 'seletor, texto',
    descricao: 'Troca o texto do elemento.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['texto', 'texto ou número', 'O novo texto.'],
    ],
    retorno: 'Nada.',
    html: `
<p class="grande" id="saudacao">Olá!</p>
<button id="botao-idioma">Trocar idioma</button>`,
    css: `
.grande {
  font-size: 2.5rem;
  font-weight: 700;
}`,
    js: `
const saudacoes = ['Olá!', 'Hello!', '¡Hola!', 'Ciao!']
let indice = 0

aoClicar('#botao-idioma', () => {
  indice = (indice + 1) % saudacoes.length
  mudarTexto('#saudacao', saudacoes[indice])
})`,
  },
  {
    nome: 'mudarEstilo',
    parametros: 'seletor, propriedade, valor',
    descricao: 'Altera um estilo CSS do elemento.',
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
    css: `
.caixa {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
  transition: all 0.2s;
}`,
    js: `
let tamanho = 70

aoClicar('#botao-crescer', () => {
  tamanho = tamanho >= 130 ? 70 : tamanho + 20
  mudarEstilo('#caixa-estilo', 'width', tamanho)
  mudarEstilo('#caixa-estilo', 'height', tamanho)
})

aoClicar('#botao-redondo', () => {
  mudarEstilo('#caixa-estilo', 'border-radius', '50%')
})`,
  },
]
