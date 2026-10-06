# 003 - Movimento e IntelliSense · Borg JS

## Objetivo

1. Adicionar à Borg JS funções de **movimentação**: colocar e deslocar elementos na tela (viewport), ler posições e tamanhos, saber quando um elemento entra ou sai da tela e detectar colisões. O foco são animações simples e mini jogos.
2. Criar um **autocomplete** que já escreve a chamada inteira de cada função, com parênteses, chaves, um seletor genérico e a arrow function, por exemplo:

   ```js
   aoClicar('#meu-seletor', (elemento) => {
     // reação
   })
   ```

   Ele funciona no **VS Code**, por meio de uma extensão chamada **Borg JS**, e nos **editores do playground** do site.

## Decisões da spec

| Tema | Decisão |
| --- | --- |
| Unidade | Só **pixels**. Posições e deslocamentos são vetores `{ x, y }`, no mesmo formato que `aoMoverMouse` e `aoClicarNaTela` já entregam. Assim, `aoMoverMouse((posicao) => moverPara('#a', posicao))` funciona direto. Porcentagens e posições nomeadas (`'centro'`) ficam fora. |
| Referência | `x` e `y` são medidos a partir do **canto superior esquerdo da janela** (viewport), como em `aoMoverMouse`. O ponto do elemento que vai para `{ x, y }` é o seu **canto superior esquerdo**. |
| Como o elemento é posicionado | `moverPara` e `moverPor` usam `position: fixed` com `left` e `top`. É simples, aparece claramente no DevTools e combina com "posição na tela". Consequência documentada: o elemento sai do fluxo da página. |
| Animação | As funções de movimento são **instantâneas** e não têm opção de duração. Para o movimento deslizar, o aluno usa a função que já existe: `mudarEstilo('#nave', 'transition', 'left 0.3s, top 0.3s')`. A documentação mostra esse padrão. |
| Pegar o elemento | `elemento(seletor)` é um `document.querySelector` simplificado: devolve o **elemento do DOM** de verdade (o primeiro que o seletor encontrar), sem embrulho. Como toda função da Borg já aceita um elemento no lugar do seletor, `const nave = elemento('#nave')` pode ser usado em qualquer uma delas. Nos exemplos, a variável recebe um nome próprio (`nave`, `botao`), nunca `elemento`, para não esconder a função. |
| Posição atual | `posicao(seletorOuElemento)` devolve a posição atual `{ x, y }` e aceita `posicao(nave)` ou `posicao('#nave')`. Ela permite o incremento reativo a partir da posição real: `moverPara(nave, { x: posicao(nave).x + 1 })`. Para quem quer só deslocar, `moverPor(nave, { x: 1 })` é o atalho. O tamanho fica em uma função à parte, `tamanho(seletor)`, para que `posicao` devolva só um vetor. |
| Eixo omitido | Um vetor pode trazer só um eixo. Em `moverPara('#a', { x: 100 })`, o `y` atual é mantido. Em `moverPor('#a', { x: 10 })`, o `y` não muda. |
| Funções que leem | `elemento`, `posicao`, `tamanho`, `estaNaTela` e `colidiu` usam o **primeiro** elemento do seletor. Quando o seletor não encontra nada, mostram o aviso `[Borg]` de sempre e retornam `null` (`elemento`, `posicao`, `tamanho`) ou `false`. |
| `manterNaTela` | Ajusta uma vez, na hora da chamada. Não fica vigiando. O uso esperado é dentro do laço do jogo, logo depois de `moverPor`. Retorna `true` quando precisou ajustar, o que permite reagir a "bateu na borda". |
| Fonte das sugestões | Um único arquivo de dados descreve o autocomplete de cada função pública (nome, modelo do código, descrição). A extensão do VS Code e o playground são gerados a partir dele. Um teste falha se uma função pública não tiver sugestão. |
| Formato do modelo | Sintaxe de snippet do VS Code (`${1:#meu-seletor}`, `$0`). Uma função testada converte esse formato para o do CodeMirror. |
| `import` automático | Ao aceitar uma sugestão, o `import` da Borg é criado no topo do arquivo, ou recebe o nome da função se já existir. Usa a URL oficial de `docs/js/config.js`. |
| Publicação da extensão | A extensão é publicada pela CLI em dois lugares: no **Marketplace do VS Code**, com `@vscode/vsce`, e no **Open VSX**, com `ovsx`, que atende Cursor, VSCodium e outros editores baseados no VS Code. Os dois publicam o mesmo `.vsix`. Criar o publisher, o namespace e os tokens é um passo manual do dono do projeto, e os tokens nunca entram no repositório: são lidos das variáveis de ambiente `VSCE_PAT` e `OVSX_PAT`. |
| Testes | A biblioteca segue com TDD em `tests/movimento/`. A lógica da extensão e do autocomplete que não depende do editor (montar a sugestão, converter o modelo, editar o `import`) é testada antes da implementação. Em jsdom, `IntersectionObserver` e `getBoundingClientRect` são simulados nos testes. |
| Porta | O site continua em `localhost:4200`. Não há backend (a porta 3000 não se aplica). |

