import { iniciarPagina } from '../layout.js'
import { blocoDeCodigo, ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { executarComBorg } from '../codigo/executar.js'
import { comImport, linhaDeImport } from '../config.js'
import { ligarBotaoDeCopiar } from '../util.js'
import { icones } from '../icones.js'
import { revelarAoRolar } from '../revelar.js'

/** Código da coruja do topo. É mostrado na página e é o mesmo que roda nela. */
const CODIGO_DA_CORUJA = comImport(`
// Os olhos seguem o mouse
aoMoverMouse(({ x, y }) => {
  const dx = (x / window.innerWidth - 0.5) * 14
  const dy = (y / window.innerHeight - 0.5) * 14
  mudarEstilo('.pupila', 'translate', dx + 'px ' + dy + 'px')
})

// Um clique em qualquer lugar faz a coruja piscar
aoClicarNaTela(() => {
  alternarClasse('#coruja', 'piscando')
  setTimeout(() => alternarClasse('#coruja', 'piscando'), 160)
})

// Cada tecla aparece no balão, com o nome em português
aoPressionar('qualquer', (tecla) => {
  mudarTexto('#balao', tecla)
  mostrar('#balao')
})
`)

const SEM_A_BORG = `
const botao = document.querySelector('#botao')
const mensagem = document.querySelector('#mensagem')

if (botao === null) {
  console.error('Não achei #botao')
} else {
  botao.addEventListener('click', () => {
    mensagem.hidden = false
  })
}

document.addEventListener('keydown', (evento) => {
  if (evento.key === ' ') {
    evento.preventDefault()
    document.body.classList.toggle('escuro')
  }
})`

const COM_A_BORG = comImport(`
aoClicar('#botao', () => {
  mostrar('#mensagem')
})

aoPressionar('espaço', () => {
  alternarClasse('body', 'escuro')
})`)

/** A coruja da logo, maior e com partes separadas para reagir. */
const CORUJA = `
  <svg class="coruja" id="coruja" viewBox="0 0 128 128" role="img"
    aria-label="Coruja da Borg JS. Os olhos seguem o mouse, ela pisca quando você clica e mostra as teclas que você aperta.">
    <defs>
      <linearGradient id="coruja-gradiente" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2DD4BF" />
        <stop offset="1" stop-color="#38BDF8" />
      </linearGradient>
    </defs>
    <path fill="url(#coruja-gradiente)" d="M22 22 L46 40 Q64 34 82 40 L106 22 L104 70 Q102 114 64 116 Q26 114 24 70 Z" />
    <g class="olho">
      <circle cx="46" cy="68" r="17" fill="#FFFFFF" />
      <circle class="pupila" cx="46" cy="68" r="8" fill="#0B2530" />
    </g>
    <g class="olho">
      <circle cx="82" cy="68" r="17" fill="#FFFFFF" />
      <circle class="pupila" cx="82" cy="68" r="8" fill="#0B2530" />
    </g>
    <path fill="#0B2530" d="M57 88 H71 L64 99 Z" />
  </svg>
`

const conteudo = iniciarPagina()

conteudo.innerHTML = `
  <section class="heroi">
    <div class="heroi-texto">
      <h1>Faça sua página reagir a cliques, ao mouse e ao teclado.</h1>
      <p class="heroi-sub">
        A Borg JS é uma biblioteca com funções em português, feita para quem está aprendendo.
        Você escreve o que acontece; ela cuida do DOM.
      </p>
      <div class="heroi-acoes">
        <a class="botao botao-principal" href="./comecar.html">Começar agora</a>
        <a class="botao botao-secundario" href="./professores.html">Sou professor</a>
      </div>
      <div class="heroi-import">
        <code>${linhaDeImport(['aoClicar', 'mostrar'])}</code>
        <button type="button" class="botao-icone" id="copiar-import" aria-label="Copiar o import">${icones.copiar}</button>
      </div>
    </div>
    <div class="heroi-palco">
      <p class="balao" id="balao" hidden aria-live="polite"></p>
      ${CORUJA}
      <p class="heroi-convite">Mova o mouse, clique em qualquer lugar ou aperte uma tecla.</p>
    </div>
  </section>

  <section class="faixa faixa-codigo" data-revelar>
    <div class="pagina faixa-dentro">
      <div class="faixa-texto">
        <h2>A coruja aí em cima tem ${CODIGO_DA_CORUJA.split('\n').length} linhas de código.</h2>
        <p>Cada reação é uma função com nome em português. O código ao lado é o mesmo que está rodando nesta página.</p>
        <dl class="reacoes">
          <div><dt><code>aoMoverMouse</code></dt><dd>entrega a posição <code>{ x, y }</code> do mouse, e os olhos acompanham.</dd></div>
          <div><dt><code>aoClicarNaTela</code></dt><dd>reage a um clique em qualquer lugar: a coruja pisca.</dd></div>
          <div><dt><code>aoPressionar</code></dt><dd>recebe o nome da tecla em português, como <code>'espaço'</code> ou <code>'seta cima'</code>.</dd></div>
        </dl>
      </div>
      ${blocoDeCodigo(CODIGO_DA_CORUJA, 'js')}
    </div>
  </section>

  <section class="pagina comparacao" data-revelar>
    <h2>O mesmo resultado, com menos coisa no caminho.</h2>
    <p class="comparacao-sub">
      Mostrar uma mensagem no clique e trocar o tema com a barra de espaço. À esquerda, em JavaScript puro;
      à direita, com a Borg.
    </p>
    <div class="comparacao-lados">
      <figure>
        <figcaption>JavaScript puro</figcaption>
        ${blocoDeCodigo(SEM_A_BORG, 'js')}
      </figure>
      <figure>
        <figcaption>Com a Borg</figcaption>
        ${blocoDeCodigo(COM_A_BORG, 'js')}
      </figure>
    </div>
    <ul class="motivos">
      <li><h3>Nomes que se leem</h3><p><code>aoClicar</code>, <code>mostrar</code>, <code>mudarTexto</code>: o código diz o que faz, em português.</p></li>
      <li><h3>Erros que ensinam</h3><p>Errou o seletor? A Borg avisa no console o que aconteceu e como corrigir, sem quebrar a página.</p></li>
      <li><h3>Pouco código</h3><p>Uma reação cabe em três linhas. Sobra tempo para pensar na lógica.</p></li>
      <li><h3>Foco no HTML e no CSS</h3><p>O aluno desenha a página e decide como ela reage, sem se perder no DOM.</p></li>
    </ul>
  </section>

  <section class="pagina caminhos" data-revelar>
    <h2>Por onde começar</h2>
    <div class="caminhos-grupos">
      <div class="caminho">
        <h3>Estou aprendendo</h3>
        <ul>
          <li><a href="./comecar.html"><strong>Começar</strong><span>Do zero ao primeiro botão que reage, passo a passo.</span></a></li>
          <li><a href="./funcoes.html"><strong>Funções</strong><span>Todas as funções, com exemplos que você pode editar.</span></a></li>
          <li><a href="./desafios.html"><strong>Desafios</strong><span>Exercícios do fácil ao difícil, com solução.</span></a></li>
          <li><a href="./projetos.html"><strong>Projetos</strong><span>Jogo, quiz e galeria prontos para estudar e copiar.</span></a></li>
        </ul>
      </div>
      <div class="caminho caminho-professor">
        <h3>Vou ensinar</h3>
        <p>Uma sequência de sete aulas com objetivos, os erros mais comuns dos alunos e como passar da Borg para o JavaScript puro.</p>
        <a class="botao botao-principal" href="./professores.html">Abrir o guia do professor</a>
      </div>
    </div>
  </section>
`

ligarBotaoDeCopiar(document.getElementById('copiar-import'), () => linhaDeImport(['aoClicar', 'mostrar']))
ativarBlocosDeCodigo(conteudo)
revelarAoRolar(conteudo)
executarComBorg(CODIGO_DA_CORUJA)
