# Changelog

A versão da extensão é independente da versão da biblioteca e segue [SemVer](https://semver.org/lang/pt-BR/).

## 0.1.1

- **Correção:** o `import` automático agora usa o domínio certo, `https://borg.lenoborges.com.br/borg.mjs`. Na 0.1.0 ele apontava para `borg.lenoborges.br`, que não existe, e a biblioteca não carregava.
- Nova logo da coruja no ícone da extensão.

## 0.1.0

- Autocomplete de todas as funções da Borg JS, com a chamada inteira: seletor genérico `'#meu-seletor'`, arrow function com `// reação` no corpo e campos que a tecla Tab percorre.
- `import` da Borg criado ou completado ao aceitar uma sugestão.
- Em `<script>` sem `type="module"`, a chamada usa o objeto global `Borg`.
- Nomes de tecla sugeridos dentro das aspas de `aoPressionar`, `aoSoltar` e `teclaPressionada`.
