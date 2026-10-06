import { describe, it, expect, vi, afterEach } from 'vitest'
import { svgDaLogo, piscar, piscarSozinha } from '../../docs/js/logo.js'

const idsDe = (svg) => [...svg.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id)

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('svgDaLogo', () => {
  it('cada logo tem ids próprios, para várias logos caberem na mesma página', () => {
    const a = svgDaLogo()
    const b = svgDaLogo()
    const idsA = idsDe(a)
    expect(idsA.length).toBeGreaterThan(0)
    idsA.forEach((id) => expect(idsDe(b)).not.toContain(id))
  })

  it('as referências url(#...) apontam para os ids da própria logo', () => {
    const svg = svgDaLogo()
    const ids = idsDe(svg)
    for (const [, alvo] of svg.matchAll(/url\(#([^)]+)\)/g)) expect(ids).toContain(alvo)
  })

  it('sem rótulo, a logo é decorativa e fica escondida dos leitores de tela', () => {
    const svg = svgDaLogo({ classe: 'logo logo-topo' })
    expect(svg).toMatch(/^<svg class="logo logo-topo" aria-hidden="true"/)
    expect(svg).not.toContain('role="img"')
  })

  it('com rótulo, a logo é uma imagem com nome e pode ter id', () => {
    const svg = svgDaLogo({ classe: 'logo coruja', id: 'coruja', rotulo: 'Coruja da Borg JS' })
    expect(svg).toMatch(/^<svg class="logo coruja" id="coruja" role="img" aria-label="Coruja da Borg JS"/)
  })

  it('não leva o comentário do arquivo para a página', () => {
    expect(svgDaLogo()).not.toContain('<!--')
  })
})

describe('piscar', () => {
  it('fecha os olhos e abre de novo depois do tempo', () => {
    vi.useFakeTimers()
    document.body.innerHTML = svgDaLogo({ classe: 'logo' })
    const logo = document.querySelector('svg')
    piscar(logo, 150)
    expect(logo.classList.contains('fechada')).toBe(true)
    vi.advanceTimersByTime(150)
    expect(logo.classList.contains('fechada')).toBe(false)
  })
})

describe('piscarSozinha', () => {
  it('pisca de tempos em tempos, entre 4 e 7 segundos, até parar', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    document.body.innerHTML = svgDaLogo({ classe: 'logo' })
    const logo = document.querySelector('svg')
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // meio do intervalo: 5,5 s
    const parar = piscarSozinha(logo)

    vi.advanceTimersByTime(5499)
    expect(logo.classList.contains('fechada')).toBe(false)
    vi.advanceTimersByTime(1)
    expect(logo.classList.contains('fechada')).toBe(true)
    vi.advanceTimersByTime(150)
    expect(logo.classList.contains('fechada')).toBe(false)

    parar()
    vi.advanceTimersByTime(20000)
    expect(logo.classList.contains('fechada')).toBe(false)
    vi.unstubAllGlobals()
  })

  it('não faz nada com prefers-reduced-motion', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    document.body.innerHTML = svgDaLogo({ classe: 'logo' })
    const logo = document.querySelector('svg')
    piscarSozinha(logo)
    vi.advanceTimersByTime(20000)
    expect(logo.classList.contains('fechada')).toBe(false)
    vi.unstubAllGlobals()
  })
})
