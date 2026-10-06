import { linhaDeImport } from '../docs/js/url.js'

/**
 * Edição de texto: troca o trecho de `de` até `ate` por `texto`.
 * @typedef {{ de: number, ate: number, texto: string }} Edicao
 */

/** `import { ... } from '...borg.mjs'`, em uma ou várias linhas. */
const IMPORT_DA_BORG = /import\s*\{([^}]*)\}\s*from\s*(['"])([^'"]*\/borg\.mjs)\2/

/**
 * Descreve a edição que deixa `nome` importado da Borg no código.
 *
 * Sem `import` da Borg, cria a linha no topo, pela URL pública. Com `import`, acrescenta o
 * nome em ordem alfabética, mantendo a origem, e quebra em várias linhas acima de 80
 * caracteres. Se o nome já está importado, não há o que editar.
 *
 * @param {string} codigo - O código JavaScript inteiro.
 * @param {string} nome - Nome da função da Borg.
 * @returns {Edicao|null}
 */
export function editarImport(codigo, nome) {
  const encontrado = IMPORT_DA_BORG.exec(codigo)

  if (!encontrado) {
    return { de: 0, ate: 0, texto: `${linhaDeImport([nome])}\n\n` }
  }

  const [trecho, lista, , origem] = encontrado
  const nomes = lista
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  if (nomes.includes(nome)) return null

  const ordenados = [...nomes, nome].sort((a, b) => a.localeCompare(b, 'pt'))
  return {
    de: encontrado.index,
    ate: encontrado.index + trecho.length,
    texto: linhaDeImport(ordenados, origem),
  }
}
