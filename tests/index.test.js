import { describe, it, expect } from 'vitest'
import * as Borg from '../src/index.js'

const API_PUBLICA = [
  'aoClicar',
  'aoClicarNaTela',
  'aoMoverMouse',
  'aoPressionar',
  'aoSoltar',
  'teclaPressionada',
  'mostrar',
  'esconder',
  'alternarClasse',
  'mudarTexto',
  'mudarEstilo',
]

describe('Borg JS', () => {
  it('exporta exatamente a API pública documentada', () => {
    expect(Object.keys(Borg).sort()).toEqual([...API_PUBLICA].sort())
  })

  it.each(API_PUBLICA)('%s é uma função', (nome) => {
    expect(typeof Borg[nome]).toBe('function')
  })
})
