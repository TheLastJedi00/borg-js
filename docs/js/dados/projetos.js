/**
 * Projetos completos da página Projetos.
 *
 * Cada projeto tem o CSS inteiro (inclusive do `body` e dos botões), porque o botão
 * "Copiar projeto inteiro" gera um arquivo que precisa ficar igual fora do site. O `js` é
 * escrito sem o `import`; ele é colocado no topo automaticamente.
 */
export const projetos = [
  {
    id: 'jogo-setas',
    titulo: 'Pegue as estrelas',
    descricao:
      'Um jogo com as setas do teclado: leve o quadrado até a estrela. Cada estrela vale um ponto, e com 10 pontos você vence. Enter recomeça.',
    observar: [
      'O loop com <code>requestAnimationFrame</code> confere as setas cerca de 60 vezes por segundo, com <code>teclaPressionada</code>, e anda com <code>moverPor</code>.',
      '<code>elemento</code> guarda o jogador e a estrela em variáveis, usadas em todas as funções.',
      '<code>manterNaTela</code> não deixa o jogador sair da tela, e <code>colidiu</code> diz se ele encostou na estrela.',
      'A estrela é sorteada com <code>Math.random()</code>, <code>tamanhoDaTela()</code> e <code>tamanho(estrela)</code>, para caber inteira na tela.',
      'A variável <code>jogando</code> pausa o jogo quando você vence.',
    ],
    funcoes: [
      'elemento',
      'moverPara',
      'moverPor',
      'manterNaTela',
      'colidiu',
      'tamanho',
      'tamanhoDaTela',
      'teclaPressionada',
      'aoPressionar',
      'mudarTexto',
      'mostrar',
      'esconder',
    ],
    altura: 360,
    html: `
<p class="placar">Estrelas: <strong id="pontos">0</strong> de 10</p>
<div class="jogador" id="jogador"></div>
<div class="estrela" id="estrela">⭐</div>
<p class="fim" id="fim" hidden>Você pegou todas! Aperte Enter para jogar de novo.</p>
<p class="ajuda">Clique aqui e use as setas do teclado</p>`,
    css: `
body {
  min-height: 100vh;
  margin: 0;
  padding: 16px;
  box-sizing: border-box;
  background: #0b2530;
  color: #e6f6f4;
  font-family: system-ui, sans-serif;
  text-align: center;
}

.placar {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.jogador {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}

.estrela {
  width: 30px;
  height: 30px;
  font-size: 26px;
  line-height: 30px;
}

.fim {
  font-size: 1.2rem;
  font-weight: 700;
}

.ajuda {
  margin: 8px 0 0;
  opacity: 0.7;
}`,
    js: `
const jogador = elemento('#jogador')
const estrela = elemento('#estrela')
const velocidade = 5
let pontos = 0
let jogando = true

function sortearEstrela() {
  const tela = tamanhoDaTela()
  const { largura, altura } = tamanho(estrela)
  // Começa abaixo do placar (40 px) e cabe inteira na tela
  moverPara(estrela, {
    x: Math.random() * (tela.largura - largura),
    y: 40 + Math.random() * (tela.altura - altura - 40),
  })
}

function loop() {
  if (jogando) {
    if (teclaPressionada('seta direita')) moverPor(jogador, { x: velocidade })
    if (teclaPressionada('seta esquerda')) moverPor(jogador, { x: -velocidade })
    if (teclaPressionada('seta baixo')) moverPor(jogador, { y: velocidade })
    if (teclaPressionada('seta cima')) moverPor(jogador, { y: -velocidade })
    manterNaTela(jogador)

    if (colidiu(jogador, estrela)) {
      pontos = pontos + 1
      mudarTexto('#pontos', pontos)

      if (pontos === 10) {
        jogando = false
        esconder(estrela)
        mostrar('#fim')
      } else {
        sortearEstrela()
      }
    }
  }
  requestAnimationFrame(loop)
}

aoPressionar('enter', () => {
  pontos = 0
  mudarTexto('#pontos', pontos)
  esconder('#fim')
  mostrar(estrela)
  sortearEstrela()
  jogando = true
})

moverPara(jogador, { x: 20, y: 60 })
sortearEstrela()
loop()`,
  },
  {
    id: 'quiz',
    titulo: 'Quiz',
    descricao:
      'Perguntas de múltipla escolha sobre a própria Borg. A resposta certa fica verde, a errada fica vermelha, e no fim aparece a nota.',
    observar: [
      'As perguntas ficam em um array de objetos. Para criar outro quiz, basta trocar o array.',
      '<code>aoClicar(\'.opcao\', (botao) =&gt; ...)</code> vale para os três botões, e o <code>callback</code> recebe o botão clicado.',
      '<code>data-indice</code> no HTML diz qual opção foi escolhida (<code>botao.dataset.indice</code>).',
      '<code>mudarEstilo(botao, \'background\', \'\')</code>, com texto vazio, volta o botão para a cor do CSS.',
    ],
    funcoes: ['aoClicar', 'mudarTexto', 'mudarEstilo', 'mostrar', 'esconder'],
    altura: 380,
    html: `
<div class="quiz" id="quiz">
  <p class="progresso" id="progresso"></p>
  <h2 id="pergunta"></h2>
  <div class="opcoes">
    <button class="opcao" data-indice="0"></button>
    <button class="opcao" data-indice="1"></button>
    <button class="opcao" data-indice="2"></button>
  </div>
  <button class="proxima" id="proxima" hidden>Próxima</button>
</div>
<div class="final" id="final" hidden>
  <h2 id="nota"></h2>
  <button id="recomecar">Jogar de novo</button>
</div>`,
    css: `
body {
  margin: 0;
  padding: 20px;
  font-family: system-ui, sans-serif;
  text-align: center;
}

h2 {
  margin: 0 0 16px;
  font-size: 1.3rem;
}

.progresso {
  margin: 0 0 6px;
  opacity: 0.7;
}

.opcoes {
  display: grid;
  gap: 8px;
  max-width: 320px;
  margin: 0 auto;
}

button {
  padding: 10px 18px;
  border: 0;
  border-radius: 999px;
  background: #cffafe;
  color: #0b2530;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.proxima,
#recomecar {
  margin-top: 16px;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
    js: `
const perguntas = [
  { pergunta: 'Qual função reage a um clique?', opcoes: ['aoClicar', 'mostrar', 'mudarTexto'], certa: 0 },
  { pergunta: 'Qual tag liga o main.js à página?', opcoes: ['<link>', '<script>', '<style>'], certa: 1 },
  { pergunta: 'Qual seletor encontra o elemento com id "botao"?', opcoes: ["'botao'", "'.botao'", "'#botao'"], certa: 2 },
  { pergunta: 'Qual função diz se uma tecla está pressionada agora?', opcoes: ['aoPressionar', 'teclaPressionada', 'aoSoltar'], certa: 1 },
]

const botoes = document.querySelectorAll('.opcao')
let atual = 0
let acertos = 0
let respondeu = false

function mostrarPergunta() {
  const { pergunta, opcoes } = perguntas[atual]
  mudarTexto('#progresso', 'Pergunta ' + (atual + 1) + ' de ' + perguntas.length)
  mudarTexto('#pergunta', pergunta)
  botoes.forEach((botao, indice) => {
    mudarTexto(botao, opcoes[indice])
    mudarEstilo(botao, 'background', '')
  })
  esconder('#proxima')
  respondeu = false
}

aoClicar('.opcao', (botao) => {
  if (respondeu) return
  respondeu = true

  const escolhida = Number(botao.dataset.indice)
  const certa = perguntas[atual].certa
  if (escolhida === certa) {
    acertos = acertos + 1
  } else {
    mudarEstilo(botao, 'background', '#fca5a5')
  }
  mudarEstilo(botoes[certa], 'background', '#86efac')
  mostrar('#proxima')
})

aoClicar('#proxima', () => {
  atual = atual + 1
  if (atual < perguntas.length) {
    mostrarPergunta()
  } else {
    esconder('#quiz')
    mudarTexto('#nota', 'Você acertou ' + acertos + ' de ' + perguntas.length + '!')
    mostrar('#final')
  }
})

aoClicar('#recomecar', () => {
  atual = 0
  acertos = 0
  esconder('#final')
  mostrar('#quiz')
  mostrarPergunta()
})

mostrarPergunta()`,
  },
  {
    id: 'galeria',
    titulo: 'Galeria',
    descricao:
      'Uma galeria com miniaturas. Clique em uma miniatura, use os botões ou as setas do teclado para trocar a imagem em destaque.',
    observar: [
      'Uma única função, <code>mostrarFoto</code>, é usada pelo clique, pelos botões e pelas setas.',
      '<code>(indice + fotos.length) % fotos.length</code> faz a galeria dar a volta nas duas pontas.',
      '<code>alternarClasse</code> tira a classe <code>ativa</code> da miniatura antiga e põe na nova.',
      'Para usar fotos de verdade, troque o emoji por uma tag <code>&lt;img&gt;</code> e mude o <code>src</code>.',
    ],
    funcoes: ['aoClicar', 'aoPressionar', 'alternarClasse', 'mudarTexto', 'mudarEstilo'],
    altura: 360,
    html: `
<div class="foto" id="foto">🦉</div>
<p id="legenda">Coruja (1 de 5)</p>
<div class="controles">
  <button id="anterior" aria-label="Anterior">◀</button>
  <div class="miniaturas">
    <button class="miniatura ativa" data-indice="0">🦉</button>
    <button class="miniatura" data-indice="1">🦊</button>
    <button class="miniatura" data-indice="2">🐢</button>
    <button class="miniatura" data-indice="3">🐙</button>
    <button class="miniatura" data-indice="4">🦋</button>
  </div>
  <button id="proxima" aria-label="Próxima">▶</button>
</div>`,
    css: `
body {
  margin: 0;
  padding: 20px;
  font-family: system-ui, sans-serif;
  text-align: center;
}

.foto {
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  margin: 0 auto;
  border-radius: 24px;
  background: #2dd4bf;
  font-size: 88px;
  transition: background 0.3s;
}

.controles {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.miniaturas {
  display: flex;
  gap: 6px;
}

button {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 12px;
  background: #e6f0f1;
  font-size: 22px;
  cursor: pointer;
}

.miniatura.ativa {
  border-color: #0b2530;
}`,
    js: `
const fotos = [
  { nome: 'Coruja', emoji: '🦉', cor: '#2dd4bf' },
  { nome: 'Raposa', emoji: '🦊', cor: '#fb923c' },
  { nome: 'Tartaruga', emoji: '🐢', cor: '#4ade80' },
  { nome: 'Polvo', emoji: '🐙', cor: '#f472b6' },
  { nome: 'Borboleta', emoji: '🦋', cor: '#60a5fa' },
]

const miniaturas = document.querySelectorAll('.miniatura')
let atual = 0

function mostrarFoto(indice) {
  alternarClasse(miniaturas[atual], 'ativa')
  atual = (indice + fotos.length) % fotos.length
  alternarClasse(miniaturas[atual], 'ativa')

  const foto = fotos[atual]
  mudarTexto('#foto', foto.emoji)
  mudarEstilo('#foto', 'background', foto.cor)
  mudarTexto('#legenda', foto.nome + ' (' + (atual + 1) + ' de ' + fotos.length + ')')
}

aoClicar('.miniatura', (miniatura) => {
  mostrarFoto(Number(miniatura.dataset.indice))
})

aoClicar('#anterior', () => mostrarFoto(atual - 1))
aoClicar('#proxima', () => mostrarFoto(atual + 1))
aoPressionar('seta esquerda', () => mostrarFoto(atual - 1))
aoPressionar('seta direita', () => mostrarFoto(atual + 1))`,
  },
]
