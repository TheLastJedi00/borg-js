# 004 - Nova Logo e IA · Borg JS

## Objetivo

1. Trocar a logo da Borg JS pela **nova coruja desenhada no Figma**, que tem duas versões: olho aberto e olho fechado. A coruja pisca e reage no site.
2. Criar um botão que **copia a documentação inteira em Markdown**, para o aluno ou o professor colar em um agente de IA.
3. Orientar o professor a criar, no projeto do aluno, um arquivo **`AGENTS.md`** com um prompt que faz a IA agir como **tutor**: ela conhece toda a documentação da Borg, mas estimula o aprendizado e não pensa pelo aluno.

## Fonte da nova logo (Figma)

- Arquivo: **Leno Borges** — https://www.figma.com/design/XJ2Jv3Lrs01vvd6I9v5ESL/Leno-Borges?node-id=136-2 (página "New Logo").
- Frames:
  - **Borg Eye Open** (`188:2`): a logo padrão.
  - **Borg Eye Closed** (`189:88`): a mesma coruja com os olhos fechados.
- Os dois frames têm as mesmas camadas: `Union` (cabeça e penas), `Peck` (bico), `Eyes` (olhos e pupilas), `Eyelids` (pálpebras de cima e de baixo) e `Feathers`. **Só as pálpebras mudam de lugar**: no olho aberto elas ficam acima e abaixo dos olhos; no fechado, cobrem os olhos.
- O fundo cinza dos frames é só o fundo do quadro no Figma. A logo é exportada com fundo transparente.
- A leitura do Figma é feita pelo Figma MCP (`get_design_context`, `get_screenshot` e exportação dos vetores), sem copiar valores à mão.

## Decisões da spec

| Tema | Decisão |
| --- | --- |
| Um SVG só | A logo vira **um único SVG** com as pálpebras em um grupo próprio. O olho aberto e o fechado são estados do mesmo desenho: piscar é mover as pálpebras, sem trocar de imagem. `assets/logo.svg` (olho aberto) e `assets/logo-fechada.svg` (olho fechado) também são gerados, para quem precisa de imagem estática. |
| Uso das duas versões | O **olho aberto** é a logo padrão em todo lugar: favicon, topo do site, README e ícone da extensão. O **olho fechado** só aparece no piscar. |
| Coruja que reage | A coruja grande da página inicial passa a ser a nova logo e mantém o que já faz: as pupilas seguem o mouse, ela pisca no clique e reage ao teclado. Ela também pisca sozinha de tempos em tempos. A coruja pequena do topo pisca uma vez ao abrir a página (substitui o "acordar" atual). |
| Movimento reduzido | Com `prefers-reduced-motion`, a coruja não pisca sozinha nem anima ao abrir a página. Clique e teclado ainda trocam o estado, sem transição. |
| Tamanhos pequenos | No favicon (16 e 32 px), a logo precisa continuar reconhecível. Se os contornos finos sumirem, o favicon usa uma versão simplificada do mesmo desenho, gerada no build, e isso fica registrado nas decisões da execução. |
| Cores | As cores vêm do Figma. Os tokens do site (`--verde-agua`, `--azul-ceu` e o âmbar dos olhos) são ajustados para combinar com a nova logo se as cores mudarem, e a descrição da marca no `CLAUDE.md` é atualizada. |
| Ícone da extensão | O build da extensão já gera o PNG a partir de `assets/logo.svg`, então o ícone muda sozinho. Sai uma versão `0.1.1` da extensão com a nova logo. |
| Copiar para IA | **Um botão só, que copia a documentação completa.** Ele fica no topo de todas as páginas ("Copiar para IA") e também na seção de IA da página Professores. Não há cópia por página nem arquivos como `llms.txt`. |
| Fonte do Markdown | O Markdown é **gerado dos mesmos dados** que montam o site (`docs/js/dados/`), por uma função testada. Nada é escrito duas vezes, então a documentação para IA nunca fica desatualizada. |
| Nome do arquivo | **`AGENTS.md`**, na raiz do projeto do aluno. É o nome que Copilot, Cursor, Codex e outros agentes já leem sozinhos. A página Professores explica como usar o mesmo conteúdo em `CLAUDE.md` ou `.github/copilot-instructions.md`. |
| Conteúdo do `AGENTS.md` | Duas partes: (1) as **regras de tutor** e (2) a **documentação completa** em Markdown, a mesma do botão. Assim a IA conhece toda a Borg, mas segue as regras de tutor. |
| Testes | TDD na geração do Markdown e do `AGENTS.md` (`tests/docs/`). A logo e as animações são testadas no Chrome em `localhost:4200`. |
| Porta | O site continua em `localhost:4200`. Não há backend (a porta 3000 não se aplica). |

## Requisitos

