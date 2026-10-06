import { iniciarPagina } from '../layout.js'
import { blocoDeCodigo, ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { playground, ativarPlaygrounds } from '../playground/playground.js'
import { linhaDeImport, comImport } from '../config.js'
import { aviso, passos } from '../componentes.js'

const HTML_DO_PROJETO = `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Meu projeto</title>
  </head>
  <body>
    <button id="botao">Clique em mim</button>
    <p id="mensagem" hidden>Você clicou! 🎉</p>

    <script type="module" src="main.js"></script>
  </body>
</html>`

const REACAO = `
aoClicar('#botao', () => {
  mostrar('#mensagem')
})`

const passosIniciais = [
  {
    id: 'passo-pasta',
    titulo: 'Crie a pasta do projeto',
    html: `
      <p>
        Crie uma pasta chamada <code>meu-projeto</code>. Dentro dela, crie dois arquivos vazios:
        <code>index.html</code>, que é a página, e <code>main.js</code>, onde fica o código.
      </p>
      <pre class="arvore" aria-label="Pasta meu-projeto com os arquivos index.html e main.js">meu-projeto/
├── index.html
└── main.js</pre>
    `,
  },
  {
    id: 'passo-html',
    titulo: 'Escreva o HTML e ligue o main.js',
    html: `
      <p>Abra o <code>index.html</code> e escreva:</p>
      ${blocoDeCodigo(HTML_DO_PROJETO, 'html')}
      <p>
        A linha <code>&lt;script type="module" src="main.js"&gt;</code> liga o seu código à página.
        Coloque essa tag no fim do <code>&lt;body&gt;</code>, depois dos elementos.
      </p>
      ${aviso('cuidado', 'O <code>type="module"</code> é obrigatório. Ele avisa o navegador que o arquivo usa <code>import</code>. Sem ele, o navegador não entende o <code>import</code> e mostra o erro <code>Cannot use import statement outside a module</code>.')}
    `,
  },
  {
    id: 'passo-import',
    titulo: 'Importe a Borg',
    html: `
      <p>Abra o <code>main.js</code> e escreva na primeira linha:</p>
      ${blocoDeCodigo(linhaDeImport(['aoClicar', 'mostrar']), 'js')}
      <p>
        O <code>import</code> traz para o seu arquivo funções que estão em outro arquivo. Aqui, você
        pega <code>aoClicar</code> e <code>mostrar</code> do arquivo da Borg, que está na internet.
        Os nomes vão entre chaves, separados por vírgula, e são escritos exatamente como na página
        <a href="./funcoes.html">Funções</a>.
      </p>
      ${aviso('dica', 'Importe só as funções que for usar. Precisou de outra depois? Acrescente o nome entre as chaves: <code>import { aoClicar, mostrar, mudarTexto } from ...</code>')}
    `,
  },
  {
    id: 'passo-reacao',
    titulo: 'Faça o botão reagir',
    html: `
      <p>Logo abaixo do <code>import</code>, escreva:</p>
      ${blocoDeCodigo(REACAO, 'js')}
      <p>Lendo em português:</p>
      <ul>
        <li><code>aoClicar('#botao', ...)</code>: quando o elemento com id <code>botao</code> for clicado...</li>
        <li><code>() =&gt; { ... }</code>: ...faça o que está dentro das chaves.</li>
        <li><code>mostrar('#mensagem')</code>: mostre o elemento com id <code>mensagem</code>.</li>
      </ul>
      <p>Antes de abrir o seu projeto, experimente aqui. Mude o texto do botão ou o da mensagem e veja o resultado:</p>
      ${playground({
        id: 'exemplo-primeiro-botao',
        titulo: 'primeiro botão',
        altura: 200,
        html: `
<button id="botao">Clique em mim</button>
<p id="mensagem" hidden>Você clicou! 🎉</p>`,
        js: comImport(REACAO),
      })}
    `,
  },
]

const conteudo = iniciarPagina()

conteudo.innerHTML = `
  <div class="pagina guia">
    <header class="pagina-cabecalho">
      <h1>Do zero ao primeiro botão que reage</h1>
      <p>
        Em sete passos, você cria uma página com um botão que responde ao clique. Você vai precisar
        de um editor de código, como o VS Code, e de um navegador, como o Chrome.
      </p>
    </header>
    <div class="prosa">
      ${passos(passosIniciais)}
    </div>
  </div>
`

ativarBlocosDeCodigo(conteudo)
ativarPlaygrounds(conteudo)
