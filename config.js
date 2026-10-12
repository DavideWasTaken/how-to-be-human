/*
 * How to Be Human — configuration.
 *
 * A station is one topic: a child asks the question, the assistant answers,
 * the chat clears, and the same question is asked again, with a different
 * answer every time. Each topic lives in its own file in questions/.
 *
 * On the Raspberry Pi the topic is usually chosen on the SD card instead
 * (how-to-be-human.txt, see docs/raspberry-pi.md). In a browser:
 * index.html?topic=it/paura
 *
 * Anything in `timing`, `behaviour`, `display` or `sound` applies to every
 * topic; a question file can still override timing and behaviour.
 * All options: docs/configuration.md
 */
window.HTBH_CONFIG = {
  // This station's topic:
  //   it/pensare  it/chi-sono  it/amare  it/felice  it/vero  it/paura  it/sognare
  //   en/think    en/who-am-i  en/love   en/happy   en/true  en/afraid en/dream
  // Leave it empty ('') to play every topic of `conversation` in turn.
  topic: 'it/amare',

  language: 'it',           // interface language when no topic is set

  conversation: {
    it: ['it/pensare', 'it/chi-sono', 'it/amare', 'it/felice', 'it/vero', 'it/paura', 'it/sognare'],
    en: ['en/think', 'en/who-am-i', 'en/love', 'en/happy', 'en/true', 'en/afraid', 'en/dream']
  },

  shuffle: false,           // with several topics: a different order every round

  // true: after the first answer the child keeps writing (insists, asks the
  // machine about itself, says goodbye) using the topic's `followUps`
  followUps: false,

  timing: {},
  behaviour: {},            // e.g. { backspace: true } to let it erase as well
  display: {},              // e.g. { layout: 'minimal' }
  sound: {}                 // e.g. { volume: 0.2 } or { enabled: false }
};
