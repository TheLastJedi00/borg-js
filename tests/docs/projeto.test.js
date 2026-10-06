import { describe, it, expect } from 'vitest'
import { gerarHtmlDoProjeto } from '../../docs/js/playground/projeto.js'
import { URL_BORG_MJS } from '../../docs/js/config.js'

const projeto = {
  titulo: 'Jogo & diversão',
  html: '<button id="b">Oi</button>\n<p id="t">0</p>',
  css: 'body {\n  margin: 0;\n}',
  js: "aoClicar('#b', () => {\n  mudarTexto('#t', 1)\n})",
}

const ler = (texto) => new DOMParser().parseFromString(texto, 'text/html')

describe('gerarHtmlDoProjeto', () => {
  it('gera um arquivo HTML completo, em português e com viewport', () => {
    const texto = gerarHtmlDoProjeto(projeto)
    const doc = ler(texto)

    expect(texto.startsWith('<!doctype html>\n<html lang="pt-BR">')).toBe(true)
    expect(doc.querySelector('meta[charset]').getAttribute('charset')).toBe('UTF-8')
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull()
    expect(texto.endsWith('</html>\n')).toBe(true)
  })

  it('usa o título do projeto, escapado', () => {
    expect(ler(gerarHtmlDoProjeto(projeto)).title).toBe('Jogo & diversão')
    expect(gerarHtmlDoProjeto(projeto)).toContain('<title>Jogo &amp; diversão</title>')
  })

  it('coloca o CSS em um <style> no head', () => {
    expect(ler(gerarHtmlDoProjeto(projeto)).head.querySelector('style').textContent).toContain('margin: 0;')
  })

  it('não cria <style> quando o projeto não tem CSS', () => {
    expect(ler(gerarHtmlDoProjeto({ ...projeto, css: undefined })).querySelector('style')).toBeNull()
  })

  it('coloca o HTML no body, antes do script', () => {
    const doc = ler(gerarHtmlDoProjeto(projeto))
    expect(doc.body.firstElementChild.id).toBe('b')
    expect(doc.body.lastElementChild.tagName).toBe('SCRIPT')
  })

  it('coloca o JS em um script de módulo, com o import da Borg pela URL pública', () => {
    const script = ler(gerarHtmlDoProjeto(projeto)).querySelector('script[type="module"]').textContent
    expect(script).toContain(`import { aoClicar, mudarTexto } from '${URL_BORG_MJS}'`)
    expect(script).toContain("aoClicar('#b'")
  })

  it('indenta o conteúdo para o arquivo ficar fácil de ler', () => {
    const texto = gerarHtmlDoProjeto(projeto)
    expect(texto).toContain('\n    <button id="b">Oi</button>\n')
    expect(texto).toContain('\n      body {\n        margin: 0;\n      }\n')
    expect(texto).toContain("\n      aoClicar('#b', () => {\n        mudarTexto('#t', 1)\n      })\n")
  })

  it('não deixa um </script> no JS fechar o script antes da hora', () => {
    const doc = ler(gerarHtmlDoProjeto({ ...projeto, js: "const t = '</script>'\nconsole.log(t)" }))
    expect(doc.querySelector('script[type="module"]').textContent).toContain('console.log(t)')
  })
})
