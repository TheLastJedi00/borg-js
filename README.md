<p align="center">
  <img src="assets/logo.svg" alt="Logo da Borg JS" width="120">
</p>

# Borg JS

Biblioteca JavaScript **educacional** com funções **em português** para fazer elementos reagirem a cliques, ao mouse e ao teclado, sem precisar lidar com a parte complicada do DOM.

Com ela, você foca no que importa enquanto aprende: a lógica de reação e o design com HTML e CSS.

```html
<button id="botao">Clique</button>
<p id="mensagem" hidden>Olá!</p>

<script src="borg.js"></script>
<script>
  Borg.aoClicar('#botao', () => {
    Borg.mostrar('#mensagem')
  })
</script>
```

## Instalação

### Com script tag

Copie `dist/borg.js` para o seu projeto e inclua:

```html
<script src="borg.js"></script>
```

Todas as funções ficam disponíveis no objeto `Borg`.

### Com `import` (ESM)

```js
import { aoClicar, mostrar } from './borg.mjs'
```

## Desenvolvimento

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Sobe o site de documentação em http://localhost:4200 |
| `npm test` | Roda os testes (Vitest + jsdom) |
| `npm run build` | Gera `dist/borg.js` e `dist/borg.mjs` |
| `npm run lint` | Verifica o código com ESLint |
