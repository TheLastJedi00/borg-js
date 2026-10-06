import { blocoDeCodigo } from '../codigo/bloco.js'
import { playground } from '../playground/playground.js'
import { comImport } from '../config.js'
import { aviso } from '../componentes.js'

/** Regras que valem para todas as funções. Ficam no topo da página Funções. */
export const secoesComoFunciona = [
  {
    id: 'seletores',
    rotulo: 'Seletores',
    html: `
      <h2>Seletores</h2>
      <p>
        Onde uma função pede um <code>seletor</code>, você passa o mesmo texto que usaria no CSS:
        <code>'#meu-id'</code>, <code>'.minha-classe'</code> ou <code>'button'</code>. Também dá para
        passar um elemento do DOM.
      </p>
      <p>Se o seletor encontrar vários elementos, a função vale para <strong>todos</strong> eles:</p>
      ${blocoDeCodigo(comImport(`
// Todos os botões com a classe "curtir" reagem
aoClicar('.curtir', (botao) => {
  alternarClasse(botao, 'curtido')
})`))}
      ${aviso('cuidado', 'Esqueceu o <code>#</code> ou o <code>.</code>? <code>\'botao\'</code> procura uma tag <code>&lt;botao&gt;</code>, que não existe. O certo é <code>\'#botao\'</code> para um id e <code>\'.botao\'</code> para uma classe.')}
    `,
  },
  {
    id: 'parar',
    rotulo: 'Parar de reagir',
    html: `
      <h2>Parar de reagir</h2>
      <p>
        Toda função que começa com <code>ao</code> devolve uma função <code>parar()</code>. Guarde
        em uma variável e chame quando não quiser mais reagir:
      </p>
      ${playground({
        id: 'exemplo-parar',
        titulo: 'parar',
        altura: 220,
        html: `
<button id="botao-uma-vez">Só funciona uma vez</button>
<p id="mensagem-uma-vez">Clique no botão</p>`,
        js: comImport(`
const parar = aoClicar('#botao-uma-vez', () => {
  mudarTexto('#mensagem-uma-vez', 'Pronto! Agora o botão não reage mais.')
  parar()
})`),
      })}
    `,
  },
  {
    id: 'mensagens',
    rotulo: 'Mensagens de ajuda',
    html: `
      <h2>Mensagens de ajuda</h2>
      <p>
        Errou o seletor? A Borg mostra um <strong>aviso</strong> no console explicando o que
        aconteceu, sem quebrar a página. Se um valor tiver o tipo errado, como um texto onde
        deveria ir uma função, ela mostra um <strong>erro</strong> dizendo o que corrigir.
      </p>
      <p>
        Nos exemplos desta documentação, as mensagens aparecem embaixo do resultado. No seu projeto,
        abra o console do navegador com <kbd>F12</kbd>.
      </p>
      ${playground({
        id: 'exemplo-mensagens',
        titulo: 'mensagens de ajuda',
        altura: 160,
        html: `
<button id="botao">Clique</button>`,
        js: comImport(`
// O id no HTML é "botao", mas aqui está escrito errado
aoClicar('#botao-errado', () => {})

// Um texto no lugar da função
aoClicar('#botao', 'mostrar')`),
      })}
    `,
  },
]
