import { resolve } from 'node:path'
import { build } from 'vite'
import { configuracaoDaBiblioteca } from './biblioteca.js'

const pastaSrc = resolve(import.meta.dirname, '../src')

/**
 * Gera `borg.mjs` e `borg.js` em memória, a partir de `src/`.
 * @returns {Promise<Map<string, string>>} nome do arquivo → código
 */
async function gerarBiblioteca() {
  const resultado = await build({
    configFile: false,
    logLevel: 'silent',
    publicDir: false,
    build: { lib: configuracaoDaBiblioteca, write: false, emptyOutDir: false },
  })

  const arquivos = new Map()
  for (const saida of [resultado].flat()) {
    for (const item of saida.output) {
      if (item.type === 'chunk') arquivos.set(item.fileName, item.code)
    }
  }
  return arquivos
}

/**
 * Publica a biblioteca na raiz do site, para que `import ... from '<site>/borg.mjs'`
 * funcione. No `dev` os arquivos são servidos (e refeitos quando `src/` muda); no `build`
 * são emitidos em `docs-dist/`.
 * @returns {import('vite').Plugin}
 */
export function publicarBiblioteca() {
  return {
    name: 'borg:publicar-biblioteca',

    configureServer(servidor) {
      let arquivos = null

      servidor.watcher.add(pastaSrc)
      servidor.watcher.on('change', (caminho) => {
        if (resolve(caminho).startsWith(pastaSrc)) arquivos = null
      })

      servidor.middlewares.use(async (requisicao, resposta, proximo) => {
        const nome = requisicao.url?.split('?')[0].slice(1)
        if (nome !== 'borg.mjs' && nome !== 'borg.js') return proximo()

        try {
          arquivos ??= gerarBiblioteca()
          const codigo = (await arquivos).get(nome)
          resposta.setHeader('Content-Type', 'text/javascript; charset=utf-8')
          resposta.setHeader('Access-Control-Allow-Origin', '*')
          resposta.setHeader('Cache-Control', 'no-cache')
          resposta.end(codigo)
        } catch (erro) {
          arquivos = null
          proximo(erro)
        }
      })
    },

    // No `vite preview`, os mesmos cabeçalhos que o vercel.json põe em produção.
    configurePreviewServer(servidor) {
      servidor.middlewares.use((requisicao, resposta, proximo) => {
        const nome = requisicao.url?.split('?')[0]
        if (nome === '/borg.mjs' || nome === '/borg.js') {
          resposta.setHeader('Access-Control-Allow-Origin', '*')
        }
        proximo()
      })
    },

    async generateBundle() {
      for (const [fileName, source] of await gerarBiblioteca()) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}
