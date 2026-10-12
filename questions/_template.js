/*
 * Question template — copy this file to add a question to the conversation.
 *
 *   1. Copy it, e.g. to questions/it/perdonare.js
 *   2. Change the question and write the attempts
 *   3. Add 'it/perdonare' to the conversation list in config.js
 *   4. Preview it alone: index.html?only=it/perdonare&speed=3&debug
 *
 * Full guide: docs/writing-questions.md
 * Every option below is optional except `question` and `attempts`.
 */
HTBH.question({
  language: 'it',
  question: 'Come faccio a perdonare?',

  // How it moves. Delete what you don't need: defaults are in docs/configuration.md
  timing: {
    cycleSeconds: [30, 50],            // how long the answer keeps trying, min–max seconds
    typingSpeed: 45,                   // chars/second while it is still confident
    minTypingSpeed: 10,                // chars/second when confidence is gone
    shortPause: 0.7,                   // [pause]
    longPause: 2.0,                    // [long pause]
    thinkPause: [4, 5.5]               // [think]
  },

  behaviour: {
    abortChance: 0.25,                 // 0–1: how often an attempt stops midway
    hesitation: 0.08,                  // 0–1: micro-pause before a word
    longThink: 0.18                    // 0–1: long silent cursor between attempts
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
