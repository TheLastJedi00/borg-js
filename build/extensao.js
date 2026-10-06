import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { build } from 'vite'
import { createVSIX } from '@vscode/vsce'

const RAIZ = fileURLToPath(new URL('..', import.meta.url))
const PASTA_DA_EXTENSAO = join(RAIZ, 'extensao-vscode')
const SAIDA = join(RAIZ, 'dist-extensao')

/**
 * Gera `icone.png` (256 px) a partir de `assets/logo.svg`, a mesma logo do site.
 * Os registros de extensão exigem PNG de pelo menos 128 × 128.
 */
async function gerarIcone() {
  const svg = await readFile(join(RAIZ, 'assets', 'logo.svg'))
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 256 } }).render().asPng()
  await writeFile(join(PASTA_DA_EXTENSAO, 'icone.png'), png)
}

/**
 * Gera o ícone, o bundle da extensão (com as sugestões embutidas) e o `.vsix`.
 * @returns {Promise<string>} Caminho do `.vsix` gerado.
 */
export async function empacotarExtensao() {
  const { name, version } = JSON.parse(await readFile(join(PASTA_DA_EXTENSAO, 'package.json'), 'utf8'))
  const vsix = join(SAIDA, `${name}-${version}.vsix`)

  await gerarIcone()
  await build({ configFile: join(PASTA_DA_EXTENSAO, 'vite.config.js'), logLevel: 'warn' })
  await mkdir(SAIDA, { recursive: true })
  await createVSIX({ cwd: PASTA_DA_EXTENSAO, packagePath: vsix, dependencies: false })

  return vsix
}

const comando = process.argv[2]
if (comando === 'empacotar') {
  const vsix = await empacotarExtensao()
  console.log(`\nExtensão empacotada em ${vsix}`)
}