## Público

- **Alunos iniciantes**: querem fazer algo se mexer na tela e esquecem parênteses, chaves e a sintaxe da arrow function.
- **Professores**: querem uma aula de movimento e mini jogo, e menos tempo gasto corrigindo sintaxe.

## Requisitos

### 1. Funções de movimentação

Todas seguem as regras gerais da API (spec 001): o seletor aceita texto, elemento, `NodeList` ou array, as mensagens são em português começando com `[Borg] <nomeDaFuncao>:`, e um tipo inválido lança `TypeError` explicando como corrigir.

O tipo usado em todas elas:

```js
/** @typedef {{ x: number, y: number }} Posicao */
```

#### Pegar o elemento

| Função | Retorno |
| --- | --- |
| `elemento(seletor)` | O primeiro elemento do DOM que o seletor encontrar, ou `null` com aviso `[Borg]`. Se receber um elemento, devolve o próprio elemento. |

```js
const nave = elemento('#nave')

moverPara(nave, { x: 100, y: 100 })
mudarEstilo(nave, 'background-color', 'gold')
```

#### Posicionar

| Função | Efeito |
| --- | --- |
| `moverPara(seletor, { x, y })` | Coloca o canto superior esquerdo do elemento no ponto `{ x, y }` da tela. Vale para todos os elementos do seletor. |
| `moverPor(seletor, { x, y })` | Desloca cada elemento `x` pixels para a direita e `y` para baixo, a partir da posição atual dele na tela. Números negativos vão para a esquerda e para cima. |

- `posicao` sempre lê a posição real do elemento na tela (`getBoundingClientRect`), então o valor está certo mesmo depois de rolagem, CSS ou outra função ter movido o elemento.
- O vetor precisa ser um objeto com pelo menos `x` ou `y`, e os dois precisam ser números finitos. Caso contrário, lança erro com exemplo: `moverPara('#nave', { x: 100, y: 50 })`.
- Não retornam nada.

#### Ler posição e tela

| Função | Retorno |
| --- | --- |
| `posicao(seletor)` | Posição atual `{ x, y }` do canto superior esquerdo do elemento na tela, ou `null` se o seletor não encontrar nada. Aceita `posicao(nave)` ou `posicao('#nave')`. |
| `tamanho(seletor)` | `{ largura, altura }` do elemento, ou `null` se o seletor não encontrar nada. |
| `tamanhoDaTela()` | `{ largura, altura }` da janela visível (viewport). |

#### Entrar e sair da tela

| Função | Efeito |
| --- | --- |
| `aoEntrarNaTela(seletor, callback)` | Executa `callback(elemento)` quando o elemento passa a aparecer na tela, por exemplo ao rolar a página. |
| `aoSairDaTela(seletor, callback)` | Executa `callback(elemento)` quando o elemento deixa de aparecer na tela. |
| `estaNaTela(seletor)` | `true` se o elemento está pelo menos em parte visível na tela agora. |

- `aoEntrarNaTela` e `aoSairDaTela` usam `IntersectionObserver` e retornam `parar()`, como toda função `ao*`.
- Um elemento que já está na tela quando `aoEntrarNaTela` é chamado dispara o callback uma vez. `aoSairDaTela` não dispara na chamada para um elemento que já está fora da tela.

#### Limites e colisão

| Função | Efeito |
| --- | --- |
| `manterNaTela(seletor)` | Se o elemento passou de alguma borda da janela, ele é trazido de volta para dentro. Retorna `true` se precisou ajustar. |
| `colidiu(seletorA, seletorB)` | `true` se os retângulos dos dois elementos se sobrepõem. |

#### Exemplo de uso esperado

```js
import {
  aoMoverMouse, colidiu, elemento, manterNaTela, moverPara, moverPor,
  mudarEstilo, mudarTexto, posicao, teclaPressionada,
} from 'https://borg.lenoborges.br/borg.mjs'

const nave = elemento('#nave')

mudarEstilo(nave, 'transition', 'left 0.1s, top 0.1s')
moverPara(nave, { x: 100, y: 100 })

function jogar() {
  // incremento a partir da posição atual
  if (teclaPressionada('seta direita')) moverPara(nave, { x: posicao(nave).x + 5 })
  // o mesmo, com o atalho
  if (teclaPressionada('seta esquerda')) moverPor(nave, { x: -5 })
  manterNaTela(nave)

  if (colidiu(nave, '#estrela')) {
    mudarTexto('#placar', 'Pegou!')
  }
  requestAnimationFrame(jogar)
}
jogar()

aoMoverMouse((posicao) => moverPara('#mira', posicao))
```

### 2. Autocomplete com o código pronto

#### Sugestões

Para cada função pública, a sugestão escreve a chamada completa, com os parâmetros como campos editáveis. A tecla Tab pula de um campo para o próximo e termina dentro do corpo da arrow function.

