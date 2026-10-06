import { criarEditor, trocarCodigo } from '../codigo/editor.js'
import { ligarBotaoDeCopiar } from '../util.js'
import { icones } from '../icones.js'
import { montarDocumentoDoPlayground } from './documento.js'
import { explicarErro } from './erros.js'

/**
 * @typedef {{ html: string, css?: string, js: string }} Codigo
 * @typedef {Codigo & { id: string, titulo?: string, altura?: number, estiloBase?: boolean }} OpcoesDoPlayground
 * @typedef {{ carregar: (codigo: Codigo) => void, restaurar: () => void, rodar: () => void }} ControleDoPlayground
 */

const ATRASO_AO_DIGITAR = 600
const FUNCOES_DE_TECLADO = /\b(aoPressionar|aoSoltar|teclaPressionada)\s*\(/

/** @type {Map<string, OpcoesDoPlayground>} opções guardadas até o playground ser ativado */
const pendentes = new Map()

/** @type {Map<string, { iframe: HTMLIFrameElement, receber: (mensagem: any) => void } & ControleDoPlayground>} */
const ativos = new Map()

/** @returns {'light' | 'dark'} */
function temaDaPagina() {
  const escolhido = document.documentElement.dataset.theme
  if (escolhido === 'light' || escolhido === 'dark') return escolhido
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Monta o HTML de um playground. Ele só ganha editores e resultado quando chega perto da
 * tela (veja `ativarPlaygrounds`), para a página abrir rápido mesmo com muitos exemplos.
 * @param {OpcoesDoPlayground} opcoes
 * @returns {string}
 */
export function playground(opcoes) {
  pendentes.set(opcoes.id, opcoes)
  return `<div class="playground" data-playground="${opcoes.id}" style="--altura-resultado: ${opcoes.altura ?? 280}px"></div>`
}

/**
 * Devolve o controle de um playground já ativado, para carregar outro código nele.
 * @param {string} id
 * @returns {ControleDoPlayground | undefined}
 */
export function obterPlayground(id) {
  return ativos.get(id)
}

/** @param {'html' | 'css' | 'js'} aba */
const rotuloDaAba = (aba) => aba.toUpperCase()

/**
 * Cria editores, resultado e console dentro de `elemento`.
 * @param {HTMLElement} elemento
 * @param {OpcoesDoPlayground} opcoes
 */
function montar(elemento, opcoes) {
  const { id, titulo } = opcoes
  const original = { html: opcoes.html.trim(), css: opcoes.css?.trim() ?? '', js: opcoes.js.trim() }
  const abas = original.css ? ['html', 'css', 'js'] : ['html', 'js']
  const nome = titulo ?? id

  elemento.innerHTML = `
    <div class="pg-dentro">
    <div class="pg-codigo">
      <div class="pg-barra">
        <div class="pg-abas" role="tablist" aria-label="Arquivos do exemplo ${nome}">
          ${abas
            .map(
              (aba) => `<button type="button" role="tab" class="pg-aba" id="${id}-aba-${aba}"
                aria-controls="${id}-painel-${aba}" data-aba="${aba}">${rotuloDaAba(aba)}</button>`,
            )
            .join('')}
        </div>
        <button type="button" class="botao-ferramenta pg-copiar">${icones.copiar}Copiar</button>
      </div>
      ${abas
        .map(
          (aba) => `<div class="pg-painel" role="tabpanel" id="${id}-painel-${aba}"
            aria-labelledby="${id}-aba-${aba}" data-painel="${aba}"></div>`,
        )
        .join('')}
    </div>
    <div class="pg-resultado">
      <div class="pg-barra">
        <span class="pg-rotulo">Resultado</span>
        <button type="button" class="botao-ferramenta pg-rodar" title="Rodar de novo">${icones.rodar}Rodar</button>
        <button type="button" class="botao-ferramenta pg-restaurar" title="Voltar ao código original">${icones.restaurar}Restaurar</button>
      </div>
      <p class="pg-dica-teclado" hidden>Clique no resultado antes de usar o teclado.</p>
      <iframe class="pg-iframe" sandbox="allow-scripts" title="Resultado do exemplo ${nome}"></iframe>
      <div class="pg-console" aria-live="polite" aria-label="Console do exemplo ${nome}">
        <p class="pg-console-vazio">Console: nada por aqui. Mensagens de <code>console.log</code> e erros aparecem aqui.</p>
        <ol></ol>
      </div>
    </div>
    </div>
  `

  const iframe = elemento.querySelector('iframe')
  const lista = elemento.querySelector('.pg-console ol')
  const vazio = elemento.querySelector('.pg-console-vazio')
  const dicaTeclado = elemento.querySelector('.pg-dica-teclado')
  let temporizador

  const codigoAtual = () =>
    Object.fromEntries(abas.map((aba) => [aba, editores[aba].state.doc.toString()]))

  const rodar = () => {
    clearTimeout(temporizador)
    const codigo = codigoAtual()
    lista.replaceChildren()
    vazio.hidden = false
    dicaTeclado.hidden = !FUNCOES_DE_TECLADO.test(codigo.js)
    iframe.srcdoc = montarDocumentoDoPlayground({
      id,
      origem: location.origin,
      tema: temaDaPagina(),
      estiloBase: opcoes.estiloBase ?? true,
      ...codigo,
    })
  }

  const agendar = () => {
    clearTimeout(temporizador)
    temporizador = setTimeout(rodar, ATRASO_AO_DIGITAR)
  }

  /** @type {Record<string, import('@codemirror/view').EditorView>} */
  const editores = Object.fromEntries(
    abas.map((aba) => [
      aba,
      criarEditor({
        pai: elemento.querySelector(`[data-painel="${aba}"]`),
        codigo: original[aba],
        linguagem: aba,
        rotulo: `Código ${rotuloDaAba(aba)} do exemplo ${nome}`,
        aoMudar: agendar,
      }),
    ]),
  )

  // Abas: clique e setas do teclado. Começa no JS, onde fica a Borg.
  const botoesDasAbas = [...elemento.querySelectorAll('.pg-aba')]
  let abaAtiva = 'js'
  const ativarAba = (aba, focar = false) => {
    abaAtiva = aba
    botoesDasAbas.forEach((botao) => {
      const ativa = botao.dataset.aba === aba
      botao.setAttribute('aria-selected', String(ativa))
      botao.tabIndex = ativa ? 0 : -1
      if (ativa && focar) botao.focus()
    })
    elemento.querySelectorAll('.pg-painel').forEach((painel) => (painel.hidden = painel.dataset.painel !== aba))
  }
  botoesDasAbas.forEach((botao, indice) => {
    botao.addEventListener('click', () => ativarAba(botao.dataset.aba))
    botao.addEventListener('keydown', (evento) => {
      const passo = { ArrowRight: 1, ArrowLeft: -1 }[evento.key]
      if (!passo) return
      evento.preventDefault()
      const proxima = botoesDasAbas[(indice + passo + botoesDasAbas.length) % botoesDasAbas.length]
      ativarAba(proxima.dataset.aba, true)
    })
  })
  ativarAba(abaAtiva)

  ligarBotaoDeCopiar(elemento.querySelector('.pg-copiar'), () => editores[abaAtiva].state.doc.toString())

  const carregar = (codigo) => {
    abas.forEach((aba) => trocarCodigo(editores[aba], codigo[aba]?.trim() ?? ''))
    rodar()
  }
  const restaurar = () => carregar(original)

  elemento.querySelector('.pg-rodar').addEventListener('click', rodar)
  elemento.querySelector('.pg-restaurar').addEventListener('click', restaurar)

  const receber = ({ tipo, texto }) => {
    vazio.hidden = true
    const item = document.createElement('li')
    item.className = `pg-msg pg-msg-${tipo}`
    item.textContent = texto
    const explicacao = tipo === 'error' ? explicarErro(texto) : null
    if (explicacao) {
      const dica = document.createElement('span')
      dica.className = 'pg-msg-dica'
      dica.textContent = explicacao
      item.append(dica)
    }
    lista.append(item)
    lista.parentElement.scrollTop = lista.parentElement.scrollHeight
  }

  ativos.set(id, { iframe, receber, carregar, restaurar, rodar })
  rodar()
}

// Uma escuta só para todos os playgrounds. Confere se a mensagem veio do iframe certo.
addEventListener('message', ({ data, source }) => {
  if (data?.fonte !== 'borg-playground') return
  const ativo = ativos.get(data.id)
  if (ativo && source === ativo.iframe.contentWindow) ativo.receber(data)
})

// Trocar o tema roda os resultados de novo, com as cores novas.
const rodarTodos = () => ativos.forEach((ativo) => ativo.rodar())
document.addEventListener('borg:tema', rodarTodos)
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', rodarTodos)

const observador = new IntersectionObserver(
  (entradas) => {
    for (const { isIntersecting, target } of entradas) {
      if (!isIntersecting) continue
      observador.unobserve(target)
      const opcoes = pendentes.get(target.dataset.playground)
      if (opcoes) montar(target, opcoes)
    }
  },
  { rootMargin: '600px 0px' },
)

/**
 * Prepara todos os playgrounds dentro de `raiz`. Cada um é montado quando chega perto da tela.
 * @param {ParentNode} [raiz]
 */
export function ativarPlaygrounds(raiz = document) {
  raiz.querySelectorAll('[data-playground]').forEach((elemento) => observador.observe(elemento))
}
