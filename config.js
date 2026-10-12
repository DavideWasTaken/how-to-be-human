/*
 * How to Be Human — configuration.
 *
 * The page is one endless chat. The questions below are asked one after the
 * other, in this order; when the last one has been answered, the first one
 * comes back. Each question lives in its own file in questions/.
 *
 * Anything in `timing`, `behaviour`, `display` or `sound` applies to every
 * question; a question file can still override timing and behaviour.
 * All options: docs/configuration.md
 */
window.HTBH_CONFIG = {
  language: 'it',           // which conversation below is used (index.html?lang=en to switch)

  conversation: {
    it: ['it/pensare', 'it/chi-sono', 'it/amare', 'it/felice', 'it/vero', 'it/paura', 'it/sognare'],
    en: ['en/think', 'en/who-am-i', 'en/love', 'en/happy', 'en/true', 'en/afraid', 'en/dream']
  },

  shuffle: false,           // true: a different order every round

  timing: {},
  behaviour: {},            // e.g. { backspace: true } to let it erase as well
  display: {},              // e.g. { layout: 'minimal' }
  sound: {}                 // e.g. { volume: 0.2 } or { enabled: false }
};
