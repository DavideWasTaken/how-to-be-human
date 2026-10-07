/*
 * Station template — copy this file to start a new station.
 *
 *   1. Copy it, e.g. to stations/it/perdonare.js
 *   2. Change the question and write the attempts
 *   3. Open index.html?station=it/perdonare  (add &speed=3&debug to preview fast)
 *
 * Full guide: docs/writing-stations.md
 * Every option below is optional except `question` and `attempts`.
 */
HTBH.station({
  language: 'it',                      // it, en, fr, es, de — sets the interface text
  question: 'Come faccio a perdonare?',

  // How it moves. Delete what you don't need: defaults are in docs/configuration.md
  timing: {
    cycleSeconds: [30, 50],            // how long it keeps trying, min–max seconds
    typingSpeed: 45,                   // chars/second while it is still confident
    minTypingSpeed: 10,                // chars/second when confidence is gone
    eraseSpeed: 26,
    shortPause: 0.7,                   // [pause]
    longPause: 2.0,                    // [long pause]
    thinkPause: [4, 5.5],              // [think]
    questionHold: [3, 5]               // only the question, between cycles
  },

  behaviour: {
    eraseAttempt: 0.6,                 // 0–1: how often a finished attempt is erased
    erasePartial: 0.2,                 // 0–1: how often half of it is taken back
    abortChance: 0.25,                 // 0–1: how often an attempt stops midway
    hesitation: 0.08,                  // 0–1: micro-pause before a word
    retypeWord: 0.035,                 // 0–1: erase a word, type it again identical
    longThink: 0.18                    // 0–1: long silent cursor between attempts
  },

  display: {
    layout: 'chat',                    // 'chat' (assistant interface) or 'minimal' (only the words, large)
    textSize: 1                        // 1.2 = 20% bigger
  },

  attempts: {
    // At the start: fluent, helpful, the usual formulas.
    confident: [
      "Perdonare è un processo che richiede [pause]tempo e consapevolezza. [slow]Il primo passo è [long pause][erase all]",
      "Ottima domanda! Ecco alcuni passaggi per imparare a perdonare:\n\n1. **Riconosci il dolore.** [pause]Prima di perdonare [long pause][erase all]"
    ],

    // Midway: changes strategy, tries examples, definitions, quotes.
    searching: [
      "Proviamo con un esempio. [pause]Pensa a un momento in cui [long pause][erase 4 words][think]"
    ],

    // Near the end: short, almost nothing.
    fragile: [
      "Perdonare [think]",
      "Puoi [long pause][erase all]"
    ],

    // Optional: the last thing written before everything is erased.
    closing: [
      "Perdono [long pause]"
    ]
  }
});
