import { describe, it, expect } from 'vitest'
import * as Borg from '../src/index.js'

describe('Borg JS', () => {
  it('exporta um módulo carregável', () => {
    expect(typeof Borg).toBe('object')
  })
})
