/**
 * Desafios da página Desafios.
 *
 * Cada desafio tem:
 * - `id`: usado no endereço (`desafios.html#contador`) e nos links do guia do professor;
 * - `nivel`: `'facil'`, `'medio'` ou `'dificil'`;
 * - `enunciado`: HTML com o que o aluno precisa fazer;
 * - `funcoes`: funções sugeridas. Viram o `import` do código inicial;
 * - `inicial`: `{ html, css?, js }` que o aluno recebe no playground;
 * - `solucao`: `{ js, html?, css? }`. O que faltar é igual ao inicial;
 * - `altura` (opcional): altura do resultado, em pixels, para exemplos maiores.
 *
 * O `js` é escrito sem o `import`; a página coloca no topo.
 */
export const desafios = [
  {
    id: 'contador',
    nivel: 'facil',
    titulo: 'Contador com botão de zerar',
    enunciado: `
      <p>Faça um contador: cada clique em <strong>+1</strong> soma um ao número, e <strong>Zerar</strong> volta para 0.</p>`,
    funcoes: ['aoClicar', 'mudarTexto'],
    inicial: {
      html: `
<p class="numero" id="numero">0</p>
<button id="mais">+1</button>
<button id="zerar">Zerar</button>`,
      css: `
.numero {
  font-size: 3rem;
  font-weight: 700;
}`,
      js: `
let contagem = 0

// 1. Quando clicar em #mais, some 1 à contagem e mostre no #numero

// 2. Quando clicar em #zerar, volte a contagem para 0 e mostre no #numero
`,
    },
    solucao: {
      js: `
let contagem = 0

aoClicar('#mais', () => {
  contagem = contagem + 1
  mudarTexto('#numero', contagem)
})

aoClicar('#zerar', () => {
  contagem = 0
  mudarTexto('#numero', contagem)
})`,
    },
  },
  {
    id: 'pergunta-resposta',
    nivel: 'facil',
    titulo: 'Mostrar a resposta',
    enunciado: `
      <p>Um cartão com uma pergunta. O botão <strong>Ver resposta</strong> mostra a resposta, e <strong>Esconder</strong> esconde de novo.</p>`,
    funcoes: ['aoClicar', 'mostrar', 'esconder'],
    inicial: {
      html: `
<div class="cartao">
  <p>Qual é o maior planeta do Sistema Solar?</p>
  <p class="resposta" id="resposta" hidden>Júpiter 🪐</p>
</div>
<button id="ver">Ver resposta</button>
<button id="esconder">Esconder</button>`,
      css: `
.cartao {
  padding: 20px 28px;
  border: 2px solid #38bdf8;
  border-radius: 16px;
}

.resposta {
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: 700;
}`,
      js: `
// 1. Quando clicar em #ver, mostre a #resposta

// 2. Quando clicar em #esconder, esconda a #resposta
`,
    },
    solucao: {
      js: `
aoClicar('#ver', () => {
  mostrar('#resposta')
})

aoClicar('#esconder', () => {
  esconder('#resposta')
})`,
    },
  },
  {
    id: 'modo-escuro',
    nivel: 'facil',
    titulo: 'Modo escuro com uma tecla',
    enunciado: `
      <p>
        Cada vez que a tecla <kbd>m</kbd> for pressionada, a página alterna entre o tema claro e o escuro.
        O CSS da classe <code>.escuro</code> já está pronto.
      </p>
      <p>Clique no resultado antes de testar o teclado.</p>`,
    funcoes: ['aoPressionar', 'alternarClasse'],
    inicial: {
      html: `
<h1>Minha página</h1>
<p>Aperte <kbd>m</kbd> para trocar o tema.</p>`,
      css: `
body {
  transition: background 0.3s, color 0.3s;
}

body.escuro {
  background: #0b2530;
  color: #e3f1f2;
}`,
      js: `
// Quando a tecla 'm' for pressionada, alterne a classe 'escuro' no body
`,
    },
    solucao: {
      js: `
aoPressionar('m', () => {
  alternarClasse('body', 'escuro')
})`,
    },
  },
  {
    id: 'semaforo',
    nivel: 'medio',
    titulo: 'Semáforo',
    enunciado: `
      <p>
        Cada clique em <strong>Próxima cor</strong> troca a cor da luz, na ordem verde, amarelo e
        vermelho, e depois volta para o verde. O texto embaixo mostra o nome da cor.
      </p>`,
    funcoes: ['aoClicar', 'mudarEstilo', 'mudarTexto'],
    inicial: {
      html: `
<div class="luz" id="luz"></div>
<p id="nome-cor">verde</p>
<button id="proxima">Próxima cor</button>`,
      css: `
.luz {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #22c55e;
  transition: background 0.2s;
}`,
      js: `
const cores = ['#22c55e', '#facc15', '#ef4444']
const nomes = ['verde', 'amarelo', 'vermelho']
let atual = 0

// Quando clicar em #proxima:
// 1. Passe para a próxima cor (depois da última, volte para a primeira)
// 2. Mude o background da #luz para a cor atual
// 3. Mostre o nome da cor em #nome-cor
`,
    },
    solucao: {
      js: `
const cores = ['#22c55e', '#facc15', '#ef4444']
const nomes = ['verde', 'amarelo', 'vermelho']
let atual = 0

aoClicar('#proxima', () => {
  atual = (atual + 1) % cores.length
  mudarEstilo('#luz', 'background', cores[atual])
  mudarTexto('#nome-cor', nomes[atual])
})`,
    },
  },
  {
    id: 'segue-mouse',
    nivel: 'medio',
    titulo: 'Quadrado que segue o mouse',
    enunciado: `
      <p>O quadrado acompanha o mouse pelo resultado, com o mouse sempre no centro dele.</p>
      <p>Dica: o quadrado tem 40px de lado. Para centralizar, tire metade disso de <code>x</code> e de <code>y</code>.</p>`,
    funcoes: ['aoMoverMouse', 'mudarEstilo'],
    inicial: {
      html: `
<p>Mova o mouse por aqui</p>
<div class="quadrado" id="quadrado"></div>`,
      css: `
.quadrado {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
  pointer-events: none;
}`,
      js: `
// Quando o mouse se mover, mude o left e o top do #quadrado
// para que o mouse fique no centro dele
`,
    },
    solucao: {
      js: `
aoMoverMouse(({ x, y }) => {
  mudarEstilo('#quadrado', 'left', x - 20)
  mudarEstilo('#quadrado', 'top', y - 20)
})`,
    },
  },
  {
    id: 'placar-teclas',
    nivel: 'medio',
    titulo: 'Placar com as setas',
    enunciado: `
      <p>
        A <kbd>↑</kbd> soma um ponto e a <kbd>↓</kbd> tira um. Quando o placar ficar negativo, o
        número fica vermelho; com zero ou mais, volta para a cor normal.
      </p>
      <p>Clique no resultado antes de testar o teclado.</p>`,
    funcoes: ['aoPressionar', 'mudarTexto', 'mudarEstilo'],
    inicial: {
      html: `
<p>Placar</p>
<p class="placar" id="placar">0</p>
<p>Use as setas <kbd>↑</kbd> e <kbd>↓</kbd></p>`,
      css: `
.placar {
  font-size: 4rem;
  font-weight: 700;
}`,
      js: `
let pontos = 0

function atualizarPlacar() {
  mudarTexto('#placar', pontos)
  // Se pontos for menor que 0, deixe o #placar vermelho ('#ef4444')
  // Senão, volte a cor para 'inherit'
}

// 1. Com a 'seta cima', some 1 e atualize o placar

// 2. Com a 'seta baixo', tire 1 e atualize o placar
`,
    },
    solucao: {
      js: `
let pontos = 0

function atualizarPlacar() {
  mudarTexto('#placar', pontos)
  if (pontos < 0) {
    mudarEstilo('#placar', 'color', '#ef4444')
  } else {
    mudarEstilo('#placar', 'color', 'inherit')
  }
}

aoPressionar('seta cima', () => {
  pontos = pontos + 1
  atualizarPlacar()
})

aoPressionar('seta baixo', () => {
  pontos = pontos - 1
  atualizarPlacar()
})`,
    },
  },
  {
    id: 'mover-setas',
    nivel: 'dificil',
    titulo: 'Mover um quadrado com as setas',
    altura: 300,
    enunciado: `
      <p>
        Enquanto uma seta estiver pressionada, o quadrado anda naquela direção, sem parar. Ele não
        pode sair da arena.
      </p>
      <p>
        Dica: <code>aoPressionar</code> reage uma vez por toque. Para andar sem parar, confira
        <code>teclaPressionada</code> dentro de um loop com <code>requestAnimationFrame</code>.
        Clique no resultado antes de testar.
      </p>`,
    funcoes: ['teclaPressionada', 'mudarEstilo'],
    inicial: {
      html: `
<div class="arena" id="arena">
  <div class="jogador" id="jogador"></div>
</div>`,
      css: `
.arena {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed #38bdf8;
  border-radius: 12px;
}

.jogador {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
      js: `
let x = 0
let y = 0
const velocidade = 4

function loop() {
  // 1. Some ou tire a velocidade de x e y conforme a seta pressionada
  //    ('seta direita', 'seta esquerda', 'seta baixo', 'seta cima')

  // 2. Não deixe x e y saírem da arena (use Math.max e Math.min)

  // 3. Mude o left e o top do #jogador

  requestAnimationFrame(loop)
}

loop()
`,
    },
    solucao: {
      js: `
let x = 0
let y = 0
const velocidade = 4

function loop() {
  const arena = document.querySelector('#arena')
  const limiteX = arena.clientWidth - 40
  const limiteY = arena.clientHeight - 40

  if (teclaPressionada('seta direita')) x = x + velocidade
  if (teclaPressionada('seta esquerda')) x = x - velocidade
  if (teclaPressionada('seta baixo')) y = y + velocidade
  if (teclaPressionada('seta cima')) y = y - velocidade

  x = Math.max(0, Math.min(x, limiteX))
  y = Math.max(0, Math.min(y, limiteY))

  mudarEstilo('#jogador', 'left', x)
  mudarEstilo('#jogador', 'top', y)
  requestAnimationFrame(loop)
}

loop()`,
    },
  },
  {
    id: 'alvo',
    nivel: 'dificil',
    titulo: 'Clique no alvo',
    altura: 340,
    enunciado: `
      <p>
        Cada clique no alvo vale um ponto e manda o alvo para um lugar aleatório da arena. Com 10
        pontos, o alvo some e aparece a mensagem de vitória.
      </p>
      <p>
        Dica: <code>Math.random()</code> devolve um número entre 0 e 1. Multiplique pela largura da
        arena menos o tamanho do alvo para ter um <code>left</code> que cabe nela.
      </p>`,
    funcoes: ['aoClicar', 'mudarEstilo', 'mudarTexto', 'esconder', 'mostrar'],
    inicial: {
      html: `
<p>Pontos: <strong id="pontos">0</strong></p>
<div class="arena" id="arena">
  <button class="alvo" id="alvo" aria-label="Alvo"></button>
</div>
<p class="vitoria" id="vitoria" hidden>Você venceu! 🎯</p>`,
      css: `
.arena {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed #38bdf8;
  border-radius: 12px;
}

.alvo {
  position: absolute;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: radial-gradient(circle, #ef4444 30%, #fff 32%, #fff 48%, #ef4444 50%);
}

.vitoria {
  font-size: 1.5rem;
  font-weight: 700;
}`,
      js: `
let pontos = 0

function moverAlvo() {
  // Sorteie um left e um top que caibam na #arena e mude o estilo do #alvo
}

// Quando clicar no #alvo:
// 1. Some um ponto e mostre em #pontos
// 2. Com 10 pontos, esconda o #alvo e mostre a #vitoria
// 3. Senão, mova o alvo

moverAlvo()
`,
    },
    solucao: {
      js: `
let pontos = 0

function moverAlvo() {
  const arena = document.querySelector('#arena')
  const x = Math.random() * (arena.clientWidth - 44)
  const y = Math.random() * (arena.clientHeight - 44)
  mudarEstilo('#alvo', 'left', x)
  mudarEstilo('#alvo', 'top', y)
}

aoClicar('#alvo', () => {
  pontos = pontos + 1
  mudarTexto('#pontos', pontos)

  if (pontos === 10) {
    esconder('#alvo')
    mostrar('#vitoria')
  } else {
    moverAlvo()
  }
})

moverAlvo()`,
    },
  },
  {
    id: 'reacao',
    nivel: 'dificil',
    titulo: 'Teste de reflexo',
    enunciado: `
      <p>
        <kbd>Enter</kbd> começa o teste. Depois de um tempo aleatório entre 1 e 3 segundos, a luz
        acende. Aperte <kbd>espaço</kbd> o mais rápido que puder e mostre o tempo em milissegundos.
        Se apertar antes da luz acender, mostre "Cedo demais!".
      </p>
      <p>
        Dica: <code>setTimeout(funcao, tempo)</code> roda uma função depois de um tempo, e
        <code>Date.now()</code> dá o momento atual em milissegundos. Clique no resultado antes de testar.
      </p>`,
    funcoes: ['aoPressionar', 'mudarEstilo', 'mudarTexto'],
    inicial: {
      html: `
<div class="luz" id="luz"></div>
<p id="resultado">Aperte Enter para começar</p>`,
      css: `
.luz {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #94a3b8;
}`,
      js: `
let acesa = false
let inicio = 0
let temporizador

// 1. Com 'enter': apague a luz, mostre "Espere..." e, depois de um
//    tempo aleatório, acenda a luz e guarde o momento em inicio

// 2. Com 'espaço': se a luz estiver acesa, mostre o tempo de reação;
//    senão, cancele o temporizador e mostre "Cedo demais!"
`,
    },
    solucao: {
      js: `
let acesa = false
let inicio = 0
let temporizador

aoPressionar('enter', () => {
  clearTimeout(temporizador)
  acesa = false
  mudarEstilo('#luz', 'background', '#94a3b8')
  mudarTexto('#resultado', 'Espere a luz acender...')

  const espera = 1000 + Math.random() * 2000
  temporizador = setTimeout(() => {
    acesa = true
    inicio = Date.now()
    mudarEstilo('#luz', 'background', '#22c55e')
    mudarTexto('#resultado', 'Agora!')
  }, espera)
})

aoPressionar('espaço', () => {
  if (acesa) {
    acesa = false
    mudarTexto('#resultado', 'Seu tempo: ' + (Date.now() - inicio) + ' ms. Enter para jogar de novo.')
  } else {
    clearTimeout(temporizador)
    mudarTexto('#resultado', 'Cedo demais! Aperte Enter para tentar de novo.')
  }
})`,
    },
  },
  {
    id: 'mira',
    nivel: 'facil',
    titulo: 'Mira que segue o mouse',
    enunciado: `
      <p>
        A mira acompanha o mouse por todo o resultado. Quando clicar, o texto mostra onde foi o tiro,
        por exemplo: <em>Tiro em 120, 45</em>.
      </p>
      <p>Dica: <code>aoMoverMouse</code> entrega a posição no mesmo formato que <code>moverPara</code> recebe.</p>`,
    funcoes: ['aoMoverMouse', 'moverPara', 'aoClicarNaTela', 'mudarTexto'],
    inicial: {
      html: `
<p id="tiro">Clique para atirar</p>
<div class="mira" id="mira"></div>`,
      css: `
.mira {
  width: 30px;
  height: 30px;
  border: 4px solid #ef4444;
  border-radius: 50%;
  pointer-events: none;
}`,
      js: `
// 1. Quando o mouse se mover, leve a #mira até a posição dele

// 2. Quando clicar na tela, mostre no #tiro onde foi o clique
`,
    },
    solucao: {
      js: `
aoMoverMouse((posicao) => {
  moverPara('#mira', posicao)
})

aoClicarNaTela(({ x, y }) => {
  mudarTexto('#tiro', 'Tiro em ' + x + ', ' + y)
})`,
    },
  },
  {
    id: 'quadrado-na-tela',
    nivel: 'medio',
    titulo: 'Quadrado que não sai da tela',
    enunciado: `
      <p>
        Cada toque em uma seta anda 30 px com o quadrado naquela direção. Ele nunca pode sair da tela:
        quando bater na borda, mostre <em>Bateu na borda!</em>; quando não bater, apague o aviso.
      </p>
      <p>
        Dica: crie uma função <code>andar(passo)</code> que recebe o deslocamento, como
        <code>{ x: 30 }</code>, para não repetir o mesmo código nas quatro setas. Clique no resultado
        antes de testar.
      </p>`,
    funcoes: ['moverPara', 'moverPor', 'manterNaTela', 'aoPressionar', 'mudarTexto'],
    inicial: {
      html: `
<p id="aviso"></p>
<div class="quadrado" id="quadrado"></div>`,
      css: `
.quadrado {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
      js: `
moverPara('#quadrado', { x: 100, y: 80 })

function andar(passo) {
  // 1. Mova o #quadrado pelo passo
  // 2. Se manterNaTela precisou ajustar, mostre o aviso; se não, apague
}

// 3. Chame andar com o passo certo em cada seta
`,
    },
    solucao: {
      js: `
moverPara('#quadrado', { x: 100, y: 80 })

function andar(passo) {
  moverPor('#quadrado', passo)

  if (manterNaTela('#quadrado')) {
    mudarTexto('#aviso', 'Bateu na borda!')
  } else {
    mudarTexto('#aviso', '')
  }
}

aoPressionar('seta direita', () => andar({ x: 30 }))
aoPressionar('seta esquerda', () => andar({ x: -30 }))
aoPressionar('seta baixo', () => andar({ y: 30 }))
aoPressionar('seta cima', () => andar({ y: -30 }))`,
    },
  },
  {
    id: 'pegar-estrelas',
    nivel: 'dificil',
    titulo: 'Pegar as estrelas',
    altura: 320,
    enunciado: `
      <p>
        Mova o jogador com as setas, sem parar enquanto a seta estiver pressionada e sem sair da tela.
        Quando ele encostar na estrela, ganhe um ponto, e a estrela aparece em outro lugar sorteado.
      </p>
      <p>
        Dica: use <code>teclaPressionada</code> com <code>moverPor</code> em um loop, e
        <code>colidiu</code> para saber se pegou. Para sortear o lugar, combine <code>Math.random()</code>
        com <code>tamanhoDaTela()</code>. Clique no resultado antes de testar.
      </p>`,
    funcoes: [
      'elemento',
      'moverPara',
      'moverPor',
      'manterNaTela',
      'colidiu',
      'tamanhoDaTela',
      'teclaPressionada',
      'mudarTexto',
    ],
    inicial: {
      html: `
<p id="pontos">Estrelas: 0</p>
<div class="jogador" id="jogador"></div>
<div class="estrela" id="estrela">★</div>`,
      css: `
.jogador {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}

.estrela {
  font-size: 2rem;
  line-height: 1;
  color: #f59e0b;
}`,
      js: `
const jogador = elemento('#jogador')
const estrela = elemento('#estrela')
let pontos = 0

function sortearEstrela() {
  // 1. Leve a estrela para um ponto sorteado dentro da tela
}

moverPara(jogador, { x: 20, y: 60 })
sortearEstrela()

function loop() {
  // 2. Mova o jogador conforme as setas pressionadas e mantenha ele na tela

  // 3. Se o jogador encostou na estrela, some um ponto, mostre e sorteie outro lugar

  requestAnimationFrame(loop)
}

loop()
`,
    },
    solucao: {
      js: `
const jogador = elemento('#jogador')
const estrela = elemento('#estrela')
let pontos = 0

function sortearEstrela() {
  const tela = tamanhoDaTela()
  moverPara(estrela, {
    x: Math.random() * (tela.largura - 40),
    y: 40 + Math.random() * (tela.altura - 80),
  })
}

moverPara(jogador, { x: 20, y: 60 })
sortearEstrela()

function loop() {
  if (teclaPressionada('seta direita')) moverPor(jogador, { x: 4 })
  if (teclaPressionada('seta esquerda')) moverPor(jogador, { x: -4 })
  if (teclaPressionada('seta baixo')) moverPor(jogador, { y: 4 })
  if (teclaPressionada('seta cima')) moverPor(jogador, { y: -4 })
  manterNaTela(jogador)

  if (colidiu(jogador, estrela)) {
    pontos = pontos + 1
    mudarTexto('#pontos', 'Estrelas: ' + pontos)
    sortearEstrela()
  }

  requestAnimationFrame(loop)
}

loop()`,
    },
  },
]

/** Níveis na ordem em que aparecem na página. */
export const niveis = [
  { id: 'facil', rotulo: 'Fácil', descricao: 'Uma ou duas funções, uma reação por vez. Bons para as aulas 1 e 2.' },
  { id: 'medio', rotulo: 'Médio', descricao: 'Juntam funções e pedem um pouco de lógica: arrays, contas, condições.' },
  { id: 'dificil', rotulo: 'Difícil', descricao: 'Mini jogos com loop, posição e pontuação. Para quem já fez os médios.' },
]
