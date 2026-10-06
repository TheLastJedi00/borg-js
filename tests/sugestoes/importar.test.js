import { describe, it, expect } from 'vitest'
import { editarImport } from '../../sugestoes/importar.js'
import { URL_BORG_MJS } from '../../docs/js/config.js'

/** Aplica a edição no código, como o editor faria. */
function aplicar(codigo, edicao) {
  if (!edicao) return codigo
  return codigo.slice(0, edicao.de) + edicao.texto + codigo.slice(edicao.ate)
}

describe('editarImport', () => {
  it('cria o import no topo quando o arquivo ainda não importa a Borg', () => {
    const codigo = "console.log('oi')\n"
    expect(aplicar(codigo, editarImport(codigo, 'aoClicar'))).toBe(
      `import { aoClicar } from '${URL_BORG_MJS}'\n\nconsole.log('oi')\n`,
    )
  })

  it('cria o import em um arquivo vazio', () => {
    expect(aplicar('', editarImport('', 'mostrar'))).toBe(`import { mostrar } from '${URL_BORG_MJS}'\n\n`)
  })

  it('acrescenta o nome em ordem alfabética no import que já existe', () => {
    const codigo = `import { mostrar } from '${URL_BORG_MJS}'\n\nmostrar('#a')\n`
    expect(aplicar(codigo, editarImport(codigo, 'esconder'))).toBe(
      `import { esconder, mostrar } from '${URL_BORG_MJS}'\n\nmostrar('#a')\n`,
    )
  })

  it('não muda nada quando o nome já está importado', () => {
    const codigo = `import { aoClicar, mostrar } from '${URL_BORG_MJS}'\n`
    expect(editarImport(codigo, 'mostrar')).toBeNull()
  })

  it('entende o import em várias linhas', () => {
    const codigo = `import {\n  aoMoverMouse,\n  mudarEstilo,\n} from '${URL_BORG_MJS}'\n\nx()\n`
    expect(editarImport(codigo, 'mudarEstilo')).toBeNull()
    expect(aplicar(codigo, editarImport(codigo, 'aoClicar'))).toBe(
      `import {\n  aoClicar,\n  aoMoverMouse,\n  mudarEstilo,\n} from '${URL_BORG_MJS}'\n\nx()\n`,
    )
  })

  it('quebra em várias linhas quando o import passaria de 80 caracteres', () => {
    const codigo = `import { aoMoverMouse, mudarEstilo } from '${URL_BORG_MJS}'\n`
    expect(aplicar(codigo, editarImport(codigo, 'alternarClasse'))).toBe(
      `import {\n  alternarClasse,\n  aoMoverMouse,\n  mudarEstilo,\n} from '${URL_BORG_MJS}'\n`,
    )
  })

  it('reconhece o import da Borg por outro caminho até borg.mjs', () => {
    const codigo = "import { mostrar } from './borg.mjs'\n"
    expect(aplicar(codigo, editarImport(codigo, 'esconder'))).toBe(
      "import { esconder, mostrar } from './borg.mjs'\n",
    )
  })

  it('ignora imports de outras bibliotecas', () => {
    const codigo = "import { algo } from './outra.js'\n"
    expect(aplicar(codigo, editarImport(codigo, 'mostrar'))).toBe(
      `import { mostrar } from '${URL_BORG_MJS}'\n\nimport { algo } from './outra.js'\n`,
    )
  })
})
