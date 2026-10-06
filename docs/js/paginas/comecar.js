import { iniciarPagina } from '../layout.js'
import { blocoDeCodigo, ativarBlocosDeCodigo } from '../codigo/bloco.js'
import { playground, ativarPlaygrounds } from '../playground/playground.js'
import { linhaDeImport, comImport } from '../config.js'
import { aviso, passos } from '../componentes.js'
import { irParaAncora } from '../menu-lateral.js'

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
  {
    id: 'passo-abrir',
    titulo: 'Abra no navegador com um servidor',
    html: `
      ${aviso('cuidado', 'Abrir o <code>index.html</code> com dois cliques não funciona com <code>import</code>. O endereço começa com <code>file://</code>, e o navegador bloqueia módulos abertos direto do computador, por segurança. A página abre, mas o botão não reage.')}
      <p>A solução é abrir a pasta por um <strong>servidor local</strong>. O jeito mais fácil, no VS Code:</p>
      <ol>
        <li>Instale a extensão <strong>Live Server</strong> (procure por "Live Server" na aba de extensões).</li>
        <li>Clique com o botão direito no <code>index.html</code> e escolha <strong>Open with Live Server</strong>.</li>
        <li>O navegador abre a página num endereço como <code>http://127.0.0.1:5500</code>. Clique no botão.</li>
      </ol>
      <p>
        Se você usa Node.js, outra opção é rodar <code>npx serve</code> dentro da pasta. Não pode usar
        servidor nenhum? Veja <a href="./funcoes.html#sem-import">Usando sem import</a>, que funciona
        com dois cliques.
      </p>
    `,
  },
  {
    id: 'passo-console',
    titulo: 'Abra o console e corrija um erro',
    html: `
      <p>
        O <strong>console</strong> é onde o navegador e a Borg escrevem avisos e erros. Abra com
        <kbd>F12</kbd> (ou <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>J</kbd>; no Mac,
        <kbd>Cmd</kbd> + <kbd>Option</kbd> + <kbd>J</kbd>) e clique na aba <strong>Console</strong>.
      </p>
      <p>Agora, erre de propósito. No <code>main.js</code>, troque <code>'#botao'</code> por <code>'#botão'</code>, com acento, e salve. O console mostra:</p>
      ${blocoDeCodigo('[Borg] aoClicar: nenhum elemento encontrado para "#botão". Confira o seletor no seu HTML.', 'texto')}
      <p>
        A mensagem diz qual função reclamou, o que ela procurou e o que conferir. No HTML, o id é
        <code>botao</code>, sem acento. Desfaça a troca, salve, e o botão volta a funcionar.
      </p>
      ${aviso('dica', 'Sempre que algo não funcionar, abra o console antes de qualquer outra coisa. Quase sempre a resposta está lá.')}
    `,
  },
  {
    id: 'passo-proximos',
    titulo: 'Próximos passos',
    html: `
      <p>Seu botão já reage. Algumas ideias para continuar:</p>
      <ul>
        <li>Troque <code>mostrar</code> por <code>alternarClasse('body', 'escuro')</code> e crie um modo escuro no CSS.</li>
        <li>Conte os cliques com <code>mudarTexto</code>. O exemplo está em <a href="./funcoes.html#aoClicar">aoClicar</a>.</li>
        <li>Resolva os <a href="./desafios.html">desafios fáceis</a> e depois os médios.</li>
        <li>Estude um <a href="./projetos.html">projeto completo</a>, como o jogo com as setas.</li>
      </ul>
    `,
  },
]

/** Sintoma que o aluno vê → o que fazer. */
const problemasComuns = [
  [
    'A página abre, mas nada reage, e o endereço começa com <code>file://</code>.',
    'O arquivo foi aberto com dois cliques. Abra pelo Live Server (passo 5).',
  ],
  [
    '<code>Access to script ... from origin \'null\' has been blocked by CORS policy</code>',
    'É o mesmo caso do <code>file://</code>: abra pelo Live Server.',
  ],
  [
    '<code>Cannot use import statement outside a module</code>',
    'Faltou o <code>type="module"</code> na tag <code>&lt;script&gt;</code> do HTML (passo 2).',
  ],
  [
    '<code>The requested module ... does not provide an export named \'aoClicr\'</code>',
    'O nome da função no <code>import</code> está escrito errado. Confira na página <a href="./funcoes.html">Funções</a>.',
  ],
  [
    '<code>aoClicar is not defined</code>',
    'A função foi usada, mas não foi importada. Acrescente o nome entre as chaves do <code>import</code>.',
  ],
  [
    '<code>[Borg] ...: nenhum elemento encontrado para "botao"</code>',
    'O seletor está errado. Um id começa com <code>#</code> (<code>\'#botao\'</code>), uma classe com <code>.</code> (<code>\'.botao\'</code>), e o nome precisa ser igual ao do HTML.',
  ],
  [
    'O console fica vazio e nada acontece.',
    'O <code>main.js</code> não está sendo carregado. Confira se o nome do arquivo e o <code>src</code> da tag <code>&lt;script&gt;</code> são iguais e se os dois estão na mesma pasta.',
  ],
  [
    '<code>net::ERR_INTERNET_DISCONNECTED</code> ou <code>Failed to load module script</code>',
    'O navegador não conseguiu baixar a Borg. Confira a internet e o endereço do <code>import</code>.',
  ],
]

const conteudo = iniciarPagina()

conteudo.innerHTML = `
  <div class="pagina guia">
    <header class="pagina-cabecalho">
      <h1>Do zero ao primeiro botão que reage</h1>
      <p>
        Em sete passos, você cria uma página com um botão que responde ao clique. Você vai precisar
        de um editor de código, como o VS Code, e de um navegador, como o Chrome. Travou em algum passo? Veja os
        <a href="#problemas-comuns">problemas comuns</a>.
      </p>
    </header>
    <div class="prosa">
      ${passos(passosIniciais)}
    </div>
    <section class="problemas" id="problemas-comuns">
      <h2>Problemas comuns</h2>
      <p>Procure na coluna da esquerda o que você está vendo, na página ou no console.</p>
      <div class="tabela"><table>
        <thead><tr><th>O que aparece</th><th>O que fazer</th></tr></thead>
        <tbody>
          ${problemasComuns.map(([sintoma, solucao]) => `<tr><td>${sintoma}</td><td>${solucao}</td></tr>`).join('')}
        </tbody>
      </table></div>
    </section>
  </div>
`

ativarBlocosDeCodigo(conteudo)
ativarPlaygrounds(conteudo)
irParaAncora()
