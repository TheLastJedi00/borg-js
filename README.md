<p align="center">
  <img src="assets/logo.svg" alt="Logo da Borg JS" width="120">
</p>

# Borg JS

Biblioteca JavaScript **educacional** com funções **em português** para fazer elementos reagirem a cliques, ao mouse e ao teclado, sem precisar lidar com a parte complicada do DOM.

Com ela, você foca no que importa enquanto aprende: a lógica de reação e o design com HTML e CSS.

**Documentação, exemplos editáveis, desafios e guia do professor:** https://borg.lenoborges.br

```html
<button id="botao">Clique</button>
<p id="mensagem" hidden>Olá!</p>

<script type="module">
  import { aoClicar, mostrar } from 'https://borg.lenoborges.br/borg.mjs'

  aoClicar('#botao', () => {
    mostrar('#mensagem')
  })
</script>
```

## Como usar

### Com `import` (recomendado)

Importe as funções que for usar direto do site, sem baixar nada:

```js
import { aoClicar, mostrar } from 'https://borg.lenoborges.br/borg.mjs'
```

O seu código precisa estar em um `<script type="module">`, e a página precisa ser aberta por um servidor local (por exemplo, a extensão Live Server do VS Code). Abrir o arquivo com dois cliques (`file://`) não funciona com módulos. O passo a passo completo está em [Começar](https://borg.lenoborges.br/comecar.html).

### Sem `import`

Inclua o `borg.js` com uma tag `<script>`. Ele cria o objeto global `Borg`, e essa forma funciona até abrindo o arquivo com dois cliques:

```html
<script src="https://borg.lenoborges.br/borg.js"></script>
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

As funções que começam com `ao` devolvem uma função `parar()`, que remove o evento. Detalhes e exemplos em [Funções](https://borg.lenoborges.br/funcoes.html).

## Desenvolvimento

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Sobe o site de documentação em http://localhost:4200 |
| `npm test` | Roda os testes (Vitest + jsdom) |
| `npm run build` | Gera `dist/borg.js` e `dist/borg.mjs` |
| `npm run build:docs` | Gera o site em `docs-dist/`, com `borg.mjs` e `borg.js` na raiz |
| `npm run lint` | Verifica o código com ESLint |
