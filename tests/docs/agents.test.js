import './ambiente-do-navegador.js'
import { describe, it, expect } from 'vitest'
import * as Borg from '../../src/index.js'
import { gerarAgentsMd } from '../../docs/js/ia/agents.js'
import { documentacaoEmMarkdown } from '../../docs/js/ia/documentacao.js'
import { URL_DO_SITE } from '../../docs/js/config.js'

const agents = gerarAgentsMd()

describe('gerarAgentsMd', () => {
  it('começa pelo título e logo depois traz os ajustes do professor', () => {
    expect(agents).toMatch(/^# AGENTS\.md/)
    const ajustes = agents.indexOf('## Ajustes do professor')
    expect(ajustes).toBeGreaterThan(0)
    expect(ajustes).toBeLessThan(agents.indexOf('## Seu papel'))
  })

  it('traz as regras de tutor antes da documentação', () => {
    const regras = agents.indexOf('## Regras')
    const documentacao = agents.indexOf('# Borg JS — documentação completa')
    expect(regras).toBeGreaterThan(0)
    expect(documentacao).toBeGreaterThan(regras)
  })

  it('a documentação vem inteira, igual à do botão Copiar para IA', () => {
    expect(agents).toContain(documentacaoEmMarkdown().trim())
  })

  it.each(Object.keys(Borg))('a IA conhece %s', (nome) => {
    expect(agents).toContain(`#### \`${nome}(`)
  })

  it('pede para não entregar a solução pronta e para guiar com perguntas', () => {
    expect(agents).toMatch(/Não entregue a solução pronta/)
    expect(agents).toMatch(/dicas em etapas/i)
    expect(agents).toMatch(/Nunca invente funções/)
  })

  it('usa o domínio oficial', () => {
    expect(agents).toContain(URL_DO_SITE)
    expect(agents).not.toContain('${')
  })
})
