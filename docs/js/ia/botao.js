import { icones } from '../icones.js'
import { ligarBotaoDeCopiar } from '../util.js'

/** Explica, na dica do botão, para que serve a cópia. */
export const DICA_DO_BOTAO_PARA_IA =
  'Copia a documentação completa da Borg em Markdown. Cole em um agente de IA para ele conhecer a Borg.'

/**
 * HTML do botão "Copiar para IA".
 * @param {{ id: string, classe?: string }} opcoes
 * @returns {string}
 */
export function htmlDoBotaoParaIa({ id, classe = 'botao botao-secundario' }) {
  return `<button type="button" class="${classe} botao-ia" id="${id}" title="${DICA_DO_BOTAO_PARA_IA}">${icones.ia}<span>Copiar para IA</span></button>`
}

/** Documentação em Markdown, montada uma vez só e só quando alguém for copiar. */
let documentacao

/**
 * Carrega o módulo da documentação sob demanda: ele traz os dados de todas as páginas,
 * então não entra no carregamento de cada página.
 * @returns {Promise<string>}
 */
export function carregarDocumentacao() {
  documentacao ??= import('./documentacao.js').then((modulo) => modulo.documentacaoEmMarkdown())
  return documentacao
}

/**
 * Liga um botão "Copiar para IA". Começa a carregar a documentação quando o mouse passa
 * por cima ou o botão recebe foco, para a cópia ser imediata no clique.
 * @param {HTMLButtonElement} botao
 */
export function ligarBotaoParaIa(botao) {
  botao.addEventListener('pointerenter', carregarDocumentacao, { once: true })
  botao.addEventListener('focus', carregarDocumentacao, { once: true })
  ligarBotaoDeCopiar(botao, carregarDocumentacao)
}
