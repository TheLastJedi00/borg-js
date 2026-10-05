import * as Borg from '../src/index.js'
import { secoesDeInicio } from './inicio.js'

// Deixa a Borg disponível como no uso com <script src="borg.js">.
window.Borg = Borg

const conteudo = document.getElementById('conteudo')

/**
 * Adiciona uma seção à página e um link no menu.
 * @param {HTMLElement} menu
 * @param {{ id: string, rotulo: string, html: string }} secao
 * @param {string} [classe]
 * @returns {HTMLElement}
 */
function adicionarSecao(menu, { id, rotulo, html }, classe = 'secao') {
  const elemento = document.createElement('section')
  elemento.id = id
  elemento.className = classe
  elemento.innerHTML = html
  conteudo.append(elemento)

  const item = document.createElement('li')
  const link = document.createElement('a')
  link.href = `#${id}`
  link.textContent = rotulo
  item.append(link)
  menu.append(item)
  return elemento
}

const menuInicio = document.getElementById('menu-inicio')
secoesDeInicio.forEach((secao) => adicionarSecao(menuInicio, secao))
