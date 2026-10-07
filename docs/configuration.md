# Configuration

Settings are layered. Each layer overrides the one before it:

1. **Defaults**, built into `src/engine.js`
2. **`config.js`**: applies to every station on this machine
3. **The station file**: applies to that station only

Write only what you want to change. For example, to make one station slower and larger:

```js
HTBH.station({
  language: 'it',
  question: 'Come faccio ad amare?',
  timing:  { typingSpeed: 30, cycleSeconds: [40, 60] },
  display: { textSize: 1.2 },
  attempts: { /* … */ }
});
```

Values written as `[a, b]` are ranges: a random value between `a` and `b` is picked each time.

## `language`

`'it'`, `'en'`, `'fr'`, `'es'` or `'de'`. Sets the interface text (header, input placeholder, footnote) and the page language. Other languages can be added in `src/i18n.js`, or any single string can be overridden in `display`.

## `timing`

All values in seconds unless noted.

| Setting | Default | Meaning |
|---|---|---|
| `cycleSeconds` | `[30, 50]` | How long it keeps starting new attempts. The ending (last attempt, closing, erase, question alone) adds roughly 10–20 s, so a full loop lasts about 45–80 s |
| `typingSpeed` | `45` | Characters per second at full confidence |
| `minTypingSpeed` | `10` | Characters per second when confidence has run out |
| `eraseSpeed` | `26` | Characters per second when backspacing. Long erases speed up like a held key |
| `shortPause` | `0.7` | Length of `[pause]` |
| `longPause` | `2.0` | Length of `[long pause]` |
| `thinkPause` | `[4, 5.5]` | Length of `[think]` and of long silences between attempts |
| `firstWordDelay` | `[1.2, 2.6]` | The pulsing dot before the first word of a cycle |
| `betweenAttempts` | `[0.5, 1.6]` | Pause between one attempt and the next |
| `lateRegretDelay` | `[1.6, 2.6]` | Wait before half of a finished sentence is taken back |
| `finalHold` | `[2, 4]` | Last moment before the whole answer is erased |
| `questionHold` | `[3, 5]` | Only the question on screen, before the next cycle |

## `behaviour`

Chances are numbers from `0` (never) to `1` (always). Most of them grow as confidence drops.

| Setting | Default | Meaning |
|---|---|---|
| `eraseAttempt` | `0.6` | When an attempt ends on its own, chance it is erased completely |
| `erasePartial` | `0.2` | …chance half of it is taken back instead. Whatever is left is the chance it stays on screen |
| `abortChance` | `0.25` | Chance an attempt stops at a random point and is erased |
| `hesitation` | `0.08` | Chance of a small pause before each word |
| `retypeWord` | `0.035` | Chance a word is erased and typed again identical |
| `longThink` | `0.18` | Chance of a long silence between attempts |
| `streaming` | `true` | While confident, text arrives in chunks like a language model. `false` = always letter by letter |
| `confidenceCurve` | `1` | Shape of the confidence drop. `2` loses it early, `0.5` holds on until late |
| `maxKeptChars` | `420` | When the text kept on screen grows past this, paragraphs are pulled back |
| `finalErase` | `'backspace'` | How the answer disappears at the end: `'backspace'` (accelerating), `'fade'` or `'instant'` |

## `display`

| Setting | Default | Meaning |
|---|---|---|
| `layout` | `'chat'` | `'chat'`: a familiar AI assistant interface. `'minimal'`: only the question and the answer, large, nothing else on screen |
| `font` | automatic | `'sans'` or `'serif'`. By default sans for `chat`, serif for `minimal` |
| `textSize` | `1` | Text scale. `1.2` is 20% larger. The base size already adapts to the screen resolution (and `minimal` is already 1.5× larger) |
| `overscan` | `4` | Empty margin around everything, in % of the screen. Increase it if a CRT cuts off the edges |
| `theme` | `'light'` | `'light'` (white) or `'gray'` (very light grey background) |
| `cursor` | automatic | `'dot'` (round, breathing), `'bar'` or `'block'` (both blinking). By default dot for `chat`, bar for `minimal` |
| `showHeader` | `true` | The small title at the top left (chat layout) |
| `showComposer` | `true` | The input box at the bottom (chat layout) |
| `showFootnote` | `true` | The small line of text under the input box (chat layout) |
| `headerTitle` | language default | Text of the header. `''` hides it |
| `placeholder` | language default | Grey text in the empty input box |
| `footnote` | language default | Text under the input box. `''` hides it |
| `introTyping` | `true` | When the machine starts, the question is typed (into the input box in `chat`, in place in `minimal`), once |
| `antiBurnIn` | `true` | Moves the whole layout by a few pixels every cycle, so static parts do not burn into a CRT |

## `config.js`

```js
window.HTBH_CONFIG = {
  station: 'it/amare',   // shown when the URL has no ?station=

  timing: {},            // applied to every station
  behaviour: {},
  display: {}
};
```

On the Raspberry Pi, the station is normally chosen with `how-to-be-human.txt` on the SD card or `pi/station.conf`; see [raspberry-pi.md](raspberry-pi.md).
