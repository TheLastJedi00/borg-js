/**
 * Erros comuns do navegador, com uma explicação para iniciantes. As mensagens da Borg
 * (`[Borg] ...`) já explicam o problema, então não ganham dica.
 * @type {Array<[RegExp, (...partes: string[]) => string]>}
 */
const EXPLICACOES = [
  [
    /does not provide an export named '([^']+)'/,
    (nome) => `A Borg não tem uma função chamada "${nome}". Confira se o nome no import está escrito igual ao da página Funções.`,
  ],
  [
    /^(?:Uncaught )?ReferenceError: (\S+) is not defined/,
    (nome) => `"${nome}" não existe neste código. Você esqueceu de importar ou escreveu o nome de um jeito diferente?`,
  ],
  [
    /Unexpected end of input|Unexpected token|missing \) after|Invalid or unexpected token|Unterminated/,
    () => 'O código tem um erro de digitação. Confira se os parênteses, as chaves e as aspas que abrem também fecham.',
  ],
  [
    /Cannot read properties of (?:null|undefined)/,
    () => 'O código tentou usar algo que não existe. Se for um elemento, confira o seletor e o HTML.',
  ],
  [
    /is not a function/,
    () => 'O código chamou como função algo que não é uma função. Confira o nome e se ela foi importada.',
  ],
]

/**
 * Devolve uma explicação em português para um erro do navegador, ou `null` se não conhecer.
 * @param {string} mensagem
 * @returns {string | null}
 */
export function explicarErro(mensagem) {
  if (mensagem.includes('[Borg]')) return null

  for (const [padrao, explicar] of EXPLICACOES) {
    const encontrado = mensagem.match(padrao)
    if (encontrado) return explicar(...encontrado.slice(1))
  }
  return null
}
