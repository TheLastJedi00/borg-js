import { blocoDeCodigo } from './util.js'

/** Seções da parte "Começando" da documentação. */
export const secoesDeInicio = [
  {
    id: 'introducao',
    rotulo: 'Introdução',
    html: `
      <div class="heroi">
        <img src="/logo.svg" alt="Logo da Borg JS: uma coruja" />
        <div>
          <h1>Borg <span>JS</span></h1>
          <p>Faça sua página reagir a cliques, ao mouse e ao teclado, com funções em português.</p>
        </div>
      </div>
      <p>
        A Borg JS é uma biblioteca <strong>educacional</strong>. Ela cuida da parte complicada do DOM
        (procurar elementos, registrar e remover eventos, traduzir teclas) para que você foque no que
        importa enquanto aprende: <strong>a lógica do que acontece</strong> e o design com HTML e CSS.
      </p>
      ${blocoDeCodigo(`
<button id="botao">Clique</button>
<p id="mensagem" hidden>Olá!</p>

<script src="borg.js"></script>
<script>
  Borg.aoClicar('#botao', () => {
    Borg.mostrar('#mensagem')
  })
</script>
      `)}
    `,
  },
  {
    id: 'instalacao',
    rotulo: 'Instalação',
    html: `
      <h2>Instalação</h2>
      <h3>Com script tag (recomendado para começar)</h3>
      <p>
        Copie o arquivo <code>dist/borg.js</code> para a pasta do seu projeto e inclua antes do seu
        código. Todas as funções ficam no objeto <code>Borg</code>.
      </p>
      ${blocoDeCodigo(`
<script src="borg.js"></script>
<script src="meu-codigo.js"></script>
      `)}
      <h3>Com import (ESM)</h3>
      <p>Se você usa módulos, importe só o que precisar do arquivo <code>dist/borg.mjs</code>:</p>
      ${blocoDeCodigo(`
<script type="module">
  import { aoClicar, mostrar } from './borg.mjs'

  aoClicar('#botao', () => mostrar('#mensagem'))
</script>
      `)}
    `,
  },
  {
    id: 'regras',
    rotulo: 'Como funciona',
    html: `
      <h2>Como funciona</h2>
      <h3>Seletores</h3>
      <p>
        Onde uma função pede um <code>seletor</code>, você pode passar um seletor CSS, como
        <code>'#meu-id'</code>, <code>'.minha-classe'</code> ou <code>'button'</code>, ou um elemento
        do DOM. Se o seletor encontrar vários elementos, a função vale para <strong>todos</strong>.
      </p>
      <h3>Parar de reagir</h3>
      <p>
        As funções que começam com <code>ao</code> retornam uma função <code>parar()</code>. Chame
        essa função quando não quiser mais reagir ao evento:
      </p>
      ${blocoDeCodigo(`
const parar = Borg.aoClicar('#botao', () => {
  Borg.mudarTexto('#mensagem', 'Só funciona uma vez!')
  parar()
})
      `)}
      <h3>Mensagens de ajuda</h3>
      <p>
        Errou o seletor? A Borg mostra um aviso no console (F12) explicando o problema, sem quebrar
        a página. Se um parâmetro estiver com o tipo errado, por exemplo um texto onde deveria ser uma
        função, aparece um erro em português dizendo o que corrigir.
      </p>
      ${blocoDeCodigo(`
[Borg] aoClicar: nenhum elemento encontrado para "#botao". Confira o seletor no seu HTML.
      `)}
    `,
  },
]
