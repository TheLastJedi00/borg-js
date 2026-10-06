import { describe, it, expect, vi } from 'vitest'
import { montarDocumentoDoPlayground, instalarPonteDoConsole, conterRolagem } from '../../docs/js/playground/documento.js'
import { URL_BORG_MJS } from '../../docs/js/config.js'

const ORIGEM = 'http://localhost:4200'

function montar(opcoes = {}) {
  const texto = montarDocumentoDoPlayground({
    id: 'p1',
    origem: ORIGEM,
    html: '<button id="b">Oi</button>',
    css: 'button { color: red }',
    js: "import { aoClicar } from 'x'\naoClicar('#b', () => {})",
    ...opcoes,
  })
  return { texto, doc: new DOMParser().parseFromString(texto, 'text/html') }
}

describe('montarDocumentoDoPlayground', () => {
  it('gera um documento HTML completo em português', () => {
    const { texto, doc } = montar()
    expect(texto.startsWith('<!doctype html>')).toBe(true)
    expect(doc.documentElement.lang).toBe('pt-BR')
  })

  it('redireciona a URL pública da Borg para a borg.mjs da origem atual', () => {
    const { doc } = montar()
    const mapa = JSON.parse(doc.querySelector('script[type="importmap"]').textContent)
    expect(mapa.imports[URL_BORG_MJS]).toBe(`${ORIGEM}/borg.mjs`)
  })

  it('coloca o import map antes de qualquer módulo', () => {
    const { doc } = montar()
    const scripts = [...doc.querySelectorAll('script')]
    const mapa = scripts.findIndex((s) => s.type === 'importmap')
    const modulo = scripts.findIndex((s) => s.type === 'module')
    expect(mapa).toBeGreaterThanOrEqual(0)
    expect(mapa).toBeLessThan(modulo)
  })

  it('instala a ponte do console antes do código do aluno, com o id do playground', () => {
    const { doc } = montar()
    const scripts = [...doc.querySelectorAll('script')]
    const ponte = scripts.findIndex((s) => !s.type && s.textContent.includes('"p1"'))
    expect(ponte).toBeGreaterThanOrEqual(0)
    expect(ponte).toBeLessThan(scripts.findIndex((s) => s.type === 'module'))
  })

  it('coloca o HTML no body e o JS em um script de módulo', () => {
    const { doc } = montar()
    expect(doc.body.querySelector('#b').textContent).toBe('Oi')
    expect(doc.querySelector('script[type="module"]').textContent).toContain("aoClicar('#b'")
  })

  it('aplica o estilo base e depois o CSS do aluno', () => {
    const { doc } = montar()
    const estilos = [...doc.head.querySelectorAll('style')]
    expect(estilos.length).toBe(2)
    expect(estilos[1].textContent).toContain('button { color: red }')
  })

  it('não deixa um </script> no código do aluno fechar o script antes da hora', () => {
    const { doc } = montar({ js: "const t = '</script>'\nconsole.log(t)" })
    expect(doc.querySelector('script[type="module"]').textContent).toContain('console.log(t)')
  })

  it('não deixa um </style> no CSS do aluno fechar o estilo antes da hora', () => {
    const { doc } = montar({ css: 'a{} </style><p id="vazou">' })
    expect(doc.getElementById('vazou')).toBeNull()
  })

  it('pode ficar sem o estilo base, para projetos que trazem o próprio CSS', () => {
    const { doc } = montar({ estiloBase: false })
    const estilos = [...doc.head.querySelectorAll('style')]
    expect(estilos.length).toBe(1)
    expect(estilos[0].textContent).toContain('button { color: red }')
  })

  it('funciona sem CSS', () => {
    const { doc } = montar({ css: undefined })
    expect(doc.head.querySelectorAll('style').length).toBe(1)
  })
})

