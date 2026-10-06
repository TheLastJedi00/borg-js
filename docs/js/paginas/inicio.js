import { iniciarPagina } from '../layout.js'
import { linhaDeImport } from '../config.js'
import { ligarBotaoDeCopiar } from '../util.js'
import { icones } from '../icones.js'

/** A coruja da logo, maior e com partes separadas para reagir. */
const CORUJA = `
  <svg class="coruja" id="coruja" viewBox="0 0 128 128" role="img"
    aria-label="Coruja da Borg JS. Os olhos seguem o mouse, ela pisca quando você clica e mostra as teclas que você aperta.">
    <defs>
      <linearGradient id="coruja-gradiente" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2DD4BF" />
        <stop offset="1" stop-color="#38BDF8" />
      </linearGradient>
    </defs>
    <path fill="url(#coruja-gradiente)" d="M22 22 L46 40 Q64 34 82 40 L106 22 L104 70 Q102 114 64 116 Q26 114 24 70 Z" />
    <g class="olho">
      <circle cx="46" cy="68" r="17" fill="#FFFFFF" />
      <circle class="pupila" cx="46" cy="68" r="8" fill="#0B2530" />
    </g>
    <g class="olho">
      <circle cx="82" cy="68" r="17" fill="#FFFFFF" />
      <circle class="pupila" cx="82" cy="68" r="8" fill="#0B2530" />
    </g>
    <path fill="#0B2530" d="M57 88 H71 L64 99 Z" />
  </svg>
`

const conteudo = iniciarPagina()

conteudo.innerHTML = `
  <section class="heroi">
    <div class="heroi-texto">
      <h1>Faça sua página reagir a cliques, ao mouse e ao teclado.</h1>
      <p class="heroi-sub">
        A Borg JS é uma biblioteca com funções em português, feita para quem está aprendendo.
        Você escreve o que acontece; ela cuida do DOM.
      </p>
      <div class="heroi-acoes">
        <a class="botao botao-principal" href="./comecar.html">Começar agora</a>
        <a class="botao botao-secundario" href="./professores.html">Sou professor</a>
      </div>
      <div class="heroi-import">
        <code>${linhaDeImport(['aoClicar', 'mostrar'])}</code>
        <button type="button" class="botao-icone" id="copiar-import" aria-label="Copiar o import">${icones.copiar}</button>
      </div>
    </div>
    <div class="heroi-palco">
      <p class="balao" id="balao" hidden aria-live="polite"></p>
      ${CORUJA}
      <p class="heroi-convite">Mova o mouse, clique em qualquer lugar ou aperte uma tecla.</p>
    </div>
  </section>
`

ligarBotaoDeCopiar(document.getElementById('copiar-import'), () => linhaDeImport(['aoClicar', 'mostrar']))