### 1. Nova logo

- Exportar do Figma os dois frames e montar o SVG da logo com estes grupos nomeados: cabeça, penas, bico, olhos, pupilas e pálpebras.
- Substituir a logo em:
  - `assets/logo.svg` (favicon de todas as páginas e topo do site);
  - a coruja grande da página inicial (`docs/js/paginas/inicio.js`), com o mesmo código Borg curto que já é mostrado ao lado dela, adaptado às partes novas;
  - o `README.md` da raiz e o da extensão;
  - o ícone da extensão (gerado no build).
- Animações:
  - **Piscar**: as pálpebras fecham e abrem em cerca de 150 ms.
  - **Piscar sozinha**: na página inicial, a cada 4 a 7 segundos, em um intervalo sorteado.
  - **Pupilas**: continuam seguindo o mouse, dentro do branco do olho.
- A logo continua legível no tema claro e no escuro.

### 2. Botão "Copiar para IA"

- Fica no topo de todas as páginas, ao lado do botão de tema. No celular, fica dentro do menu.
- Copia **a documentação completa** em um único Markdown, com:
  1. o que é a Borg e para quem ela é;
  2. como usar com `import` (URL oficial) e sem `import` (script tag);
  3. regras gerais: seletores, `parar()`, mensagens `[Borg]` e os nomes de tecla aceitos;
  4. todas as funções, com assinatura, descrição, parâmetros, retorno, dicas e cuidados, e o exemplo completo (HTML, CSS e JS com o `import`);
  5. as receitas, como "Movimento suave";
  6. os problemas comuns (sintoma e solução).
- Os textos com HTML dos dados (`<code>`, `<strong>`, links) viram Markdown, e os links ficam absolutos, com a URL oficial.
- Depois de copiar, o botão confirma ("Copiado!") e usa o mesmo jeito de copiar que o site já tem, com a alternativa quando a área de transferência não responde.
- Um texto curto ao lado do botão, ou na dica dele, explica para que serve: "Cole em um agente de IA para ele conhecer a Borg".

### 3. Tutor de IA no projeto do aluno (`AGENTS.md`)

- A página **Professores** ganha a seção **"IA na aula"**, que explica:
  - por que usar a IA como tutor e não como quem resolve o exercício;
  - como criar o `AGENTS.md` na raiz do projeto do aluno, ao lado do `index.html` e do `main.js`;
  - quais ferramentas leem o arquivo sozinhas e como usar com as outras (colar no começo da conversa, ou copiar para `CLAUDE.md` ou `.github/copilot-instructions.md`);
  - botões **"Copiar AGENTS.md"** e **"Baixar AGENTS.md"**.
- O prompt de tutor fica escrito em português e instrui a IA a:
  - **não entregar a solução pronta** de exercícios e desafios, nem escrever o projeto pelo aluno;
  - responder com **perguntas que guiam** e **dicas em etapas**, da mais geral para a mais específica, e só mostrar um trecho de código quando o aluno já tentou e travou;
  - pedir que o aluno **explique o que entendeu** e o que espera que o código faça, antes e depois de uma mudança;
  - ensinar a **ler as mensagens `[Borg]`** e o console, em vez de corrigir o erro por ele;
  - indicar a **seção da documentação** que ajuda (pelo nome da função ou da seção);
  - usar **só funções que existem na Borg**, com os nomes exatos, e dizer quando algo não existe em vez de inventar;
  - preferir a Borg enquanto o aluno estiver aprendendo e mostrar o JavaScript puro só quando ele pedir ou já estiver pronto;
  - responder em **português**, com linguagem simples e respostas curtas;
  - valorizar o **progresso** do aluno e incentivar que ele teste cada passo no navegador;
  - abrir exceção só quando o professor disser no próprio arquivo, por exemplo: liberar soluções completas depois da entrega.
- O prompt tem um bloco "Ajustes do professor" no topo (turma, nível, o que está liberado) para o professor personalizar.
- O conteúdo do `AGENTS.md` é gerado pela mesma função que monta o Markdown da documentação. Um teste confere que as regras de tutor vêm antes da documentação e que todas as funções públicas aparecem.
- A página **Começar** ganha um aviso curto, no passo 1, que aponta para o `AGENTS.md` quando o aluno usa IA.

### 4. Coerência

- `README.md` e `CLAUDE.md` atualizados (nova logo, botão, `AGENTS.md`).
- A extensão sai na versão `0.1.1` com a nova logo e a entrada no `CHANGELOG.md`.

## Fora do escopo

- Copiar só a página atual, `llms.txt` ou arquivos de documentação publicados separados.
- Um chat de IA dentro do site ou integração com algum provedor de IA.
- Corrigir desafios automaticamente com IA.
- Mudanças nas funções da biblioteca.
- Backend.
