# Configuration

Everything is set in [`config.js`](../config.js). Settings are layered, each layer overriding the one before:

1. **Defaults**, built into `src/engine.js`
2. **`config.js`**: applies to the whole page and every question
3. **A question file**: can override `timing` and `behaviour` for that question only

Write only what you want to change. Values written as `[a, b]` are ranges: a random value between `a` and `b` is picked each time.

## `config.js`

```js
window.HTBH_CONFIG = {
  language: 'it',

  conversation: {
    it: ['it/pensare', 'it/chi-sono', 'it/amare', 'it/felice', 'it/vero', 'it/paura', 'it/sognare'],
    en: ['en/think', 'en/who-am-i', 'en/love', 'en/happy', 'en/true', 'en/afraid', 'en/dream']
  },

  shuffle: false,

  timing: {},
  behaviour: {},
  display: {},
  sound: {}
};
```

| Setting | Meaning |
|---|---|
| `language` | Which conversation is played, and the language of the interface text (header, input placeholder, footnote). `?lang=en` in the address overrides it |
| `conversation` | For each language, the questions in the order they are asked. Each name is a file in `questions/` without `.js`. After the last one, it starts again from the first |
| `shuffle` | `true`: a new random order every round |

A question file can override `timing` and `behaviour` for itself:

```js
HTBH.question({
  question: 'Come faccio ad amare?',
  timing: { typingSpeed: 30, cycleSeconds: [40, 60] },
  attempts: { /* … */ }
});
```

## `timing`

All values in seconds unless noted.

| Setting | Default | Meaning |
|---|---|---|
| `cycleSeconds` | `[30, 50]` | How long an answer keeps starting new attempts. The last attempt and the closing words add a little, so an answer lasts about 40–75 s |
| `typingSpeed` | `45` | Characters per second at full confidence |
| `minTypingSpeed` | `10` | Characters per second when confidence has run out |
| `shortPause` | `0.7` | Length of `[pause]` |
| `longPause` | `2.0` | Length of `[long pause]` |
| `thinkPause` | `[4, 5.5]` | Length of `[think]` and of long silences between attempts |
| `firstWordDelay` | `[1.2, 2.6]` | The pulsing dot before the first word of an answer |
| `betweenAttempts` | `[0.5, 1.6]` | Pause between one attempt and the next |
| `finalHold` | `[2, 4]` | The cursor waits on the last words before the answer ends |
| `followUpSeconds` | `[20, 32]` | Like `cycleSeconds`, for the answers to the person's follow-up messages. A single message can set its own with `seconds` |
| `nextFollowUp` | `[2.5, 4.5]` | After an answer, before the person writes again (set in `config.js`) |
| `nextQuestion` | `[5, 8]` | After a topic's conversation closes, before the next topic begins (set in `config.js`) |
| `eraseSpeed` | `26` | Only with `backspace: true`. Characters per second when deleting |
| `lateRegretDelay` | `[1.6, 2.6]` | Only with `backspace: true`. Wait before half of a finished sentence is taken back |

## `behaviour`

Chances are numbers from `0` (never) to `1` (always). Most of them grow as confidence drops.

| Setting | Default | Meaning |
|---|---|---|
| `backspace` | `false` | `false`: the writing only goes forward, like a chat assistant; changes of mind leave the sentence unfinished and start a new paragraph. `true`: it also deletes, retypes and takes sentences back |
| `abortChance` | `0.25` | Chance an attempt stops after a random word |
| `hesitation` | `0.08` | Chance of a small pause before each word |
| `longThink` | `0.18` | Chance of a long silence between attempts |
| `streaming` | `true` | While confident, text arrives in chunks like a language model. `false` = always letter by letter |
| `confidenceCurve` | `1` | Shape of the confidence drop. `2` loses it early, `0.5` holds on until late |
| `eraseAttempt` | `0.6` | Only with `backspace: true`. When an attempt ends, chance it is erased completely |
| `erasePartial` | `0.2` | Only with `backspace: true`. …chance half of it is taken back instead |
| `retypeWord` | `0.035` | Only with `backspace: true`. Chance a word is erased and typed again identical |
| `maxKeptChars` | `420` | Only with `backspace: true`. When the text grows past this, paragraphs are pulled back |
| `finalErase` | `'backspace'` | Only with `backspace: true`. How the answer disappears at the end: `'backspace'`, `'fade'` or `'instant'` |

## `display`

Set in `config.js` only.

| Setting | Default | Meaning |
|---|---|---|
| `layout` | `'chat'` | `'chat'`: a familiar AI assistant interface. `'minimal'`: only the questions and the answers, large, nothing else on screen |
| `font` | automatic | `'sans'` or `'serif'`. By default sans for `chat`, serif for `minimal` |
| `textSize` | `1` | Text scale. `1.2` is 20% larger. The base size already adapts to the screen resolution (and `minimal` is already 1.5× larger) |
| `overscan` | `4` | Empty margin around everything, in % of the screen. Increase it if a CRT cuts off the edges |
| `theme` | `'light'` | `'light'` (white) or `'gray'` (very light grey background) |
| `cursor` | automatic | `'dot'` (round, breathing), `'bar'` or `'block'` (both blinking). By default dot for `chat`, bar for `minimal` |
| `showHeader` | `true` | The small title at the top left (chat layout) |
| `showComposer` | `true` | The input box at the bottom (chat layout) |
| `showFootnote` | `true` | The line of text under the input box (chat layout) |
| `headerTitle` | language default | Text of the header. `''` hides it |
| `placeholder` | language default | Grey text in the empty input box |
| `footnote` | language default | Text under the input box. Italian default: *L'assistente non può commettere errori. Non fidarti delle persone, ma solo di me.* |
| `newChatPerTopic` | `true` | When a topic's conversation closes, the chat fades and starts empty for the next topic. `false`: one single chat that keeps scrolling |
| `antiBurnIn` | `true` | Moves the whole layout by a few pixels for every answer, so static parts do not burn into a CRT |

Other interface languages can be added in `src/i18n.js`.

## `sound`

| Setting | Default | Meaning |
|---|---|---|
| `enabled` | `true` | A soft keyboard click for every letter of the questions as they are typed into the input box. The answers are silent. Synthesised, no audio files |
| `volume` | `0.35` | From `0` to `1` |

Add `?mute` to the address to silence it while previewing. Desktop browsers start the sound only after a click or a key press on the page; the Raspberry Pi kiosk plays it from the start.
