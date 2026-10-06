/** Textos do guia Começar que também entram na documentação para IA. */

/** Página do primeiro projeto: um botão e uma mensagem escondida. */
export const HTML_DO_PROJETO = `
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

export const REACAO = `
aoClicar('#botao', () => {
  mostrar('#mensagem')
})`

/** Sintoma que o aluno vê → o que fazer. */
export const problemasComuns = [
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
