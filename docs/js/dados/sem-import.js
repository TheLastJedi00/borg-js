import { blocoDeCodigo } from '../codigo/bloco.js'
import { URL_BORG_JS, URL_BORG_MJS } from '../config.js'
import { aviso } from '../componentes.js'

/** Seção sobre usar a Borg com script tag e o objeto global `Borg`. */
export const secaoSemImport = {
  id: 'sem-import',
  rotulo: 'Usando sem import',
  html: `
    <h2>Usando sem import</h2>
    <p>
      Também dá para usar a Borg sem módulos. Inclua o arquivo <code>borg.js</code> com uma tag
      <code>&lt;script&gt;</code>: ele cria o objeto <code>Borg</code>, e cada função fica em
      <code>Borg.nomeDaFuncao</code>. O seu código pode ir direto no HTML, logo depois.
    </p>
    ${blocoDeCodigo(`
<button id="botao">Clique</button>
<p id="mensagem" hidden>Olá!</p>

<script src="${URL_BORG_JS}"></script>
<script>
  Borg.aoClicar('#botao', () => {
    Borg.mostrar('#mensagem')
  })
</script>`)}
    ${aviso('cuidado', 'A tag que carrega o <code>borg.js</code> precisa vir <strong>antes</strong> do seu código. Se vier depois, o navegador ainda não conhece o <code>Borg</code> e mostra <code>Borg is not defined</code>.')}
    <h3>Quando essa forma é útil</h3>
    <ul>
      <li>Para um teste rápido, com tudo em um único arquivo HTML.</li>
      <li>Em lugares que só aceitam um arquivo, como alguns editores online e ambientes de aula.</li>
      <li>Para abrir o arquivo com dois cliques, direto do computador (<code>file://</code>). Com <code>import</code>, isso não funciona.</li>
    </ul>
    <h3>As duas formas lado a lado</h3>
    <div class="tabela"><table>
      <thead><tr><th></th><th>Com import</th><th>Sem import</th></tr></thead>
      <tbody>
        <tr><td>Arquivo</td><td><code>${URL_BORG_MJS}</code></td><td><code>${URL_BORG_JS}</code></td></tr>
        <tr><td>Como chama</td><td><code>aoClicar(...)</code></td><td><code>Borg.aoClicar(...)</code></td></tr>
        <tr><td>Tag do seu código</td><td><code>&lt;script type="module"&gt;</code></td><td><code>&lt;script&gt;</code></td></tr>
        <tr><td>Abre com dois cliques (<code>file://</code>)</td><td>Não, precisa de um servidor</td><td>Sim</td></tr>
      </tbody>
    </table></div>
    <p>As funções são as mesmas e funcionam igual. Escolha uma forma por projeto e não misture as duas.</p>
  `,
}
