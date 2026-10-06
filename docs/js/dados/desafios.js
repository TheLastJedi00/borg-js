/**
 * Desafios da página Desafios.
 *
 * Cada desafio tem:
 * - `id`: usado no endereço (`desafios.html#contador`) e nos links do guia do professor;
 * - `nivel`: `'facil'`, `'medio'` ou `'dificil'`;
 * - `enunciado`: HTML com o que o aluno precisa fazer;
 * - `funcoes`: funções sugeridas. Viram o `import` do código inicial;
 * - `inicial`: `{ html, css?, js }` que o aluno recebe no playground;
 * - `solucao`: `{ js, html?, css? }`. O que faltar é igual ao inicial.
 *
 * O `js` é escrito sem o `import`; a página coloca no topo.
 */
export const desafios = [
  {
    id: 'contador',
    nivel: 'facil',
    titulo: 'Contador com botão de zerar',
    enunciado: `
      <p>Faça um contador: cada clique em <strong>+1</strong> soma um ao número, e <strong>Zerar</strong> volta para 0.</p>`,
    funcoes: ['aoClicar', 'mudarTexto'],
    inicial: {
      html: `
<p class="numero" id="numero">0</p>
<button id="mais">+1</button>
<button id="zerar">Zerar</button>`,
      css: `
.numero {
  font-size: 3rem;
  font-weight: 700;
}`,
      js: `
let contagem = 0

// 1. Quando clicar em #mais, some 1 à contagem e mostre no #numero

// 2. Quando clicar em #zerar, volte a contagem para 0 e mostre no #numero
`,
    },
    solucao: {
      js: `
let contagem = 0

aoClicar('#mais', () => {
  contagem = contagem + 1
  mudarTexto('#numero', contagem)
})

aoClicar('#zerar', () => {
  contagem = 0
  mudarTexto('#numero', contagem)
})`,
    },
  },
]

/** Níveis na ordem em que aparecem na página. */
export const niveis = [
  { id: 'facil', rotulo: 'Fácil', descricao: 'Uma ou duas funções, uma reação por vez. Bons para as aulas 1 e 2.' },
  { id: 'medio', rotulo: 'Médio', descricao: 'Juntam funções e pedem um pouco de lógica: arrays, contas, condições.' },
  { id: 'dificil', rotulo: 'Difícil', descricao: 'Mini jogos com loop, posição e pontuação. Para quem já fez os médios.' },
]