describe('instalarPonteDoConsole', () => {
  function janelaFalsa() {
    const ouvintes = {}
    const original = { log: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    return {
      original,
      console: { ...original },
      parent: { postMessage: vi.fn() },
      addEventListener: (tipo, fn) => (ouvintes[tipo] = fn),
      disparar: (tipo, evento) => ouvintes[tipo](evento),
    }
  }

  it('repassa console.log para a página com o id do playground', () => {
    const janela = janelaFalsa()
    instalarPonteDoConsole('p1', janela)

    janela.console.log('oi', 42, { a: 1 })

    expect(janela.parent.postMessage).toHaveBeenCalledWith(
      { fonte: 'borg-playground', id: 'p1', tipo: 'log', texto: 'oi 42 {"a":1}' },
      '*',
    )
    expect(janela.original.log).toHaveBeenCalledWith('oi', 42, { a: 1 })
  })

  it('repassa avisos e erros com o tipo certo', () => {
    const janela = janelaFalsa()
    instalarPonteDoConsole('p1', janela)

    janela.console.warn('[Borg] cuidado')
    janela.console.error(new Error('quebrou'))

    const tipos = janela.parent.postMessage.mock.calls.map(([m]) => [m.tipo, m.texto])
    expect(tipos).toEqual([
      ['warn', '[Borg] cuidado'],
      ['error', 'quebrou'],
    ])
  })

  it('repassa erros não capturados e promessas rejeitadas', () => {
    const janela = janelaFalsa()
    instalarPonteDoConsole('p1', janela)

    janela.disparar('error', { message: 'Uncaught TypeError: x' })
    janela.disparar('unhandledrejection', { reason: new Error('falhou') })

    const textos = janela.parent.postMessage.mock.calls.map(([m]) => m.texto)
    expect(textos).toEqual(['Uncaught TypeError: x', 'falhou'])
  })

  it('mostra undefined e valores que não viram JSON', () => {
    const janela = janelaFalsa()
    instalarPonteDoConsole('p1', janela)
    const circular = {}
    circular.eu = circular

    janela.console.log(undefined, circular)

    expect(janela.parent.postMessage.mock.calls[0][0].texto).toBe('undefined [object Object]')
  })
})

describe('conterRolagem', () => {
  function janelaFalsa({ rolavel }) {
    let ouvinte
    return {
      innerHeight: 300,
      document: { documentElement: { scrollHeight: rolavel ? 900 : 300 } },
      addEventListener: (tipo, fn) => tipo === 'keydown' && (ouvinte = fn),
      apertar: (key, alvo = { tagName: 'BODY', isContentEditable: false }) => {
        const evento = { key, target: alvo, preventDefault: vi.fn() }
        ouvinte(evento)
        return evento.preventDefault
      },
    }
  }

  it('impede que espaço e setas rolem a página de fora quando o resultado não tem rolagem', () => {
    const janela = janelaFalsa({ rolavel: false })
    conterRolagem(janela)

    for (const tecla of [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp']) {
      expect(janela.apertar(tecla)).toHaveBeenCalled()
    }
  })

  it('deixa as outras teclas em paz', () => {
    const janela = janelaFalsa({ rolavel: false })
    conterRolagem(janela)
    expect(janela.apertar('a')).not.toHaveBeenCalled()
  })

  it('deixa rolar quando o próprio resultado tem rolagem', () => {
    const janela = janelaFalsa({ rolavel: true })
    conterRolagem(janela)
    expect(janela.apertar(' ')).not.toHaveBeenCalled()
  })

  it('não atrapalha a digitação em campos de texto', () => {
    const janela = janelaFalsa({ rolavel: false })
    conterRolagem(janela)
    expect(janela.apertar(' ', { tagName: 'INPUT', isContentEditable: false })).not.toHaveBeenCalled()
    expect(janela.apertar(' ', { tagName: 'TEXTAREA', isContentEditable: false })).not.toHaveBeenCalled()
  })
})
