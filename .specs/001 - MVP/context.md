# 001 - MVP · Borg JS

## Objetivo

Criar a **Borg JS**, uma biblioteca JavaScript com funções **em português** e documentadas.

O foco é **100% educacional**: a biblioteca esconde a lógica pesada de controle do DOM para que o aluno se concentre apenas em:
- a lógica simples de reação dos elementos (o que acontece quando algo é clicado ou pressionado);
- a criação do design com HTML e CSS.

Deve ser possível criar, de forma simples e rápida, elementos que reagem a:
- clique em elementos (botões e outros);
- clique e movimento do mouse na tela;
- teclado.

## Decisões da revisão

| Tema | Decisão |
| --- | --- |
| Distribuição | Dois builds gerados do mesmo código: um **script tag** (`dist/borg.js`) que expõe o global `Borg`, e um **ESM** (`dist/borg.mjs`) para uso com `import`. |
| Stack | **JavaScript puro + JSDoc** (em português), **Vite** (build da lib e servidor do site), **Vitest + jsdom** (testes). |
| TDD | O projeto não tem backend, mas a regra de TDD se aplica à biblioteca: os testes de cada função são escritos antes da implementação. |
| Documentação | Site de docs com exemplos interativos, servido em `localhost:4200`. Ele também é usado nos testes manuais no Chrome. |
| Porta 3000 | Não se aplica: a spec não tem backend. |
| Erros | Mensagens de erro e aviso em português, pensadas para iniciantes. |

## Requisitos funcionais

### Regras gerais da API

- Todas as funções ficam disponíveis no objeto `Borg` (script tag) e também como exports nomeados (ESM).
- Onde a função recebe `seletor`, ele pode ser um **seletor CSS** (string) ou um **elemento do DOM**. Se o seletor encontrar vários elementos, a função vale para todos eles.
- As funções que registram eventos (`ao...`) **retornam uma função `parar()`**, que remove o evento.
- Quando o seletor não encontra nenhum elemento, a biblioteca mostra um aviso no console em português, por exemplo: `[Borg] Nenhum elemento encontrado para "#botao". Confira o seletor no seu HTML.`. Ela não lança exceção.
- Quando um argumento tem tipo inválido (por exemplo, `callback` que não é função), a biblioteca lança um erro com mensagem explicativa em português.

### Clique em elemento

- `aoClicar(seletor, callback)`: executa `callback(elemento)` quando o elemento é clicado.

### Mouse na tela

- `aoClicarNaTela(callback)`: executa `callback({ x, y })` quando ocorre um clique em qualquer lugar da página.
- `aoMoverMouse(callback)`: executa `callback({ x, y })` quando o mouse se move. `x` e `y` são coordenadas relativas à janela.

### Teclado

- `aoPressionar(tecla, callback)`: executa `callback(tecla)` quando a tecla é pressionada.
- `aoSoltar(tecla, callback)`: executa `callback(tecla)` quando a tecla é solta.
- `teclaPressionada(tecla)`: retorna `true` enquanto a tecla está pressionada. É útil para jogos simples.
- As teclas são escritas em português e sem diferença entre maiúsculas e minúsculas:
  - letras e números: `'a'`, `'7'`;
  - `'espaço'`, `'enter'`, `'esc'`;
  - `'seta cima'`, `'seta baixo'`, `'seta esquerda'`, `'seta direita'`.
- A tecla especial `'qualquer'` reage a qualquer tecla.

### Helpers de reação

| Função | Efeito |
| --- | --- |
| `mostrar(seletor)` | Torna o elemento visível. |
| `esconder(seletor)` | Esconde o elemento. |
| `alternarClasse(seletor, classe)` | Adiciona a classe se ela não existir, e remove se existir. |
| `mudarTexto(seletor, texto)` | Troca o texto do elemento. |
| `mudarEstilo(seletor, propriedade, valor)` | Altera um estilo CSS. Aceita nomes no formato do CSS (`'background-color'`) ou do JS (`'backgroundColor'`). |

### Exemplo de uso esperado

```html
<button id="botao">Clique</button>
<p id="mensagem" hidden>Olá!</p>

<script src="borg.js"></script>
<script>
  Borg.aoClicar('#botao', () => {
    Borg.mostrar('#mensagem')
  })

  Borg.aoPressionar('espaço', () => {
    Borg.alternarClasse('body', 'escuro')
  })
</script>
```

## Site de documentação

- É servido em `localhost:4200`.
- Mostra a logo, uma introdução e como instalar (script tag e ESM).
- Tem uma seção por função, com descrição, parâmetros, retorno e um **exemplo interativo** funcionando na própria página.

## Identidade visual

- Nome: **Borg JS**.
- Logo: face de coruja minimalista em **SVG**, com gradiente do **verde água** (sugestão: `#2DD4BF`) ao **azul céu** (sugestão: `#38BDF8`).
- A mesma logo é usada no site de docs e como favicon.

## Fora do escopo do MVP

- Criação de elementos via JS, animações e timers.
- Eventos de toque (mobile).
- Publicação no npm ou em CDN.
- Backend.
