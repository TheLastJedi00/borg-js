import { describe, it, expect } from 'vitest'
import { htmlParaMarkdown } from '../../docs/js/ia/markdown.js'
import { URL_DO_SITE } from '../../docs/js/config.js'

describe('htmlParaMarkdown', () => {
  it('converte código, negrito, itálico e teclas', () => {
    expect(htmlParaMarkdown('<p>Use <code>aoClicar</code>, <strong>sempre</strong> com <em>calma</em> e <kbd>F12</kbd>.</p>')).toBe(
      'Use `aoClicar`, **sempre** com *calma* e `F12`.',
    )
  })

  it('decodifica entidades dentro do código', () => {
    expect(htmlParaMarkdown('<p><code>&lt;script type="module"&gt;</code></p>')).toBe('`<script type="module">`')
  })

  it('deixa links internos absolutos, com o domínio oficial', () => {
    expect(htmlParaMarkdown('<p>Veja <a href="./funcoes.html#aoClicar">aoClicar</a>.</p>')).toBe(
      `Veja [aoClicar](${URL_DO_SITE}/funcoes.html#aoClicar).`,
    )
    expect(htmlParaMarkdown('<p><a href="#problemas-comuns">abaixo</a></p>', { pagina: 'comecar.html' })).toBe(
      `[abaixo](${URL_DO_SITE}/comecar.html#problemas-comuns)`,
    )
    expect(htmlParaMarkdown('<p><a href="https://exemplo.com/x">fora</a></p>')).toBe('[fora](https://exemplo.com/x)')
  })

  it('converte títulos, descendo o nível quando pedido', () => {
    expect(htmlParaMarkdown('<h2>Seletores</h2><h3>Detalhe</h3>', { nivelExtra: 1 })).toBe('### Seletores\n\n#### Detalhe')
  })

  it('converte listas com e sem número', () => {
    expect(htmlParaMarkdown('<ul><li>um</li><li>dois</li></ul><ol><li>a</li><li>b</li></ol>')).toBe(
      '- um\n- dois\n\n1. a\n2. b',
    )
  })

  it('converte os blocos de código do site em blocos cercados, com a linguagem', () => {
    const html = '<div class="bloco-codigo" data-linguagem="js"><pre><code>if (a &lt; b) {\n  x()\n}</code></pre></div>'
    expect(htmlParaMarkdown(html)).toBe('```js\nif (a < b) {\n  x()\n}\n```')
  })

  it('converte avisos em citações com o rótulo em negrito', () => {
    const html = '<aside class="aviso aviso-cuidado"><strong>Cuidado</strong><div>Use <code>#</code> para id.</div></aside>'
    expect(htmlParaMarkdown(html)).toBe('> **Cuidado:** Use `#` para id.')
  })

  it('converte tabelas', () => {
    const html = '<table><thead><tr><th>Nome</th><th>Tipo</th></tr></thead><tbody><tr><td><code>x</code></td><td>número | texto</td></tr></tbody></table>'
    expect(htmlParaMarkdown(html)).toBe('| Nome | Tipo |\n| --- | --- |\n| `x` | número \\| texto |')
  })

  it('troca um playground pelo código dele, com o HTML, o CSS e o JS', () => {
    const exemplos = { 'exemplo-x': { html: '<p id="a"></p>', css: 'p { color: red; }', js: "mostrar('#a')" } }
    const html = '<div class="playground" data-playground="exemplo-x"></div>'
    expect(htmlParaMarkdown(html, { exemplos })).toBe(
      '```html\n<p id="a"></p>\n```\n\n```css\np { color: red; }\n```\n\n```js\nmostrar(\'#a\')\n```',
    )
  })

  it('junta espaços e quebras de linha do HTML', () => {
    expect(htmlParaMarkdown('<p>\n  Uma frase\n  quebrada.\n</p>\n\n<p>Outra.</p>')).toBe('Uma frase quebrada.\n\nOutra.')
  })

  it('não deixa tags HTML no resultado', () => {
    const resultado = htmlParaMarkdown('<section><div><span>texto</span> <br>solto</div></section>')
    expect(resultado).not.toMatch(/<\/?[a-z]/)
  })
})
