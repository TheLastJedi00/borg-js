/**
 * APIs do navegador que o jsdom não tem e que alguns módulos do site usam assim que
 * carregam (por exemplo, `playground.js`). Importe este arquivo antes desses módulos.
 */
globalThis.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {} })

globalThis.IntersectionObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
