# Borg JS para VS Code

Autocomplete da [Borg JS](https://borg.lenoborges.br), a biblioteca educacional com funções em português para reagir a cliques, mouse e teclado e mover elementos na tela.

Comece a digitar o nome de uma função e aperte **Enter**: a extensão escreve a chamada inteira, com parênteses, chaves, um seletor de exemplo e a arrow function.

```js
aoClicar('#meu-seletor', (elemento) => {
  // reação
})
```

## O que ela faz

- **Chamada completa**: cada função vem com os parâmetros de exemplo. A tecla **Tab** pula de um campo para o próximo e termina dentro da função de reação.
- **`import` automático**: ao aceitar uma sugestão, a linha `import { ... } from 'https://borg.lenoborges.br/borg.mjs'` é criada no topo do arquivo, ou ganha o nome da função se já existir.
- **Nomes de tecla**: dentro das aspas de `aoPressionar`, `aoSoltar` e `teclaPressionada`, aparecem `'espaço'`, `'enter'`, `'seta cima'` e as outras teclas com nome.
- **Sem import também**: em um `<script>` comum no HTML (sem `type="module"`), a chamada já vem como `Borg.aoClicar(...)`, para usar com a script tag.
- **`elemento`**: no começo da linha, a sugestão já cria a variável: `const meuElemento = elemento('#meu-seletor')`.

Funciona em arquivos `.js` e `.mjs` e dentro de `<script>` em arquivos `.html`. Não precisa de internet: as sugestões vão dentro da extensão.

## Instalar

- **VS Code**: procure **Borg JS** na aba de extensões (Marketplace).
- **Cursor, VSCodium e outros editores baseados no VS Code**: procure **Borg JS** na aba de extensões (Open VSX).
- **Arquivo `.vsix`**: na aba de extensões, menu `...` → **Install from VSIX...**

## Aprender a Borg

O site [borg.lenoborges.br](https://borg.lenoborges.br) tem o guia passo a passo, todas as funções com exemplos editáveis, desafios e projetos.
