<div align="center">

# HOW TO BE HUMAN

**A machine that has an answer for everything meets a question it can't answer.**

<img src="docs/images/screenshot.png" alt="A clean chat interface. The question “Come faccio ad amare?” sits in a grey bubble; below it the assistant has started an answer: “Ottima domanda! Amare è una delle esperienze più profonde e complesse della vita umana.”, followed by a black cursor dot." width="560">

<sub>An installation for Raspberry Pi and 4:3 CRT monitors · no AI model involved · every word is written by hand</sub>

</div>

---

## The idea

A child asks a familiar-looking AI assistant one of the oldest questions there is:

> *How do I think?* · *How do I know who I am?* · *How do I love?*

The machine answers the way it always answers: fluently, helpfully, with the formulas that work so well for recipes and explanations. *“Great question!”* *“It depends on…”* *“Here are a few things to consider:”* *“You can start with…”*

Then it slows down. It deletes a word. It starts over. It tries a definition, a quote, an example. Sentences stop halfway. The cursor sits still for five seconds. A word gets erased and typed again, identical. Eventually the whole answer is taken back, and only the question is left on the screen. Then it tries again.

There is no error message and no “I don't know”. Nothing glitches. The language stays perfectly believable. The failure is something the viewer **sees**, in what the machine does.

> The machine thinks it knows how to answer everything. Here it meets questions it keeps trying to answer with its own tools, and something never quite adds up.
>
> It is not a stupid AI. It is an AI that looks intelligent at the very moment it discovers the limits of its language.

## How it behaves

Every cycle follows the same arc, but each one is put together differently from a pool of hand-written attempts, so it never plays like a video on loop.

```
confidence   ██████████████▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░░░░░░
attempts     confident ──→ searching ──→ fragile ──→ closing
typing       streams fluently ──→ slows down ──→ letter by letter, long silences
then         everything is erased · only the question remains · it starts again
```

- **Confident** attempts use the voice of an assistant at its best: lists, bold headings, *“In general…”*.
- **Searching** attempts change strategy: examples, definitions, philosophers, rephrasing the question.
- **Fragile** attempts are a word or two. Then nothing.
- While it is confident, text arrives in quick chunks the way language models stream. As confidence drains away, the typing turns slower and more human, one letter at a time.

Some behaviour is written into each attempt (a pause here, delete three words there). The rest is added by the engine and is different every time:

| | |
|---|---|
| **Abort** | an attempt stops halfway, waits, and is erased |
| **Late regret** | a sentence is completed, then after two seconds half of it is taken back |
| **Retype** | a word is erased and written again, exactly the same |
| **Hesitation** | tiny pauses before words, more frequent as confidence drops |
| **Long think** | the cursor stays still for 4–5 seconds |
| **Retraction** | when kept text piles up, whole paragraphs are pulled back |

## Stations

Each installation point (a *station*) is one question with its own set of attempts. Changing the question to make a new piece only means writing a new station file.

| Station | Question | Language |
|---|---|---|
| `it/pensare` | Come faccio a pensare? | Italian |
| `it/chi-sono` | Come faccio a capire chi sono? | Italian |
| `it/amare` | Come faccio ad amare? | Italian |
| `en/think` | How do I think? | English |
| `en/who-am-i` | How do I know who I am? | English |
| `en/love` | How do I love? | English |

## Try it

No build step and nothing to install. Open `index.html` in Chrome, Edge or Firefox, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000/?station=it/amare`.

| URL option | What it does |
|---|---|
| `?station=it/pensare` | choose the station (default set in `config.js`) |
| `&speed=4` | run four times faster, for previewing |
| `&debug` | show which attempt is running and the current confidence |

Hidden keys, for setup only: **N** or **→** starts a new cycle, **D** toggles the debug overlay.

## Write a new station

Copy [`stations/_template.js`](stations/_template.js), change the question and write the attempts. Hesitations are written inline:

```js
HTBH.station({
  language: 'it',
  question: 'Come faccio a non avere paura?',
  attempts: {
    confident: [
      "La paura è una reazione naturale che [pause]ci protegge dai pericoli. [long pause]Per gestirla puoi [erase 2 words][think]"
    ],
    searching: [ /* … */ ],
    fragile:   [ "Paura [think]" ]
  }
});
```

The full markup ([pause], [erase 3 words], [retype], [slow], …) and tips on writing attempts that fail gracefully are in **[docs/writing-stations.md](docs/writing-stations.md)**. Every timing and behaviour setting is listed in **[docs/configuration.md](docs/configuration.md)**.

You can also check how a station will feel over hours without watching it:

```bash
node tools/simulate.js it/amare 300
```

## Run it on a Raspberry Pi

On a fresh Raspberry Pi OS Lite:

```bash
git clone https://github.com/DavideWasTaken/how-to-be-human.git
cd how-to-be-human
./pi/install.sh it/amare
sudo reboot
```

The Pi boots straight into the station, fullscreen, with no desktop, no browser interface and no mouse or keyboard. To change station later, edit `how-to-be-human.txt` on the SD card from any computer.

CRT setup (composite PAL/NTSC or VGA), overscan, burn-in and troubleshooting: **[docs/raspberry-pi.md](docs/raspberry-pi.md)**.

## Project structure

```
index.html            the page
config.js             default station + settings shared by all stations
src/
  engine.js           the performer: typing, hesitating, erasing, confidence
  app.js              interface, station loading, hidden keys
  style.css           the chat interface, sized for 4:3
  i18n.js             interface text per language
stations/
  it/ en/             one file per station
  _template.js        start here for a new one
pi/
  install.sh          Raspberry Pi kiosk setup
  kiosk.sh            launches the browser fullscreen
  how-to-be-human.txt station selector to copy onto the SD card
tools/simulate.js     runs a station on a virtual clock and prints statistics
docs/                 guides
```

## Roadmap

- [ ] Optional generative mode: a language model writes new attempts, the engine still controls rhythm and failure
- [ ] More stations: *How do I know what is true?* · *How do I stop being afraid?* · *How do I become happy?*
- [ ] Optional sound of a keyboard, very low

