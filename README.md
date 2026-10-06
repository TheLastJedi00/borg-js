<p align="center">
  <img src="assets/logo.svg" alt="Logo da Borg JS" width="120">
</p>

# Borg JS

Biblioteca JavaScript **educacional** com funções **em português** para fazer elementos reagirem a cliques, ao mouse e ao teclado e se moverem na tela, sem precisar lidar com a parte complicada do DOM.

Com ela, você foca no que importa enquanto aprende: a lógica de reação e o design com HTML e CSS.

**Documentação, exemplos editáveis, desafios e guia do professor:** https://borg.lenoborges.com.br

```html
<button id="botao">Clique</button>
<p id="mensagem" hidden>Olá!</p>

<script type="module">
  import { aoClicar, mostrar } from 'https://borg.lenoborges.com.br/borg.mjs'

  aoClicar('#botao', () => {
    mostrar('#mensagem')
  })
</script>
```

## Como usar

### Com `import` (recomendado)

Importe as funções que for usar direto do site, sem baixar nada:

```js
import { aoClicar, mostrar } from 'https://borg.lenoborges.com.br/borg.mjs'
```

O seu código precisa estar em um `<script type="module">`, e a página precisa ser aberta por um servidor local (por exemplo, a extensão Live Server do VS Code). Abrir o arquivo com dois cliques (`file://`) não funciona com módulos. O passo a passo completo está em [Começar](https://borg.lenoborges.com.br/comecar.html).

### Sem `import`

Inclua o `borg.js` com uma tag `<script>`. Ele cria o objeto global `Borg`, e essa forma funciona até abrindo o arquivo com dois cliques:

```html
<script src="https://borg.lenoborges.com.br/borg.js"></script>
<script>
  Borg.aoClicar('#botao', () => {
    Borg.mostrar('#mensagem')
  })
</script>
```

## Funções

| Função | O que faz |
| --- | --- |
| `aoClicar(seletor, callback)` | Reage ao clique em um elemento. |
| `aoClicarNaTela(callback)` | Reage a um clique em qualquer lugar e entrega `{ x, y }`. |
| `aoMoverMouse(callback)` | Reage ao movimento do mouse e entrega `{ x, y }`. |
| `aoPressionar(tecla, callback)` | Reage quando uma tecla é pressionada. |
| `aoSoltar(tecla, callback)` | Reage quando uma tecla é solta. |
| `teclaPressionada(tecla)` | Diz se a tecla está pressionada agora. Ideal para jogos. |
| `mostrar(seletor)` / `esconder(seletor)` | Mostra ou esconde elementos. |
| `alternarClasse(seletor, classe)` | Liga e desliga uma classe. |
| `mudarTexto(seletor, texto)` | Troca o texto de um elemento. |
| `mudarEstilo(seletor, propriedade, valor)` | Muda um estilo CSS. |
| `elemento(seletor)` | Pega o elemento da página, para usar em qualquer função. |
| `posicao(seletor)` | Lê a posição `{ x, y }` do elemento na tela. |
| `tamanho(seletor)` | Lê o tamanho `{ largura, altura }` do elemento. |
| `tamanhoDaTela()` | Lê o tamanho `{ largura, altura }` da janela. |
| `moverPara(seletor, { x, y })` | Coloca o elemento em um ponto da tela. |
| `moverPor(seletor, { x, y })` | Desloca o elemento a partir de onde ele está. |
| `manterNaTela(seletor)` | Traz o elemento de volta para dentro da janela. Diz se bateu na borda. |
| `colidiu(seletorA, seletorB)` | Diz se dois elementos estão se encostando. |
| `estaNaTela(seletor)` | Diz se o elemento aparece na tela agora. |
| `aoEntrarNaTela(seletor, callback)` | Reage quando o elemento aparece na tela, ao rolar. |
| `aoSairDaTela(seletor, callback)` | Reage quando o elemento some da tela. |

As funções que começam com `ao` devolvem uma função `parar()`, que remove o evento. Detalhes e exemplos em [Funções](https://borg.lenoborges.com.br/funcoes.html).

```js
import { elemento, moverPor, posicao, teclaPressionada } from 'https://borg.lenoborges.com.br/borg.mjs'

const nave = elemento('#nave')

function loop() {
  if (teclaPressionada('seta direita')) moverPor(nave, { x: 5 })
  requestAnimationFrame(loop)
}
loop()

console.log(posicao(nave)) // { x: ..., y: ... }
```

## Autocomplete no VS Code

A extensão **Borg JS** escreve a chamada inteira de cada função, com o seletor, a arrow function e o `import`. Procure "Borg JS" na aba de extensões do VS Code (Marketplace) ou do Cursor e VSCodium (Open VSX). O código dela está em [`extensao-vscode/`](extensao-vscode/).

## Desenvolvimento

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Sobe o site de documentação em http://localhost:4200 |
| `npm test` | Roda os testes (Vitest + jsdom) |
| `npm run build` | Gera `dist/borg.js` e `dist/borg.mjs` |
| `npm run build:docs` | Gera o site em `docs-dist/`, com `borg.mjs` e `borg.js` na raiz |
| `npm run lint` | Verifica o código com ESLint |
| `npm run build:extensao` | Gera o `.vsix` da extensão do VS Code em `dist-extensao/` |
| `npm run publicar:extensao` | Publica a extensão no Marketplace do VS Code e no Open VSX |

## Publicar a extensão

A extensão **Borg JS** (`extensao-vscode/`) é publicada pela linha de comando em dois registros: o **Marketplace do VS Code** e o **Open VSX** (usado pelo Cursor, VSCodium e outros editores baseados no VS Code). Os dois recebem o mesmo `.vsix`.

### Uma vez só

1. **Publisher no Marketplace**: crie em https://marketplace.visualstudio.com/manage/createpublisher. O ID precisa ser igual ao campo `publisher` de `extensao-vscode/package.json`.
2. **Token do Marketplace**: em https://dev.azure.com, crie um Personal Access Token com o escopo **Marketplace → Manage** e a organização **All accessible organizations**.
   - Se a sua conta não permitir esse tipo de token, use o login da Microsoft: instale a [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli), rode `az login` e publique com `npm run publicar:extensao -- --azure-credential`. Assim o `VSCE_PAT` não é necessário.
3. **Conta no Open VSX**: entre em https://open-vsx.org com o GitHub, aceite o acordo de publicação e crie um token em https://open-vsx.org/user-settings/tokens.
4. **Namespace no Open VSX**, com o mesmo nome do publisher:

   ```bash
   npx ovsx create-namespace <publisher> -p <token-do-open-vsx>
   ```

### A cada versão

1. Suba a versão em `extensao-vscode/package.json` (SemVer, independente da biblioteca) e escreva a entrada no `extensao-vscode/CHANGELOG.md`.
2. Defina os tokens só no terminal atual. Eles nunca vão para o repositório:

   ```bash
   # Git Bash
   export VSCE_PAT=...   # token do Azure DevOps
   export OVSX_PAT=...   # token do Open VSX
   ```

   ```powershell
   # PowerShell
   $env:VSCE_PAT = '...'
   $env:OVSX_PAT = '...'
   ```

3. Rode `npm run publicar:extensao`. O script confere os tokens antes de tudo, gera o `.vsix` e publica nos dois registros. Se um deles falhar, rode de novo: a versão que já foi publicada é ignorada.
