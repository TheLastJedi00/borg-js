/**
 * Documentação de cada função pública da Borg.
 *
 * O `html`, o `css` e o `js` de cada exemplo vão para um playground: aparecem na página e
 * rodam de verdade no resultado. O `js` é escrito sem o `import`; a página coloca no topo o
 * `import` das funções usadas (veja `comImport`). O `grupo` organiza o menu lateral.
 */
export const funcoes = [
  {
    nome: 'aoClicar',
    grupo: 'Mouse',
    parametros: 'seletor, callback',
    descricao: 'Executa uma função sempre que o elemento for clicado.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS (ex.: <code>\'#botao\'</code>) ou um elemento do DOM.'],
      ['callback', 'função', 'Executada a cada clique. Recebe o elemento clicado.'],
    ],
    avisos: [
      ['dica', 'O seletor é procurado no momento em que <code>aoClicar</code> é chamada. Elementos criados depois disso não reagem: chame <code>aoClicar</code> de novo para eles.'],
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
    grupo: 'Mouse',
    parametros: 'callback',
    descricao: 'Executa uma função sempre que houver um clique em qualquer lugar da página.',
    tabela: [
      ['callback', 'função', 'Recebe <code>{ x, y }</code>: a posição do clique, em pixels, a partir do canto superior esquerdo da janela.'],
    ],
    avisos: [
      ['dica', 'Para reagir só a cliques em um elemento específico, use <code>aoClicar</code>.'],
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
    grupo: 'Mouse',
    parametros: 'callback',
    descricao: 'Executa uma função sempre que o mouse se mover pela página.',
    tabela: [
      ['callback', 'função', 'Recebe <code>{ x, y }</code>: a posição atual do mouse, em pixels, a partir do canto superior esquerdo da janela.'],
    ],
    avisos: [
      ['dica', '<code>x</code> e <code>y</code> contam a partir do canto da janela, não do elemento. Para fazer algo seguir o mouse, use esses valores em <code>mudarEstilo</code> com <code>left</code> e <code>top</code>.'],
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
    grupo: 'Teclado',
    parametros: 'tecla, callback',
    descricao: 'Executa uma função quando uma tecla for pressionada.',
    tabela: [
      ['tecla', 'texto', '<code>\'a\'</code>, <code>\'7\'</code>, <code>\'espaço\'</code>, <code>\'enter\'</code>, <code>\'esc\'</code>, <code>\'seta cima\'</code>, <code>\'seta baixo\'</code>, <code>\'seta esquerda\'</code>, <code>\'seta direita\'</code> ou <code>\'qualquer\'</code>. Maiúsculas não fazem diferença.'],
      ['callback', 'função', 'Recebe o nome, em português, da tecla pressionada.'],
    ],
    avisos: [
      ['cuidado', 'Dispara uma vez por toque: segurar a tecla não repete. Para movimento contínuo, como em jogos, use <code>teclaPressionada</code>.'],
      ['dica', 'Com <code>\'espaço\'</code> e as setas, a Borg impede que a página role, exceto dentro de campos de texto. Com <code>\'qualquer\'</code>, a rolagem continua normal. <code>\'espaco\'</code>, sem acento, também funciona.'],
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
    grupo: 'Teclado',
    parametros: 'tecla, callback',
    descricao: 'Executa uma função quando uma tecla for solta.',
    tabela: [
      ['tecla', 'texto', 'Os mesmos nomes de <code>aoPressionar</code>.'],
      ['callback', 'função', 'Recebe o nome, em português, da tecla solta.'],
    ],
    avisos: [
      ['dica', 'Use <code>aoPressionar</code> e <code>aoSoltar</code> juntas para saber quando uma tecla começa e quando termina de ser pressionada.'],
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
    grupo: 'Teclado',
    parametros: 'tecla',
    descricao:
      'Diz se uma tecla está pressionada neste momento. É ideal para jogos, dentro de um loop. Quando a janela perde o foco, todas as teclas são consideradas soltas.',
    tabela: [['tecla', 'texto', 'Os mesmos nomes de <code>aoPressionar</code>.']],
    avisos: [
      ['cuidado', 'A Borg começa a acompanhar o teclado na primeira vez que <code>teclaPressionada</code> é chamada. Por isso, chame dentro de um loop, como no exemplo.'],
    ],
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
    grupo: 'Reações',
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
    grupo: 'Reações',
    parametros: 'seletor',
    descricao: 'Esconde o elemento.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.']],
    avisos: [
      ['dica', '<code>mostrar</code> traz o elemento de volta com o <code>display</code> que ele tinha antes, como <code>flex</code> ou <code>grid</code>.'],
    ],
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
    grupo: 'Reações',
    parametros: 'seletor, classe',
    descricao: 'Adiciona a classe se o elemento não a tiver, e remove se tiver.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['classe', 'texto', 'Nome da classe, com ou sem ponto (<code>\'acesa\'</code> ou <code>\'.acesa\'</code>).'],
    ],
    avisos: [
      ['cuidado', 'Uma classe por vez. Um nome com espaço, como <code>\'acesa grande\'</code>, gera um erro.'],
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
    grupo: 'Reações',
    parametros: 'seletor, texto',
    descricao: 'Troca o texto do elemento.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['texto', 'texto ou número', 'O novo texto.'],
    ],
    avisos: [
      ['cuidado', 'O texto é tratado como texto puro: <code>&lt;b&gt;oi&lt;/b&gt;</code> aparece assim mesmo, com as tags, e não vira negrito.'],
      ['dica', 'Números também funcionam: <code>mudarTexto(\'#pontos\', 10)</code>.'],
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
    grupo: 'Reações',
    parametros: 'seletor, propriedade, valor',
    descricao: 'Altera um estilo CSS do elemento.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['propriedade', 'texto', 'Nome no formato do CSS (<code>\'border-radius\'</code>) ou do JS (<code>\'borderRadius\'</code>).'],
      ['valor', 'texto ou número', 'O valor do estilo.'],
    ],
    avisos: [
      ['dica', 'Números viram pixels (<code>100</code> → <code>\'100px\'</code>), exceto em propriedades sem unidade, como <code>opacity</code> e <code>z-index</code>. Variáveis CSS, como <code>\'--cor\'</code>, também funcionam.'],
      ['cuidado', 'Se o navegador não aceitar a propriedade ou o valor, a Borg avisa no console qual foi o problema.'],
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
  {
    nome: 'elemento',
    grupo: 'Movimento',
    parametros: 'seletor',
    descricao:
      'Pega um elemento da página, como um <code>document.querySelector</code> mais simples. O resultado é o elemento do DOM de verdade e pode ser passado para <strong>qualquer</strong> função da Borg no lugar do seletor.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS (ex.: <code>\'#nave\'</code>) ou um elemento do DOM.']],
    avisos: [
      ['dica', 'Guarde o elemento em uma variável com um nome que diga o que ele é: <code>const nave = elemento(\'#nave\')</code>. Não chame a variável de <code>elemento</code>, senão a função some.'],
      ['cuidado', 'Se o seletor encontrar vários elementos, <code>elemento</code> devolve só o primeiro. Para mexer em todos, passe o seletor direto para a função, como <code>mudarEstilo(\'.cartao\', ...)</code>.'],
    ],
    retorno: 'O elemento encontrado, ou <code>null</code> (com um aviso no console) se nada for encontrado.',
    html: `
<div class="caixa" id="caixa-elemento">Caixa</div>
<button id="botao-pintar">Pintar</button>`,
    css: `
.caixa {
  display: grid;
  place-items: center;
  width: 120px;
  height: 70px;
  margin-bottom: 12px;
  border-radius: 14px;
  background: #38bdf8;
  font-weight: 700;
}`,
    js: `
const caixa = elemento('#caixa-elemento')

aoClicar('#botao-pintar', () => {
  mudarEstilo(caixa, 'background', 'gold')
  mudarTexto(caixa, 'Pintada!')
})`,
  },
  {
    nome: 'posicao',
    grupo: 'Movimento',
    parametros: 'seletor',
    descricao:
      'Lê a posição atual do elemento na tela: onde está o canto superior esquerdo dele, em pixels, a partir do canto superior esquerdo da janela.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento, como o devolvido por <code>elemento</code>.']],
    avisos: [
      ['dica', 'Com <code>posicao</code>, dá para andar a partir de onde o elemento está: <code>moverPara(bola, { x: posicao(bola).x + 20 })</code>. Para só deslocar, <code>moverPor</code> é o atalho.'],
    ],
    retorno: 'Um objeto <code>{ x, y }</code>, ou <code>null</code> (com um aviso no console) se nada for encontrado.',
    html: `
<button id="botao-andar">Andar 20 px</button>
<p id="saida-posicao">x = ?</p>
<div class="bola" id="bola-posicao"></div>`,
    css: `
.bola {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
const bola = elemento('#bola-posicao')
moverPara(bola, { x: 20, y: 110 })

aoClicar('#botao-andar', () => {
  moverPara(bola, { x: posicao(bola).x + 20 })
  mudarTexto('#saida-posicao', 'x = ' + posicao(bola).x)
})`,
  },
  {
    nome: 'tamanho',
    grupo: 'Movimento',
    parametros: 'seletor',
    descricao: 'Lê a largura e a altura do elemento na tela, em pixels.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.']],
    retorno: 'Um objeto <code>{ largura, altura }</code>, ou <code>null</code> (com um aviso no console) se nada for encontrado.',
    html: `
<p class="dica">Clique na caixa para ela crescer</p>
<div class="caixa" id="caixa-tamanho"></div>
<p id="medida">—</p>`,
    css: `
.dica {
  opacity: 0.7;
}

.caixa {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
  cursor: pointer;
}`,
    js: `
aoClicar('#caixa-tamanho', (caixa) => {
  mudarEstilo(caixa, 'width', tamanho(caixa).largura + 20)

  const { largura, altura } = tamanho(caixa)
  mudarTexto('#medida', largura + ' x ' + altura)
})`,
  },
  {
    nome: 'tamanhoDaTela',
    grupo: 'Movimento',
    parametros: '',
    descricao: 'Lê a largura e a altura da janela visível (a parte da página que aparece na tela), em pixels.',
    tabela: [['—', '—', 'Não recebe parâmetros.']],
    avisos: [
      ['dica', 'No playground, a "tela" é o quadro do resultado. Na sua página, é a janela do navegador.'],
    ],
    retorno: 'Um objeto <code>{ largura, altura }</code>.',
    html: `
<p id="medida-tela">—</p>
<button id="botao-centro">Ir para o centro</button>
<div class="bola" id="bola-centro"></div>`,
    css: `
.bola {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
const tela = tamanhoDaTela()
mudarTexto('#medida-tela', 'Tela: ' + tela.largura + ' x ' + tela.altura)

aoClicar('#botao-centro', () => {
  const bola = tamanho('#bola-centro')
  moverPara('#bola-centro', {
    x: (tela.largura - bola.largura) / 2,
    y: (tela.altura - bola.altura) / 2,
  })
})`,
  },
  {
    nome: 'moverPara',
    grupo: 'Movimento',
    parametros: 'seletor, { x, y }',
    descricao:
      'Coloca o elemento em um ponto da tela. O ponto <code>{ x, y }</code> é medido em pixels a partir do canto superior esquerdo da janela, e é o canto superior esquerdo do elemento que vai para lá.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM. Se encontrar vários, todos vão para o ponto.'],
      ['{ x, y }', 'objeto', 'O ponto da tela. Pode ter só um eixo: <code>{ x: 100 }</code> mantém o <code>y</code> atual. É o mesmo formato que <code>aoMoverMouse</code> entrega.'],
    ],
    avisos: [
      ['cuidado', 'O elemento passa a usar <code>position: fixed</code> e sai do fluxo da página: o que vinha depois dele sobe para ocupar o lugar.'],
      ['dica', 'O movimento é instantâneo. Para ele deslizar, veja <a href="#movimento-suave">Movimento suave</a>.'],
    ],
    retorno: 'Nada.',
    html: `
<p class="dica">Mova o mouse no resultado</p>
<div class="mira" id="mira"></div>`,
    css: `
.dica {
  opacity: 0.7;
}

.mira {
  width: 30px;
  height: 30px;
  border: 4px solid #f59e0b;
  border-radius: 50%;
  pointer-events: none;
}`,
    js: `
aoMoverMouse((posicao) => {
  moverPara('#mira', posicao)
})`,
  },
  {
    nome: 'moverPor',
    grupo: 'Movimento',
    parametros: 'seletor, { x, y }',
    descricao:
      'Desloca o elemento a partir de onde ele está. <code>x</code> positivo vai para a direita e negativo para a esquerda; <code>y</code> positivo vai para baixo e negativo para cima.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM. Cada elemento anda a partir da própria posição.'],
      ['{ x, y }', 'objeto', 'Quantos pixels andar. O eixo que faltar não muda: <code>{ x: 10 }</code> anda só para o lado.'],
    ],
    avisos: [
      ['cuidado', 'Assim como <code>moverPara</code>, o elemento passa a usar <code>position: fixed</code>.'],
    ],
    retorno: 'Nada.',
    html: `
<p class="dica">Clique aqui e use as setas</p>
<div class="carro" id="carro"></div>`,
    css: `
.dica {
  opacity: 0.7;
}

.carro {
  width: 50px;
  height: 30px;
  border-radius: 10px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
aoPressionar('seta direita', () => moverPor('#carro', { x: 20 }))
aoPressionar('seta esquerda', () => moverPor('#carro', { x: -20 }))
aoPressionar('seta cima', () => moverPor('#carro', { y: -20 }))
aoPressionar('seta baixo', () => moverPor('#carro', { y: 20 }))`,
  },
  {
    nome: 'manterNaTela',
    grupo: 'Movimento',
    parametros: 'seletor',
    descricao:
      'Se o elemento passou de alguma borda da janela, traz ele de volta para dentro. O ajuste acontece uma vez, na hora da chamada, então use dentro do loop do jogo, logo depois de mover.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.']],
    avisos: [
      ['dica', 'O retorno diz se o elemento bateu na borda. No exemplo, isso inverte a direção da bola.'],
    ],
    retorno: '<code>true</code> se precisou trazer o elemento de volta, senão <code>false</code>.',
    html: `
<div class="bola" id="bola-borda"></div>`,
    css: `
.bola {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
let velocidade = 4
moverPara('#bola-borda', { x: 0, y: 60 })

function loop() {
  moverPor('#bola-borda', { x: velocidade })

  if (manterNaTela('#bola-borda')) {
    velocidade = -velocidade
  }
  requestAnimationFrame(loop)
}

loop()`,
  },
  {
    nome: 'colidiu',
    grupo: 'Movimento',
    parametros: 'seletorA, seletorB',
    descricao: 'Diz se dois elementos estão se encostando, ou seja, se os retângulos deles se sobrepõem.',
    tabela: [
      ['seletorA', 'texto ou elemento', 'O primeiro elemento.'],
      ['seletorB', 'texto ou elemento', 'O segundo elemento.'],
    ],
    avisos: [
      ['dica', 'Só encostar na borda não conta como colisão: os dois precisam se sobrepor pelo menos um pouco.'],
    ],
    retorno: '<code>true</code> se os dois se sobrepõem, senão <code>false</code>.',
    html: `
<p id="placar-colisao">Leve o quadrado até a estrela</p>
<div class="estrela" id="estrela">★</div>
<div class="jogador" id="jogador-colisao"></div>`,
    css: `
.estrela {
  position: fixed;
  left: 70%;
  top: 55%;
  font-size: 2.5rem;
  color: #f59e0b;
}

.jogador {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
  pointer-events: none;
}`,
    js: `
aoMoverMouse((posicao) => {
  moverPara('#jogador-colisao', posicao)

  if (colidiu('#jogador-colisao', '#estrela')) {
    mudarTexto('#placar-colisao', 'Pegou a estrela!')
  } else {
    mudarTexto('#placar-colisao', 'Leve o quadrado até a estrela')
  }
})`,
  },
  {
    nome: 'estaNaTela',
    grupo: 'Tela',
    parametros: 'seletor',
    descricao: 'Diz se o elemento aparece na tela agora, mesmo que só uma parte dele.',
    tabela: [['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.']],
    avisos: [
      ['dica', 'Elementos escondidos (com <code>display: none</code>) não contam como "na tela".'],
    ],
    retorno: '<code>true</code> se pelo menos uma parte do elemento está dentro da janela, senão <code>false</code>.',
    html: `
<button class="fixo" id="botao-conferir">O alvo aparece?</button>
<p class="dica">Role o resultado para baixo e clique de novo</p>
<div class="espaco"></div>
<div class="alvo" id="alvo">Alvo</div>`,
    css: `
.fixo {
  position: fixed;
  top: 10px;
  right: 10px;
}

.dica {
  opacity: 0.7;
}

.espaco {
  height: 400px;
}

.alvo {
  padding: 20px;
  border-radius: 14px;
  background: #fde68a;
  font-weight: 700;
}`,
    js: `
aoClicar('#botao-conferir', (botao) => {
  if (estaNaTela('#alvo')) {
    mudarTexto(botao, 'Sim, aparece!')
  } else {
    mudarTexto(botao, 'Não aparece')
  }
})`,
  },
  {
    nome: 'aoEntrarNaTela',
    grupo: 'Tela',
    parametros: 'seletor, callback',
    descricao:
      'Executa uma função quando o elemento passa a aparecer na tela, por exemplo ao rolar a página. Se ele já estiver na tela quando <code>aoEntrarNaTela</code> for chamada, a função roda uma vez logo no começo.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento. Cada elemento encontrado é acompanhado separadamente.'],
      ['callback', 'função', 'Executada a cada vez que o elemento aparece. Recebe o elemento.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que para de observar.',
    html: `
<p class="dica">Role o resultado para baixo</p>
<div class="cartao">Um</div>
<div class="cartao">Dois</div>
<div class="cartao">Três</div>
<div class="cartao">Quatro</div>`,
    css: `
.dica {
  opacity: 0.7;
}

.cartao {
  margin: 0 0 120px;
  padding: 24px;
  border-radius: 14px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
  font-weight: 700;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s, transform 0.5s;
}`,
    js: `
aoEntrarNaTela('.cartao', (cartao) => {
  mudarEstilo(cartao, 'opacity', 1)
  mudarEstilo(cartao, 'transform', 'none')
})`,
  },
  {
    nome: 'aoSairDaTela',
    grupo: 'Tela',
    parametros: 'seletor, callback',
    descricao:
      'Executa uma função quando o elemento deixa de aparecer na tela. Um elemento que já está fora da tela na hora da chamada não dispara a função.',
    tabela: [
      ['seletor', 'texto ou elemento', 'Seletor CSS ou um elemento do DOM.'],
      ['callback', 'função', 'Executada a cada vez que o elemento some da tela. Recebe o elemento.'],
    ],
    avisos: [
      ['dica', 'Junto com <code>aoEntrarNaTela</code>, dá para mostrar algo só enquanto outra coisa está fora da tela, como no exemplo.'],
    ],
    retorno: 'Uma função <code>parar()</code>, que para de observar.',
    html: `
<h2 id="topo-pagina">Topo da página</h2>
<p class="dica">Role o resultado para baixo</p>
<div class="espaco"></div>
<button class="fixo" id="voltar" hidden>Voltar ao topo</button>`,
    css: `
.dica {
  opacity: 0.7;
}

.espaco {
  height: 600px;
}

.fixo {
  position: fixed;
  right: 10px;
  bottom: 10px;
}`,
    js: `
aoSairDaTela('#topo-pagina', () => {
  mostrar('#voltar')
})

aoEntrarNaTela('#topo-pagina', () => {
  esconder('#voltar')
})

aoClicar('#voltar', () => {
  window.scrollTo(0, 0)
})`,
  },
]
