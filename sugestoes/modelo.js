/**
 * Converte um modelo na sintaxe de snippet do VS Code para a do CodeMirror.
 *
 * As duas são quase iguais (`${1:texto}`, `${0}`, `\t` no começo da linha). O que muda:
 * - `$1` sem chaves vira `${1}`;
 * - uma escolha `${1|a,b|}` vira o primeiro valor, `${1:a}`;
 * - `\$` (o `$` escapado do VS Code) vira `$`;
 * - `#{` literal ganha escape, porque o CodeMirror o leria como campo.
 *
 * @param {string} modelo
 * @returns {string}
 */
export function paraModeloDoCodeMirror(modelo) {
  return modelo
    .replace(/#\{/g, '#\\{')
    .replace(/\$\{(\d+)\|([^,|]*)[^|]*\|\}/g, '${$1:$2}')
    .replace(/(?<!\\)\$(\d+)/g, '${$1}')
    .replace(/\\\$/g, '$')
}
