/**
 * Regras da publicação da extensão que não dependem de rede, para poderem ser testadas.
 */

/**
 * Registros onde a extensão é publicada e a variável de ambiente com o token de cada um.
 * @type {{ nome: string, variavel: string, comoCriar: string }[]}
 */
export const REGISTROS = [
  {
    nome: 'Marketplace do VS Code',
    variavel: 'VSCE_PAT',
    comoCriar:
      'crie um Personal Access Token em https://dev.azure.com (escopo Marketplace → Manage, organização "All accessible organizations") ou use --azure-credential',
  },
  {
    nome: 'Open VSX',
    variavel: 'OVSX_PAT',
    comoCriar: 'crie um Access Token em https://open-vsx.org/user-settings/tokens',
  },
]

/**
 * Lista os registros cujo token está faltando.
 *
 * Com `azureCredential`, o Marketplace usa o login da Azure CLI e não precisa de `VSCE_PAT`.
 *
 * @param {Record<string, string|undefined>} ambiente - Normalmente `process.env`.
 * @param {{ azureCredential?: boolean }} [opcoes]
 * @returns {typeof REGISTROS}
 */
export function tokensFaltando(ambiente, { azureCredential = false } = {}) {
  return REGISTROS.filter(({ variavel }) => {
    if (variavel === 'VSCE_PAT' && azureCredential) return false
    return !ambiente[variavel]?.trim()
  })
}

/**
 * Monta a mensagem que explica quais tokens definir antes de publicar.
 * @param {typeof REGISTROS} faltando
 * @returns {string}
 */
export function mensagemDeTokensFaltando(faltando) {
  const linhas = faltando.map(
    ({ nome, variavel, comoCriar }) => `- ${variavel} (${nome}): ${comoCriar}.`,
  )
  return [
    'Nada foi publicado. Defina estas variáveis de ambiente e rode de novo:',
    ...linhas,
    'Os tokens nunca devem ser salvos no repositório.',
  ].join('\n')
}
