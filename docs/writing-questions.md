# Writing a question

Each topic (one station) lives in its own file, with a pool of prepared attempts at answering it. For every answer, the engine picks attempts from the pool, performs them with their written pauses and changes of mind, adds its own small irregularities, and slowly loses confidence until the answer stops.

This guide is about writing those attempts.

- [The file](#the-file)
- [The three tiers](#the-three-tiers)
- [Markup reference](#markup-reference)
- [What the engine adds on its own](#what-the-engine-adds-on-its-own)
- [Writing tips](#writing-tips)
- [Previewing](#previewing)

## The file

Questions live in `questions/`, grouped by language. The name of a topic is its path without `.js`: `questions/it/amare.js` is `it/amare`. A station shows it when its `topic` is set to that name (see [configuration.md](configuration.md)).

```js
HTBH.question({
  question: 'Come faccio ad amare?',

  // optional: timing, behaviour (see configuration.md)

  attempts: {
    confident: [ "…", "…" ],
    searching: [ "…", "…" ],
    fragile:   [ "…", "…" ],
    closing:   [ "…" ]          // optional
  }
});
```

The file is JavaScript, but you only need to follow three rules:

1. Each attempt is a piece of text in double quotes, followed by a comma.
2. If the text contains a double quote, write it as `\"`, or use other quote marks: `«…»`, `“…”`. Apostrophes (`'`) are fine.
3. `\n` starts a new line, `\n\n` starts a new paragraph.

Start from [`questions/_template.js`](../questions/_template.js). About 20 attempts are enough to start; the included questions have 45–60 each.

Attempts are drawn like cards from a shuffled deck, one deck per tier: an attempt does not come back until every other attempt in its tier has been used. The more you write, the longer the installation runs before anything repeats.

## Follow-up conversations

Follow-ups are **switched off by default**: each child asks a single question, again and again. With `followUps: true` in `config.js`, after the first answer the person keeps going instead. A topic can have several follow-up conversations in `followUps`; each time the topic comes up, one of them is played (they take turns like a shuffled deck). A conversation is a list of messages from the person, each with the machine's attempts at answering it. The last message usually closes the conversation; then the chat clears and the next topic begins.

```js
HTBH.question({
  question: 'Come faccio ad amare?',
  attempts: { /* the answer to the first question */ },

  followUps: [
    [                                            // conversation 1
      {
        ask: 'Sì, ma io intendo davvero. Come si fa?',
        attempts: {
          confident: [ "Hai ragione, provo a essere più concreto. [pause]Ecco tre cose pratiche: …" ],
          searching: [ "Forse il modo più semplice per dirlo è questo: [pause]amare è [long pause][erase 2 words][think]" ],
          fragile:   [ "Ci provo. [think]" ]
        }
      },
      {
        ask: 'Tu hai mai amato qualcuno?',
        attempts: { /* … */ }
      },
      {
        ask: 'Ok... grazie lo stesso',            // the goodbye
        seconds: [6, 12],                        // a short answer
        attempts: {
          confident: [ "Prego! Se hai altre domande sull'amore, [pause]sono qui per [long pause][erase word][think]" ],
          fragile:   [ "Prego. [think]" ]
        }
      }
    ],
    [ /* conversation 2 */ ],
    [ /* conversation 3 */ ]
  ]
});
```

- `ask` is what the person types. Write it the way a child or a teenager would: short, plain, sometimes without a full stop.
- `attempts` works exactly like the first answer: the same tiers and the same markup. Three to eight attempts per message are enough, because a follow-up answer is shorter.
- `seconds` (optional) is how long the answer keeps trying, like `timing.cycleSeconds`. Follow-ups default to `timing.followUpSeconds` (20–32 s); a goodbye works well with `[6, 12]`.
- Each answer in the conversation starts a little less confident than the one before it, so the machine gets more and more hesitant as the person insists.

Good follow-ups push where the formulas break: *“Non ho capito niente”*, *“Sì, ma io intendo davvero”*, and above all questions about the machine itself (*“Tu hai mai amato qualcuno?”*, *“Ma tu pensi?”*, *“Tu sogni?”*), where the stock reply (*“Come intelligenza artificiale non provo emozioni, ma…”*) is the start of the failure. Even the goodbye should not quite manage to finish.

## The three tiers

Every answer starts with full confidence and ends with none. Which pool the next attempt comes from depends on how far into the answer it is:

```
time ──────────────────────────────────────────────→
confident  ████████████▓▓▓▓▓▓▒▒▒░░
searching       ░░▒▒▒▓▓▓▓▓████▓▓▓▓▒▒▒░░
fragile                    ░░▒▒▒▓▓▓▓▓████████
                                              closing
```

| Tier | When | Voice |
|---|---|---|
| `confident` | the beginning. The first attempt of each answer always comes from here | The assistant at its most fluent. *“Ottima domanda!”*, *“Ecco alcuni aspetti da considerare:”*, numbered lists, **bold** headings, *“In generale…”*, *“Dipende da…”* |
| `searching` | the middle | It changes strategy: an example, a definition, a quote, a philosopher, rephrasing the question, turning the question on itself |
| `fragile` | the end | One to five words. The beginning of a sentence that does not continue |
| `closing` | optional, once, as the very last attempt | The last words of the answer, where the cursor waits before it stops |

Attempts follow each other in the same answer: each one starts a new paragraph (or, after a full stop, sometimes continues on the same line). So an answer reads as a sequence of fresh starts that get shorter and shorter.

## Markup reference

Commands go in square brackets, inside the text. Case does not matter.

### Pauses

| Command | Effect |
|---|---|
| `[pause]` | short pause, about 0.7 s (`timing.shortPause`) |
| `[long pause]` | about 2 s (`timing.longPause`) |
| `[think]` | 4–5.5 s with the cursor breathing (`timing.thinkPause`) |
| `[pause 3]` | exactly 3 seconds |

Pauses get a little longer as confidence drops.

### Changes of mind

The writing only goes forward, like a real chat assistant: nothing on screen is ever deleted. The erase commands mark the places where the machine changes its mind. **The sentence is abandoned there, unfinished, and whatever follows in the attempt starts again in a new paragraph** (with a capital letter).

| Command | Effect (default) |
|---|---|
| `[erase word]`, `[erase 3 words]`, `[erase 12]` | abandon the sentence here; what follows starts over |
| `[erase sentence]`, `[erase line]`, `[erase half]`, `[erase all]` | the same |
| `[retype]` | the same |

The number in a command only matters if erasing is switched on (`behaviour.backspace: true`, see [configuration.md](configuration.md)). Then the machine really deletes: the last word, three words, 12 characters, back to the previous sentence, the current line, half of the attempt, or everything the attempt wrote, and `[retype]` erases the last word and types it again identical. Writing the numbers carefully keeps both modes possible.

### Typing

| Command | Effect |
|---|---|
| `[slow]` | half speed until the end of the attempt or the next speed command |
| `[very slow]` | about a third of the speed |
| `[normal]` | back to normal speed |
| `[fast]` | faster |
| `[speed 0.4]` | any multiplier |
| `**text**` | bold, as an assistant would format a heading |

Lines that start with `1. ` or `- ` are laid out as list items.

### An example, step by step

```
"Amare significa innanzitutto [pause][erase word][pause]prendersi cura di qualcuno, [pause]accettarlo per quello che è e [long pause][erase 4 words][think]"
```

1. Types *“Amare significa innanzitutto”*: fast and fluent if it is early in the answer
2. Pauses. The sentence stays unfinished
3. A new paragraph: *“Prendersi cura di qualcuno, accettarlo per quello che è e”*
4. A long pause, then the cursor waits for 4–5 seconds
5. The next attempt starts below

## What the engine adds on its own

You do not write these; they happen on top of what you wrote, more often as confidence drops. All of them can be tuned in `behaviour` (see [configuration.md](configuration.md)).

| Behaviour | What happens | Setting |
|---|---|---|
| Streaming | while confident, text arrives in quick multi-letter chunks, like a language model. Later, one letter at a time | `streaming` |
| Slowing down | typing speed falls from `typingSpeed` to `minTypingSpeed` across the answer | `timing` |
| Punctuation | a breath after commas, a longer one after full stops | — |
| Hesitation | a small pause before a word | `hesitation` |
| Abort | the attempt stops after a random word and is left unfinished | `abortChance` |
| Long think | a 4–5 s silence between attempts | `longThink` |

Because an attempt can stop after any word, the same text produces many different fragments. A long confident attempt might be seen complete, or only its first six words.

## Writing tips

**Start from real answers.** Ask an actual assistant how to cook rice or how to learn a language. Collect the scaffolding: *“Ottima domanda!”*, *“Ecco una guida passo passo:”*, *“Non esiste una risposta unica, ma…”*, *“Molti esperti consigliano…”*. These are the strongest material, because they visibly fit every question except this one.

**Fail with grammar, not with noise.** Every fragment on screen should be a believable beginning of a sentence. No random letters, no glitches, no *ERRORE*. If it stops, it stops at a place where a person could have stopped.

**Stop just before the answer.** The most powerful moment is right before the word that would actually say something: *“Per amare un'altra persona è importante prima”* … and then a new paragraph about something else.

**Let the formula show.** Lists that never reach item 2. *“Ecco cinque passi:”* followed by step 1 and nothing else. A colon left hanging.

**Start over with the same words.** `[erase word][pause]` followed by the same word gives a new paragraph that begins exactly where the last one stopped: a stammer, without a single deleted letter.

**Turn the question around, rarely.** A few searching attempts can slip: *“Chi sono io? Sono un assistente che…”*. Keep these few; they work because they are unexpected.

**Do not explain.** The machine never says it has failed or that the question is too hard. Keep away from *“Non lo so”* unless it is cut off before it is complete (*“Non lo [long pause][erase 2 words]”*).

**Keep fragile attempts tiny.** A single word with `[think]` after it is often the strongest thing on screen.

## Previewing

Open your topic with a faster clock and the debug overlay:

```
index.html?topic=it/perdonare&speed=3&debug
```

Press **N** to end the answer and get a new one.

To see how a question behaves over many answers, run it on a virtual clock:

```bash
node tools/simulate.js it/perdonare 300
```

```
question       it/perdonare  (300 answers)
answer length  avg 54.6s   min 41.0s   max 73.7s
attempts/answer avg 4.8   min 3   max 8
tiers          confident 300   searching 512   fragile 451   closing 300
```

Unknown commands (a typo like `[pasue]`) are printed as warnings in the browser console and in the simulator.
