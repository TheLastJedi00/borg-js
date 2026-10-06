import { URL_BORG_MJS } from '../config.js'

/**
 * Estilo básico aplicado ao resultado de todo playground, antes do CSS do aluno.
 * Deixa os exemplos legíveis sem precisar escrever CSS. Não entra no código copiado.
 */
const ESTILO_BASE = `
:root { color-scheme: light dark; --gradiente: linear-gradient(120deg, #2dd4bf, #38bdf8); }
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: 'Atkinson Hyperlegible Next', system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.5;
  text-align: center;
  background: var(--fundo);
  color: var(--texto);
}
body[data-tema='light'] { --fundo: #ffffff; --texto: #0b2530; --suave: #4a6570; --borda: #cfe0e2; color-scheme: light; }
body[data-tema='dark'] { --fundo: #0d2630; --texto: #e3f1f2; --suave: #93b2bb; --borda: #1f4352; color-scheme: dark; }
p, h1, h2, h3 { margin: 0; }
button {
  padding: 10px 20px;
  border: 0;
  border-radius: 999px;
  background: var(--gradiente);
  color: #0b2530;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
button:active { transform: scale(0.97); }
input { font: inherit; padding: 8px 12px; border: 1px solid var(--borda); border-radius: 10px; }
`

/** Impede que `</script` ou `</style` no código do aluno feche a tag antes da hora. */
const protegerTag = (codigo, tag) => codigo.replace(new RegExp(`</(${tag})`, 'gi'), '<\\/$1')

/**
 * Repassa o console e os erros do resultado para a página, com `postMessage`.
 *
 * Roda **dentro** do iframe: o documento inclui o código desta função com
 * `Function.prototype.toString`, então ela não pode usar nada de fora dela.
 * @param {string} id identificador do playground
 * @param {Window} janela
 */
export function instalarPonteDoConsole(id, janela) {
  const formatar = (valor) => {
    if (typeof valor === 'string') return valor
    if (valor instanceof Error) return valor.message
    try {
      return JSON.stringify(valor) ?? String(valor)
    } catch {
      return String(valor)
    }
  }
  const enviar = (tipo, valores) =>
    janela.parent.postMessage(
      { fonte: 'borg-playground', id, tipo, texto: valores.map(formatar).join(' ') },
      '*',
    )

  for (const tipo of ['log', 'info', 'warn', 'error']) {
    const original = janela.console[tipo]
    janela.console[tipo] = (...valores) => {
      enviar(tipo, valores)
      original.apply(janela.console, valores)
    }
  }
  janela.addEventListener('error', (evento) => enviar('error', [evento.message]))
  janela.addEventListener('unhandledrejection', (evento) => enviar('error', [evento.reason]))
}

/**
 * Monta o documento (`srcdoc`) do resultado de um playground.
 *
 * Um import map redireciona a URL pública da Borg para a `borg.mjs` da origem atual. Assim, o
 * mesmo `import` que o aluno copia para o projeto dele funciona aqui, em `localhost` e nos
 * previews.
 * @param {{ id: string, origem: string, html: string, css?: string, js: string, tema?: 'light' | 'dark' }} opcoes
 * @returns {string}
 */
export function montarDocumentoDoPlayground({ id, origem, html, css, js, tema = 'light' }) {
  const mapa = JSON.stringify({ imports: { [URL_BORG_MJS]: `${origem}/borg.mjs` } })
  const estiloDoAluno = css ? `\n<style>\n${protegerTag(css, 'style')}\n</style>` : ''

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;700&display=swap">
<script type="importmap">${mapa}</script>
<script>(${instalarPonteDoConsole})(${JSON.stringify(id)}, window)</script>
<style>${ESTILO_BASE}</style>${estiloDoAluno}
</head>
<body data-tema="${tema}">
${html.trim()}
<script type="module">
${protegerTag(js.trim(), 'script')}
</script>
</body>
</html>`
}
