import { describe, it, expect, vi, beforeEach } from 'vitest'
import { colidiu } from '../../src/movimento/posicionar.js'
import { simularRetangulo } from './retangulo.js'

describe('colidiu', () => {
  let nave
  let estrela

  beforeEach(() => {
    document.body.innerHTML = '<div id="nave"></div><div id="estrela"></div>'
    nave = document.getElementById('nave')
    estrela = document.getElementById('estrela')
    simularRetangulo(nave, { x: 0, y: 0, largura: 50, altura: 50 })
  })

  it('retorna true quando os retângulos se sobrepõem', () => {
    simularRetangulo(estrela, { x: 40, y: 40, largura: 20, altura: 20 })
    expect(colidiu('#nave', '#estrela')).toBe(true)
  })

  it('retorna true quando um está dentro do outro', () => {
    simularRetangulo(estrela, { x: 10, y: 10, largura: 5, altura: 5 })
    expect(colidiu(nave, estrela)).toBe(true)
  })

  it('retorna false quando estão separados', () => {
    simularRetangulo(estrela, { x: 100, y: 0, largura: 20, altura: 20 })
    expect(colidiu(nave, '#estrela')).toBe(false)
  })

  it('retorna false quando só encostam na borda', () => {
    simularRetangulo(estrela, { x: 50, y: 0, largura: 20, altura: 20 })
    expect(colidiu(nave, estrela)).toBe(false)
  })

  it('avisa e retorna false quando um seletor não encontra nada', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(colidiu('#nave', '#nao-existe')).toBe(false)
    expect(aviso.mock.calls[0][0]).toContain('[Borg] colidiu:')
  })
})
