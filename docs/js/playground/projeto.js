import { comImport } from '../config.js'
import { escaparHtml } from '../util.js'
import { protegerTag } from './documento.js'

/**
 * Indenta cada linha não vazia de um trecho.
 * @param {string} texto
 * @param {number} espacos
 * @returns {string}
 */
const indentar = (texto, espacos) =>
  texto
    .trim()
    .split('\n')
    .map((linha) => (linha.trim() ? ' '.repeat(espacos) + linha : ''))
    .join('\n')

/**
 * Monta um projeto inteiro em um único arquivo HTML, pronto para salvar como `index.html`.
 * O JS vai em um `<script type="module">`, com o `import` da Borg pela URL pública.
 * @param {{ titulo: string, html: string, css?: string, js: string }} projeto
 * @returns {string}
 */
export function gerarHtmlDoProjeto({ titulo, html, css, js }) {
  const estilo = css ? `\n    <style>\n${indentar(css, 6)}\n    </style>` : ''

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escaparHtml(titulo)}</title>${estilo}
  </head>
  <body>
${indentar(html, 4)}

    <script type="module">
${indentar(protegerTag(comImport(js), 'script'), 6)}
    </script>
  </body>
</html>
`
}
