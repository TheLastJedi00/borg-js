import { comImport } from '../config.js'
import { aviso } from '../componentes.js'
import { playground } from '../playground/playground.js'

/** Seção sobre fazer o movimento deslizar com `mudarEstilo` e `transition`. */
export const secaoMovimentoSuave = {
  id: 'movimento-suave',
  rotulo: 'Movimento suave',
  html: `
    <h2>Movimento suave</h2>
    <p>
      <code>moverPara</code> e <code>moverPor</code> mudam a posição na hora. Para o elemento
      <strong>deslizar</strong> até o novo lugar, avise o CSS que <code>left</code> e
      <code>top</code> devem mudar aos poucos, com a propriedade <code>transition</code>.
      Dá para fazer isso com a função que você já conhece, <code>mudarEstilo</code>:
    </p>
    ${playground({
      id: 'exemplo-movimento-suave',
      titulo: 'Movimento suave',
      html: `
<p class="dica">Clique em qualquer lugar do resultado</p>
<div class="bola" id="bolinha"></div>`,
      css: `
.dica {
  opacity: 0.7;
}

.bola {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, #2dd4bf, #38bdf8);
}`,
      js: comImport(`
mudarEstilo('#bolinha', 'transition', 'left 0.4s, top 0.4s')

aoClicarNaTela((posicao) => {
  moverPara('#bolinha', posicao)
})`),
    })}
    ${aviso('dica', 'O tempo (<code>0.4s</code>) controla a velocidade. Em um jogo com loop, deixe sem <code>transition</code> ou com um tempo bem curto, senão o movimento fica atrasado em relação às teclas.')}
  `,
}
