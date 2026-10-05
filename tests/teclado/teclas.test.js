import { describe, it, expect } from 'vitest'
import { normalizarTecla, nomeDaTecla, QUALQUER } from '../../src/teclado/teclas.js'

describe('normalizarTecla', () => {
  it('converte letras e números sem diferenciar maiúsculas', () => {
    expect(normalizarTecla('a', 'teste')).toBe('a')
    expect(normalizarTecla('A', 'teste')).toBe('a')
    expect(normalizarTecla('7', 'teste')).toBe('7')
  })

  it('converte os nomes especiais em português', () => {
    expect(normalizarTecla('espaço', 'teste')).toBe(' ')
    expect(normalizarTecla('enter', 'teste')).toBe('enter')
    expect(normalizarTecla('esc', 'teste')).toBe('escape')
    expect(normalizarTecla('seta cima', 'teste')).toBe('arrowup')
    expect(normalizarTecla('seta baixo', 'teste')).toBe('arrowdown')
    expect(normalizarTecla('seta esquerda', 'teste')).toBe('arrowleft')
    expect(normalizarTecla('seta direita', 'teste')).toBe('arrowright')
  })

  it('tolera maiúsculas, espaços extras e a grafia sem acento', () => {
    expect(normalizarTecla('  Seta   Cima ', 'teste')).toBe('arrowup')
    expect(normalizarTecla('ESPAÇO', 'teste')).toBe(' ')
    expect(normalizarTecla('espaco', 'teste')).toBe(' ')
  })

  it('reconhece a tecla especial "qualquer"', () => {
    expect(normalizarTecla('qualquer', 'teste')).toBe(QUALQUER)
  })

  it('lança erro em português listando as teclas válidas para nomes desconhecidos', () => {
    expect(() => normalizarTecla('seta cim', 'aoPressionar')).toThrow(/\[Borg\] aoPressionar.*seta cima/)
  })

  it('lança erro de tipo quando a tecla não é texto', () => {
    expect(() => normalizarTecla(13, 'aoPressionar')).toThrow(TypeError)
  })
})

describe('nomeDaTecla', () => {
  it('traduz o KeyboardEvent.key para o nome em português', () => {
    expect(nomeDaTecla(' ')).toBe('espaço')
    expect(nomeDaTecla('ArrowUp')).toBe('seta cima')
    expect(nomeDaTecla('Escape')).toBe('esc')
    expect(nomeDaTecla('Enter')).toBe('enter')
    expect(nomeDaTecla('B')).toBe('b')
  })

  it('mantém, em minúsculas, teclas sem nome em português', () => {
    expect(nomeDaTecla('Shift')).toBe('shift')
  })
})
