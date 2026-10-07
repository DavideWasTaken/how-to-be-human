# Writing a station

A station is one question and a pool of prepared attempts at answering it. The engine picks attempts from the pool, performs them with their written hesitations, adds its own small irregularities, and slowly loses confidence over the course of each cycle.

This guide is about writing those attempts.

- [The file](#the-file)
- [The three tiers](#the-three-tiers)
- [Markup reference](#markup-reference)
- [What the engine adds on its own](#what-the-engine-adds-on-its-own)
- [Writing tips](#writing-tips)
- [Previewing](#previewing)

## The file

Stations live in `stations/`, grouped by language. The station name is the path without `.js`: `stations/it/amare.js` is the station `it/amare`.

```js
HTBH.station({
  language: 'it',
  question: 'Come faccio ad amare?',

  // optional: timing, behaviour, display (see configuration.md)

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

Start from [`stations/_template.js`](../stations/_template.js). About 20 attempts are enough to start; the included stations have 50–60 each.

Attempts are drawn like cards from a shuffled deck, one deck per tier: an attempt does not come back until every other attempt in its tier has been used, across cycles. The more you write, the longer the installation runs before anything repeats.

## The three tiers

Each cycle starts with full confidence and ends with none. Which pool the next attempt comes from depends on where the cycle is:

```
time ──────────────────────────────────────────────→
confident  ████████████▓▓▓▓▓▓▒▒▒░░
searching       ░░▒▒▒▓▓▓▓▓████▓▓▓▓▒▒▒░░
fragile                    ░░▒▒▒▓▓▓▓▓████████
                                              closing
```

| Tier | When | Voice |
|---|---|---|
| `confident` | the beginning. The first attempt of each cycle always comes from here | The assistant at its most fluent. *“Great question!”*, *“Here are a few things to consider:”*, numbered lists, **bold** headings, *“In general…”*, *“It depends on…”* |
| `searching` | the middle | It changes strategy: an example, a definition, a quote, a philosopher, rephrasing the question, turning the question on itself |
| `fragile` | the end | One to five words. The beginning of a sentence that does not continue |
| `closing` | optional, once, as the very last attempt | Whatever is on screen while the cursor waits before everything is erased |

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

### Erasing

| Command | Effect |
|---|---|
| `[erase word]` | the last word (punctuation attached to it goes too) |
| `[erase 3 words]` | the last three words |
| `[erase 12]` | the last 12 characters |
| `[erase sentence]` | back to the end of the previous sentence |
| `[erase line]` | the current line |
| `[erase half]` | roughly the second half of this attempt |
| `[erase all]` | everything this attempt has written |

An erase never goes further back than the start of the current attempt.

### Typing

| Command | Effect |
|---|---|
| `[slow]` | half speed until the end of the attempt or the next speed command |
| `[very slow]` | about a third of the speed |
| `[normal]` | back to normal speed |
| `[fast]` | faster |
| `[speed 0.4]` | any multiplier |
| `[retype]` | erases the last word and types it again, identical |
| `**text**` | bold, as an assistant would format a heading |

Lines that start with `1. ` or `- ` are laid out as list items.

### Endings

| Command | Effect |
|---|---|
| `[keep]` | this attempt is never erased by the engine; the next one is written after it |

If an attempt ends with `[erase all]` it is gone, and the next attempt starts on an empty screen. If it ends any other way, the engine decides what happens: usually it erases it, sometimes it takes half of it back, sometimes it leaves it there and the next attempt starts a new paragraph below.

### An example, step by step

```
"Non esiste una formula universale, ma [think][erase word]"
```

1. Types *“Non esiste una formula universale, ma ”*: fast and fluent if it is early in the cycle
2. The cursor waits for 4–5 seconds
3. *“ma”* is deleted
4. The engine decides: erase all of it, take back half, or leave *“Non esiste una formula universale, ”* hanging on screen

## What the engine adds on its own

You do not write these; they happen on top of what you wrote, more often as confidence drops. All of them can be tuned or switched off in `behaviour` (see [configuration.md](configuration.md)).

| Behaviour | What happens | Setting |
|---|---|---|
| Streaming | while confident, text arrives in quick multi-letter chunks, like a language model. Later, one letter at a time | `streaming` |
| Slowing down | typing speed falls from `typingSpeed` to `minTypingSpeed` across the cycle | `timing` |
| Punctuation | a breath after commas, a longer one after full stops | — |
| Hesitation | a small pause before a word | `hesitation` |
| Retype | a word is erased and typed again identical | `retypeWord` |
| Abort | the attempt stops at a random point, waits, is erased | `abortChance` |
| Late regret | the attempt ends, a couple of seconds pass, half of it is erased | `erasePartial` |
| Long think | a 4–5 s silence between attempts | `longThink` |
| Retraction | if kept text grows too long, the last paragraph is pulled back | `maxKeptChars` |

Because an attempt can be aborted anywhere, the same text produces many different fragments. A long confident attempt might be seen complete, or only its first six words.

## Writing tips

**Start from real answers.** Ask an actual assistant how to cook rice or how to learn a language. Collect the scaffolding: *“Great question!”*, *“Here's a step-by-step guide:”*, *“There's no single answer, but…”*, *“Many experts recommend…”*. These are the strongest material, because they visibly fit every question except this one.

**Fail with grammar, not with noise.** Every fragment on screen should be a believable beginning of a sentence. No random letters, no glitches, no *ERROR*. If it stops, it stops at a place where a person could have stopped.

**Stop just before the answer.** The most powerful moment is right before the word that would actually say something: *“Per amare un'altra persona è importante prima ”* … pause … erase.

**Let the formula show.** Lists that never reach item 2. *“Here are five steps:”* followed by step 1 and nothing else. A colon left hanging.

**Erase and come back the same.** `[erase word][pause]` followed by the same word typed again says more than a new word would.

**Turn the question around, rarely.** A few searching attempts can slip: *“Who am I? I'm an assistant that…”*. Keep these few; they work because they are unexpected.

**Do not explain.** The machine never says it has failed or that the question is too hard. Keep away from *“I don't know”* unless it is cut off before it is complete (*“I don't [long pause][erase 2 words]”*).

**Keep fragile attempts tiny.** A single word with `[think]` after it is often the strongest thing on screen.

## Previewing

Open the station with a faster clock and the debug overlay:

```
index.html?station=it/felice&speed=3&debug
```

Press **N** to skip to a new cycle.

To see how a station behaves over many hours, run it on a virtual clock:

```bash
node tools/simulate.js it/felice 300
```

```
station        it/felice  (300 cycles)
cycle length   avg 62.3s   min 41.8s   max 86.1s
attempts/cycle avg 4.4   min 3   max 7
tiers          confident 441   searching 270   fragile 301   closing 300
```

Unknown commands (a typo like `[pasue]`) are printed as warnings in the browser console and in the simulator.
