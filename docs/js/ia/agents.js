import { documentacaoEmMarkdown } from './documentacao.js'
import { AJUSTES_DO_PROFESSOR, REGRAS_DE_TUTOR, TITULO_DO_AGENTS, SOBRE_O_ARQUIVO } from '../dados/tutor.js'

/**
 * Monta o AGENTS.md do projeto do aluno: os ajustes do professor, as regras de tutor e,
 * depois, a documentação completa da Borg, a mesma do botão "Copiar para IA".
 * @param {string} [documentacao] - Documentação em Markdown. Por padrão, a do site.
 * @returns {string}
 */
export function gerarAgentsMd(documentacao = documentacaoEmMarkdown()) {
  return `${[
    TITULO_DO_AGENTS,
    SOBRE_O_ARQUIVO,
    AJUSTES_DO_PROFESSOR,
    REGRAS_DE_TUTOR,
    '---',
    documentacao.trim(),
  ].join('\n\n')}\n`
}
