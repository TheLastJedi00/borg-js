# 002 - Nova Documentação · Borg JS

## Objetivo

Transformar o site de documentação da Borg JS em uma página **visualmente impactante**, com instruções mais detalhadas para **professores** e **alunos**.

- O uso principal ensinado passa a ser o **`import`** em um arquivo JavaScript.
- O uso **sem import** (script tag com o objeto global `Borg` e código dentro de `<script>` no HTML) continua funcionando e é apresentado como uma possibilidade natural, em uma seção própria.

A biblioteca (`src/`) não ganha nem perde funções nesta spec.

## Decisões da spec

| Tema | Decisão |
| --- | --- |
| Origem do `import` | O build do site publica `borg.mjs` e `borg.js` na raiz do próprio site (Vercel). O aluno importa direto da URL, sem baixar nada: `import { aoClicar } from 'https://borg.lenoborges.br/borg.mjs'`. Publicar no npm ou em CDN externa continua fora do escopo. |
| Estilo dos exemplos | Todo exemplo usa `import` com exports nomeados e chama as funções direto (`aoClicar(...)`), sem o prefixo `Borg.`. |
| Uso sem import | Uma seção separada, "Usando sem import", explica uma vez a script tag (`<script src=".../borg.js">`) e o objeto global `Borg.`. Os exemplos das funções não repetem essa versão. |
| Exemplos editáveis | Os exemplos das funções, dos desafios e dos projetos viram um **playground**: o aluno edita o HTML e o JS e vê o resultado na hora. |
| Coerência com o resto do projeto | O `README.md` e o `@example` do JSDoc das funções públicas passam a mostrar o estilo com `import`. A convenção correspondente no `CLAUDE.md` é atualizada. |
| Editor e realce | **CodeMirror 6** para o playground e para os blocos de código somente leitura. Uma única dependência cuida da edição e do realce de sintaxe, com o mesmo visual nos dois. |
| `borg.mjs` no site | Um plugin do Vite gera os dois builds a partir de `src/` com a mesma configuração de `vite.config.js`. Ele os serve no `npm run dev` e os emite no `npm run build:docs`. No playground, um `importmap` redireciona a URL pública para a origem atual. |
| Testes do site | A lógica sem layout (documento do playground, HTML do projeto, URLs) é testada em `tests/docs/` antes de ser implementada. |
| Porta | O site continua em `localhost:4200`. Não há backend (a porta 3000 não se aplica). |

## Público

- **Alunos iniciantes**: nunca usaram módulos JS e podem nunca ter aberto o console do navegador.
- **Professores**: querem planejar aulas, propor exercícios e prever as dúvidas mais comuns.

## Requisitos

### 1. Visual impactante

- Página inicial com um **herói** de impacto: logo da coruja grande, animada, com o gradiente verde água (`#2DD4BF`) → azul céu (`#38BDF8`), uma frase curta sobre a Borg e dois botões de chamada: "Começar agora" (guia passo a passo) e "Sou professor" (guia do professor).
- Logo abaixo do herói, uma **demonstração ao vivo** que reage ao mouse, ao clique e ao teclado, feita com a própria Borg, com o código curto ao lado. Ela mostra em segundos o que a biblioteca faz.
- Seção "Por que a Borg?" com os diferenciais: funções em português, mensagens de erro que ensinam, pouco código, foco em HTML/CSS.
- Identidade visual consistente com a logo: gradiente, cantos arredondados, tipografia atual (Nunito + JetBrains Mono) ou equivalente.
- Animações discretas (entrada de seções ao rolar, hover nos cartões) que respeitam `prefers-reduced-motion`.
- Tema claro e escuro, seguindo o sistema e com botão para alternar. A escolha fica salva no navegador.
- Layout responsivo: funciona em celular (sem rolagem horizontal), tablet e desktop.
- Blocos de código com **realce de sintaxe** e botão **"Copiar"**.

### 2. Estrutura do site

O site passa de uma página única para várias páginas, com um menu no topo comum a todas:

| Página | Conteúdo |
| --- | --- |
| Início | Herói, demonstração ao vivo, "Por que a Borg?" e atalhos para as outras páginas. |
| Começar | Guia passo a passo do aluno (requisito 3). |
| Funções | Referência de todas as funções, com playground (requisito 4). Inclui "Como funciona" (seletores, `parar()`, mensagens de ajuda) e "Usando sem import". |
| Professores | Guia do professor (requisito 5). |
| Desafios | Exercícios por nível (requisito 6). |
| Projetos | Projetos completos (requisito 7). |

- Na página Funções, um menu lateral lista as funções e destaca a seção visível. No celular ele vira um menu recolhível.
- Os IDs de exemplos continuam únicos em cada página.

### 3. Guia passo a passo (aluno)

Do zero ao primeiro projeto funcionando, com linguagem simples e um passo por bloco:

