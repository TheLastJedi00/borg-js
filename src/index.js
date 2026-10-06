/**
 * Borg JS: funções em português para reagir a cliques, mouse e teclado e mover elementos na tela.
 * @module borg
 */
export { aoClicar, aoClicarNaTela, aoMoverMouse } from './eventos/mouse.js'
export { aoPressionar, aoSoltar } from './teclado/eventos.js'
export { teclaPressionada } from './teclado/estado.js'
export { mostrar, esconder } from './helpers/visibilidade.js'
export { alternarClasse } from './helpers/classes.js'
export { mudarTexto } from './helpers/texto.js'
export { mudarEstilo } from './helpers/estilo.js'
export { elemento, posicao, tamanho, tamanhoDaTela } from './movimento/leitura.js'
export { moverPara, moverPor, manterNaTela, colidiu } from './movimento/posicionar.js'
export { estaNaTela, aoEntrarNaTela, aoSairDaTela } from './movimento/tela.js'
