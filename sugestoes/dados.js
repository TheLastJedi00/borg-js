/**
 * Fonte única do autocomplete da Borg: a extensão do VS Code e o playground do site
 * são gerados a partir desta lista.
 *
 * `modelo` usa a sintaxe de snippet do VS Code: `${1:texto}` é um campo editável,
 * `${0:texto}` é onde o cursor termina e `\t` é um nível de indentação.
 * Os campos não podem ter chaves dentro (o CodeMirror não aceita).
 * `modeloNoInicioDaLinha` é usado quando a linha ainda está vazia antes da palavra.
 *
 * @typedef {{
 *   nome: string,
 *   assinatura: string,
 *   descricao: string,
 *   modelo: string,
 *   modeloNoInicioDaLinha?: string,
 * }} Sugestao
 */

/**
 * Monta o modelo de uma função `ao*`: a chamada com uma arrow function e `// reação` no corpo.
 * @param {string} inicio - O começo da chamada até os parâmetros da arrow function, inclusive.
 * @returns {string}
 */
function comReacao(inicio) {
  return `${inicio} => {\n\t\${0:// reação}\n})`
}

/** @type {Sugestao[]} */
export const SUGESTOES = [
  {
    nome: 'aoClicar',
    assinatura: 'aoClicar(seletor, callback)',
    descricao: 'Executa uma função sempre que o elemento for clicado. Retorna parar().',
    modelo: comReacao("aoClicar('${1:#meu-seletor}', (${2:elemento})"),
  },
  {
    nome: 'aoClicarNaTela',
    assinatura: 'aoClicarNaTela(callback)',
    descricao: 'Executa uma função a cada clique em qualquer lugar da página, com a posição { x, y }.',
    modelo: comReacao('aoClicarNaTela(({ x, y })'),
  },
  {
    nome: 'aoMoverMouse',
    assinatura: 'aoMoverMouse(callback)',
    descricao: 'Executa uma função sempre que o mouse se mover, com a posição { x, y }.',
    modelo: comReacao('aoMoverMouse(({ x, y })'),
  },
  {
    nome: 'aoPressionar',
    assinatura: 'aoPressionar(tecla, callback)',
    descricao: "Executa uma função quando a tecla é pressionada. Ex.: 'espaço', 'seta cima', 'a'.",
    modelo: comReacao("aoPressionar('${1:espaço}', (${2:tecla})"),
  },
  {
    nome: 'aoSoltar',
    assinatura: 'aoSoltar(tecla, callback)',
    descricao: 'Executa uma função quando a tecla é solta.',
    modelo: comReacao("aoSoltar('${1:espaço}', (${2:tecla})"),
  },
  {
    nome: 'teclaPressionada',
    assinatura: 'teclaPressionada(tecla)',
    descricao: 'Retorna true enquanto a tecla está pressionada. Bom para jogos.',
    modelo: "teclaPressionada('${1:seta direita}')$0",
  },
  {
    nome: 'mostrar',
    assinatura: 'mostrar(seletor)',
    descricao: 'Torna o elemento visível.',
    modelo: "mostrar('${1:#meu-seletor}')$0",
  },
  {
    nome: 'esconder',
    assinatura: 'esconder(seletor)',
    descricao: 'Esconde o elemento.',
    modelo: "esconder('${1:#meu-seletor}')$0",
  },
  {
    nome: 'alternarClasse',
    assinatura: 'alternarClasse(seletor, classe)',
    descricao: 'Adiciona a classe se ela não existir, e remove se existir.',
    modelo: "alternarClasse('${1:#meu-seletor}', '${2:ativo}')$0",
  },
  {
    nome: 'mudarTexto',
    assinatura: 'mudarTexto(seletor, texto)',
    descricao: 'Troca o texto do elemento.',
    modelo: "mudarTexto('${1:#meu-seletor}', '${2:Olá!}')$0",
  },
  {
    nome: 'mudarEstilo',
    assinatura: 'mudarEstilo(seletor, propriedade, valor)',
    descricao: "Altera um estilo CSS do elemento. Números viram px. Ex.: 'background-color', 'width'.",
    modelo: "mudarEstilo('${1:#meu-seletor}', '${2:propriedade}', '${3:valor}')$0",
  },
  {
    nome: 'elemento',
    assinatura: 'elemento(seletor)',
    descricao: 'Pega o elemento da página (como document.querySelector) para usar em qualquer função da Borg.',
    modelo: "elemento('${1:#meu-seletor}')$0",
    modeloNoInicioDaLinha: "const ${1:meuElemento} = elemento('${2:#meu-seletor}')$0",
  },
  {
    nome: 'posicao',
    assinatura: 'posicao(seletor)',
    descricao: 'Lê a posição atual { x, y } do elemento na tela, em pixels.',
    modelo: "posicao('${1:#meu-seletor}')$0",
  },
  {
    nome: 'tamanho',
    assinatura: 'tamanho(seletor)',
    descricao: 'Lê o tamanho { largura, altura } do elemento, em pixels.',
    modelo: "tamanho('${1:#meu-seletor}')$0",
  },
  {
    nome: 'tamanhoDaTela',
    assinatura: 'tamanhoDaTela()',
    descricao: 'Lê o tamanho { largura, altura } da janela visível, em pixels.',
    modelo: 'tamanhoDaTela()$0',
  },
  {
    nome: 'moverPara',
    assinatura: 'moverPara(seletor, { x, y })',
    descricao: 'Coloca o elemento em um ponto da tela, em pixels a partir do canto superior esquerdo.',
    modelo: "moverPara('${1:#meu-seletor}', { x: ${2:0}, y: ${3:0} })$0",
  },
  {
    nome: 'moverPor',
    assinatura: 'moverPor(seletor, { x, y })',
    descricao: 'Desloca o elemento a partir de onde ele está. Negativos vão para a esquerda e para cima.',
    modelo: "moverPor('${1:#meu-seletor}', { x: ${2:10}, y: ${3:0} })$0",
  },
  {
    nome: 'manterNaTela',
    assinatura: 'manterNaTela(seletor)',
    descricao: 'Traz o elemento de volta para dentro da janela. Retorna true se bateu na borda.',
    modelo: "manterNaTela('${1:#meu-seletor}')$0",
  },
  {
    nome: 'colidiu',
    assinatura: 'colidiu(seletorA, seletorB)',
    descricao: 'Retorna true se os dois elementos estão se encostando.',
    modelo: "colidiu('${1:#meu-seletor}', '${2:#outro-seletor}')$0",
  },
  {
    nome: 'estaNaTela',
    assinatura: 'estaNaTela(seletor)',
    descricao: 'Retorna true se o elemento aparece na tela agora, mesmo que só em parte.',
    modelo: "estaNaTela('${1:#meu-seletor}')$0",
  },
  {
    nome: 'aoEntrarNaTela',
    assinatura: 'aoEntrarNaTela(seletor, callback)',
    descricao: 'Executa uma função quando o elemento aparece na tela (ao rolar a página, por exemplo).',
    modelo: comReacao("aoEntrarNaTela('${1:#meu-seletor}', (${2:elemento})"),
  },
  {
    nome: 'aoSairDaTela',
    assinatura: 'aoSairDaTela(seletor, callback)',
    descricao: 'Executa uma função quando o elemento deixa de aparecer na tela.',
    modelo: comReacao("aoSairDaTela('${1:#meu-seletor}', (${2:elemento})"),
  },
]

/**
 * Escolhe o modelo certo para onde o cursor está. No começo da linha, `elemento` já
 * cria a variável; depois de um `=` ou dentro de uma chamada, entra só a chamada.
 * @param {Sugestao} sugestao
 * @param {string} textoAntesNaLinha - O texto da linha antes da palavra que está sendo completada.
 * @returns {string}
 */
export function escolherModelo(sugestao, textoAntesNaLinha) {
  if (sugestao.modeloNoInicioDaLinha && textoAntesNaLinha.trim() === '') {
    return sugestao.modeloNoInicioDaLinha
  }
  return sugestao.modelo
}