1. Criar uma pasta com `index.html` e `main.js`.
2. Ligar o `main.js` no HTML com `<script type="module" src="main.js"></script>` e explicar **por que** o `type="module"` é necessário.
3. Escrever o `import` da Borg a partir da URL do site e explicar o que é um `import`.
4. Criar o primeiro botão que reage a um clique.
5. Abrir no navegador. Explicar que módulos **não funcionam abrindo o arquivo direto** (`file://`) e mostrar como servir a pasta (ex.: extensão Live Server do VS Code).
6. Abrir o console (F12), ler uma mensagem `[Borg]` e corrigir um erro proposital.
7. Próximos passos: links para Funções e Desafios.

Ao final, um quadro "Problemas comuns" com sintoma e solução, por exemplo:
- página em branco por causa de `file://`;
- esqueceu o `type="module"`;
- nome da função importada escrito errado;
- seletor sem `#` ou `.`.

### 4. Referência das funções com playground

Cada função mantém o que já existe (descrição, parâmetros, retorno) e ganha:

- Um **playground** com abas HTML e JS editáveis e o resultado ao lado (embaixo, no celular).
  - O resultado roda isolado em um `iframe`, para que um exemplo não interfira nos outros nem na página.
  - O resultado é atualizado ao digitar, com um pequeno atraso, e também por um botão "Rodar".
  - Botões "Restaurar" (volta ao código original) e "Copiar".
  - Erros do código do aluno e avisos `[Borg]` aparecem em um pequeno console embaixo do resultado, sem precisar abrir o F12.
  - O `import` da URL pública funciona no playground também em `localhost:4200`, apontando para a versão local da biblioteca.
- Uma linha "Dica" ou "Cuidado" quando houver um comportamento importante (ex.: `aoPressionar` não repete ao segurar a tecla).

A seção **"Usando sem import"** mostra:
- o mesmo exemplo inicial escrito com `<script src="https://borg.lenoborges.br/borg.js"></script>` e `Borg.aoClicar(...)` dentro de `<script>` no HTML;
- quando essa forma é útil (testes rápidos, ambientes que só aceitam um arquivo HTML) e que ela funciona abrindo o arquivo direto (`file://`).

### 5. Guia do professor

- **O que é e para quem é** a Borg, e o que ela esconde do aluno (e por quê).
- **Sequência sugerida de aulas**, cada uma com objetivo de aprendizagem, funções usadas e desafio recomendado. Sugestão:
  1. Primeiro clique: `aoClicar`, `mudarTexto`.
  2. Mostrar e esconder: `mostrar`, `esconder`, `alternarClasse`.
  3. Estilo dinâmico: `mudarEstilo`.
  4. O mouse na tela: `aoClicarNaTela`, `aoMoverMouse`.
  5. Teclado: `aoPressionar`, `aoSoltar`.
  6. Mini jogo: `teclaPressionada` e um laço de animação.
- **Erros comuns dos alunos** e como orientá-los, ligados às mensagens `[Borg]`.
- **Da Borg ao JavaScript puro**: para cada função, o equivalente em DOM puro (ex.: `aoClicar` ↔ `addEventListener('click')`), para quando a turma estiver pronta para avançar.
- Como usar os desafios e projetos em aula (enunciado para o aluno, solução para o professor).

### 6. Desafios

- Exercícios agrupados por nível: **Fácil**, **Médio** e **Difícil**.
- Cada desafio tem: título, enunciado, funções sugeridas, um playground com o código inicial e a **solução escondida** (botão "Ver solução", que também pode carregar a solução no playground).
- Pelo menos 3 desafios por nível. Sugestões: contador com botão de zerar, modo escuro com tecla, mostrar senha, quadrado que segue o mouse, mover um quadrado com as setas, jogo de clicar no alvo.

### 7. Projetos completos

- Pelo menos 3 projetos maiores, prontos para copiar. Sugestões: jogo com as setas, quiz, galeria de imagens.
- Cada projeto tem uma descrição, a lista de funções usadas, o playground com o resultado funcionando e um botão para **copiar o projeto inteiro** em um único arquivo HTML.

### 8. Publicação da biblioteca no site

- O build do site (`npm run build:docs`) gera também `borg.mjs` e `borg.js` na raiz da saída (`docs-dist/`), a partir do mesmo `src/`.
- Esses arquivos são servidos com cabeçalhos que permitem `import` de outra origem (CORS) e `Content-Type` de JavaScript.
- Todo exemplo de URL na documentação vem de uma única constante, para que trocar o domínio seja uma alteração em um só lugar.

## Fora do escopo

- Novas funções na biblioteca.
- Publicação no npm ou em CDN externa.
- Contas de usuário, salvar o progresso do aluno ou corrigir desafios automaticamente.
- Tradução do site para outros idiomas.
- Backend.

## Domínio

- O domínio `https://borg.lenoborges.br` (verificado na Vercel) é o oficial. `borg-js.vercel.app` continua respondendo, mas não aparece na documentação.