| Função | Código inserido |
| --- | --- |
| `aoClicar` | `aoClicar('#meu-seletor', (elemento) => {` ⏎ `  // reação` ⏎ `})` |
| `aoClicarNaTela` | `aoClicarNaTela(({ x, y }) => {` ⏎ `  // reação` ⏎ `})` |
| `aoMoverMouse` | `aoMoverMouse(({ x, y }) => {` ⏎ `  // reação` ⏎ `})` |
| `aoPressionar` | `aoPressionar('espaço', (tecla) => {` ⏎ `  // reação` ⏎ `})` |
| `aoEntrarNaTela` | `aoEntrarNaTela('#meu-seletor', (elemento) => {` ⏎ `  // reação` ⏎ `})` |
| `elemento` | `const meuElemento = elemento('#meu-seletor')`, com o nome da variável editável |
| `posicao` | `posicao('#meu-seletor')` |
| `moverPara` | `moverPara('#meu-seletor', { x: 0, y: 0 })` |
| `mudarEstilo` | `mudarEstilo('#meu-seletor', 'propriedade', 'valor')` |
| `teclaPressionada` | `teclaPressionada('seta direita')` |

As demais funções seguem o mesmo padrão: seletor genérico `'#meu-seletor'`, valores de exemplo nos outros parâmetros e, nas funções `ao*`, a arrow function com `// reação` no corpo.

- Cada sugestão mostra a assinatura e uma descrição curta em português.
- Ao aceitar uma sugestão, o `import` da Borg é criado ou completado no topo do arquivo.
- Dentro de um texto entre aspas que é o primeiro argumento de uma função da Borg, os nomes de tecla válidos (`'espaço'`, `'seta cima'` etc.) aparecem como sugestão para `aoPressionar`, `aoSoltar` e `teclaPressionada`.

#### Extensão do VS Code "Borg JS"

- Fica em `extensao-vscode/`, com o nome de exibição **Borg JS** e a logo da coruja como ícone.
- Funciona em arquivos `.js` e `.mjs` e dentro de `<script>` em arquivos `.html`.
- Não depende de rede: as sugestões vão dentro da extensão.
- `npm run build:extensao` gera o `.vsix`, que também pode ser instalado à mão com "Install from VSIX".
- `npm run publicar:extensao` gera o `.vsix` uma vez e publica esse mesmo arquivo nos dois registros:
  - no Marketplace do VS Code, com `vsce publish --packagePath`;
  - no Open VSX, com `ovsx publish`.

  Se um token estiver faltando, o script para antes de publicar e explica qual variável definir.
- O `package.json` da extensão tem os campos que os dois registros exigem: `publisher`, `repository`, `license`, `icon` (PNG de pelo menos 128×128) e `engines.vscode`.
- A versão da extensão é independente da versão da biblioteca e segue SemVer. Cada publicação tem uma entrada no `CHANGELOG.md`.
- Tem um `README.md` em português, com um GIF do autocomplete funcionando.

#### Playground do site

- Os editores JS do playground (`docs/js/codigo/editor.js`) ganham as mesmas sugestões, com os campos editáveis do CodeMirror.
- Como os exemplos do site mostram o `import` gerado pela página, o `import` automático também é aplicado no playground.

### 3. Documentação

- Página **Funções**: uma seção para cada nova função, com playground. A seção de `elemento` mostra que o resultado pode ser passado para qualquer função da Borg. Há também uma seção "Movimento suave" mostrando a animação com `mudarEstilo` e `transition`.
- Página **Começar**: um passo opcional "Instale a extensão Borg JS no VS Code", com o que ela faz e como instalar.
- Página **Professores**: uma aula nova, "Movimento na tela" (`elemento`, `posicao`, `moverPara`, `moverPor`, `manterNaTela`), e a aula de mini jogo passa a usar `colidiu`. A tabela "Da Borg ao JavaScript puro" ganha os equivalentes (`elemento` ↔ `document.querySelector`, `position: fixed`, `getBoundingClientRect`, `IntersectionObserver`, `innerWidth`).
- Página **Desafios**: pelo menos 1 desafio novo por nível usando as funções de movimento, por exemplo: mira que segue o mouse (fácil), quadrado que não sai da tela (médio), pegar estrelas com colisão (difícil).
- Página **Projetos**: o jogo com as setas passa a usar `moverPor`, `manterNaTela` e `colidiu`.
- `README.md`, `CLAUDE.md` (pastas `src/movimento/` e `extensao-vscode/`, fonte única das sugestões) e `tests/index.test.js` (lista de funções públicas) atualizados.

## Fora do escopo

- Porcentagens, posições nomeadas (`'centro'`) e outras unidades além de pixels.
- Animação embutida nas funções (opção de duração, easing, timers).
- Física (velocidade, gravidade, quique automático).
- Arrastar elementos com o mouse e eventos de toque.
- Tipos TypeScript (`.d.ts`) e suporte a editores que não são baseados no VS Code (por exemplo, JetBrains e Sublime).
- Publicação automática por GitHub Actions a cada tag. A spec usa só a publicação pela CLI.
- Publicação no npm ou em CDN externa.
- Backend.
