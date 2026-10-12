# Configuration

Everything is set in [`config.js`](../config.js). Settings are layered, each layer overriding the one before:

1. **Defaults**, built into `src/engine.js`
2. **`config.js`**: applies to the whole page and every question
3. **A question file**: can override `timing` and `behaviour` for that question only

Write only what you want to change. Values written as `[a, b]` are ranges: a random value between `a` and `b` is picked each time.

## `config.js`

```js
window.HTBH_CONFIG = {
  topic: 'it/amare',

  language: 'it',

  conversation: {
    it: ['it/pensare', 'it/chi-sono', 'it/amare', 'it/felice', 'it/vero', 'it/paura', 'it/sognare'],
    en: ['en/think', 'en/who-am-i', 'en/love', 'en/happy', 'en/true', 'en/afraid', 'en/dream']
  },

  shuffle: false,
  followUps: false,

  timing: {},
  behaviour: {},
  display: {}
};
```

| Setting | Meaning |
|---|---|
| `topic` | This station's topic: a file in `questions/` without `.js`. The question is asked, answered, the chat clears, and the same question is asked again, forever. `?topic=it/paura` in the address overrides it; on a Raspberry Pi so does `how-to-be-human.txt` on the SD card. The interface language follows the topic (`it/…`, `en/…`) |
| `language` | Only when `topic` is empty: which list of `conversation` is played, and the interface language |
| `conversation` | Only when `topic` is empty: for each language, the topics one screen plays in turn |
| `shuffle` | With several topics: a new random order every round |
| `followUps` | `true`: after the first answer the child keeps writing, using the topic's follow-up conversations (four per Italian topic), before the chat clears. Default `false`: one question only |

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
| `followUpSeconds` | `[20, 32]` | Only with `followUps: true`. Like `cycleSeconds`, for the answers to the person's follow-up messages. A single message can set its own with `seconds` |
| `nextFollowUp` | `[2.5, 4.5]` | Only with `followUps: true`. After an answer, before the person writes again (set in `config.js`) |
| `nextQuestion` | `[3, 6]` | After the answer has been erased: only the question on screen, then it tries again (set in `config.js`) |
| `eraseSpeed` | `26` | Characters per second when deleting. Long erases speed up like a held key |
| `lateRegretDelay` | `[1.6, 2.6]` | Wait before half of a finished sentence is taken back |

## `behaviour`

Chances are numbers from `0` (never) to `1` (always). Most of them grow as confidence drops.

| Setting | Default | Meaning |
|---|---|---|
| `backspace` | `true` | `true`: it deletes, retypes and takes sentences back, and at the end erases the whole answer, leaving only the question before trying again. `false`: the writing only goes forward, like a chat assistant; changes of mind leave the sentence unfinished and start a new paragraph, and the chat clears between rounds |
| `abortChance` | `0.3` | Chance an attempt stops after a random word |
| `hesitation` | `0.08` | Chance of a small pause before each word |
| `longThink` | `0.18` | Chance of a long silence between attempts |
| `streaming` | `true` | While confident, text arrives in chunks like a language model. `false` = always letter by letter |
| `confidenceCurve` | `1` | Shape of the confidence drop. `2` loses it early, `0.5` holds on until late |
| `eraseAttempt` | `0.6` | When an attempt ends, chance it is erased completely |
| `erasePartial` | `0.2` | …chance half of it is taken back instead |
| `retypeWord` | `0.05` | Chance a word is erased and typed again identical |
| `maxKeptChars` | `420` | When the text grows past this, paragraphs are pulled back |
| `finalErase` | `'backspace'` | How the answer disappears at the end: `'backspace'`, `'fade'` or `'instant'` |

## `display`

Set in `config.js` only.

| Setting | Default | Meaning |
|---|---|---|
| `layout` | `'chat'` | `'chat'`: a familiar AI assistant interface. `'minimal'`: only the questions and the answers, large, nothing else on screen |
| `font` | automatic | `'sans'`, `'serif'` or `'mono'`. By default sans for `chat`, serif for `minimal`, mono for the `matrix` and `dark` themes |
| `textSize` | `1` | Text scale. `1.2` is 20% larger. The base size already adapts to the screen resolution (and `minimal` is already 1.5× larger) |
| `overscan` | `4` | Empty margin around everything, in % of the screen. Increase it if a CRT cuts off the edges |
| `theme` | `'light'` | `'light'` (white), `'gray'` (very light grey), `'matrix'` (green phosphor on black, soft glow, falling code behind the words) or `'dark'` (white on black). `matrix` and `dark` always use the minimal layout. `?theme=matrix` in the address overrides it |
| `rain` | `true` | With the `matrix` theme: the dim falling code in the background. `false` switches it off |
| `cursor` | automatic | `'dot'` (round, breathing), `'bar'` or `'block'` (both blinking). By default dot for `chat`, bar for `minimal`, block for `matrix` and `dark` |
| `showHeader` | `true` | The small title at the top left (chat layout) |
| `showComposer` | `true` | The input box at the bottom (chat layout) |
| `showFootnote` | `true` | The line of text under the input box (chat layout) |
| `headerTitle` | language default | Text of the header. `''` hides it |
| `placeholder` | language default | Grey text in the empty input box |
| `footnote` | language default | Text under the input box. Italian default: *L'assistente può commettere errori. Verifica le informazioni importanti.* |
| `typeQuestion` | `false` | `false`: the question is already written when the station starts. `true`: it is typed into the input box and sent, like a person would |
| `newChatPerTopic` | `true` | When the topic changes (with several topics), or before every round when `backspace` is `false`, the chat fades and starts empty |
| `antiBurnIn` | `true` | Moves the whole layout by a few pixels for every answer, so static parts do not burn into a CRT |

Other interface languages can be added in `src/i18n.js`.
