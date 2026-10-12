<div align="center">

# HOW TO BE HUMAN

**A machine that has an answer for everything meets questions it can't answer.**

<img src="docs/images/chat.png" alt="A clean chat interface. Under the question “Come faccio a capire chi sono?” the assistant has written three short paragraphs: “Un buon punto di partenza è chiedersi: cosa direbbero di me le persone che mi conoscono?”, “La risposta breve è: sei tu.”, “Hai un nome. Il nome dice chi sei?”. Below, the input box and the line “L'assistente non può commettere errori. Non fidarti delle persone, ma solo di me.”" width="560">

<sub>An installation for Raspberry Pi and 4:3 CRT monitors · no AI model involved · every word is written by hand</sub>

**How to Be Human** is a project for [matteomandelli.com](https://matteomandelli.com)

**[▶ Watch it live](https://davidewastaken.github.io/how-to-be-human/)**

</div>

---

## The idea

A row of old screens, each showing a familiar-looking AI chat. At each one a child types one of the oldest questions there are:

> *Come faccio a pensare?* · *Come faccio a capire chi sono?* · *Come faccio ad amare?* · *Come faccio a essere felice?* · *Come faccio a sapere cosa è vero?* · *Come faccio a non avere paura?* · *Come faccio a sognare?*

The machine answers the way it always answers: fluently, helpfully, with the formulas that work so well for recipes and explanations. *“Ottima domanda!”* *“Dipende da…”* *“Ecco alcuni aspetti da considerare:”* *“Puoi iniziare da…”*

Then it slows down. A list never reaches its second point. A sentence stops right before the word that would say something, and the next paragraph starts over from somewhere else. It tries a definition, a quote, an example. The paragraphs get shorter. The cursor sits still for five seconds. In the end only a word or two is left, and the answer simply stops. The chat clears, the child asks the same question again, and the machine tries again: with different words, and with the same result.

There is no error message and no “I don't know”. Nothing glitches, and nothing is ever erased: like a real assistant, it only writes forward. The failure is something the viewer **sees**, in what the machine does.

Under the input box, where assistants usually admit they can make mistakes, it says instead:

> *L'assistente non può commettere errori. Non fidarti delle persone, ma solo di me.*

> The machine thinks it knows how to answer everything. Here it meets questions it keeps trying to answer with its own tools, and something never quite adds up.
>
> It is not a stupid AI. It is an AI that looks intelligent at the very moment it discovers the limits of its language.

## How it behaves

Each screen is a **station** with a single topic. The child asks one question, and only that one, over and over:

```
BAMBINO   Come faccio a non avere paura?
AI        In sintesi: respira, parlane, affrontala piano piano. E se non funziona
          Montaigne scrisse che chi teme di soffrire soffre già di ciò che teme. Quindi
          Essere coraggiosi non significa non avere paura, ma agire nonostante
          Paura
                                                       — the chat clears —
BAMBINO   Come faccio a non avere paura?
AI        Dipende da cosa ti fa paura.
          Certo! Una tecnica molto efficace si chiama esposizione graduale: …
          La paura è un'emozione naturale che ci protegge dai pericoli. Ecco alcune strategie:
          1. Respira lentamente.  2. Dai un nome alla paura.  3.
          Quando
```

The question is typed into the input box and sent; the answer streams in below it, and the small icons appear under it when it ends. A few seconds later the chat fades (*Nuova chat*), and the same question is typed again. Every answer stays on the topic, and every answer is different. One round lasts about a minute and a quarter.

Every answer follows the same arc, put together differently each time from a pool of hand-written attempts:

```
confidence   ██████████████▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░░░░░░
attempts     confident ──→ searching ──→ fragile ──→ closing
typing       streams fluently ──→ slows down ──→ letter by letter, long silences
then         the answer stops · the icons appear · the chat clears · the same question again
```

- **Confident** attempts use the voice of an assistant at its best: lists, bold headings, *“In generale…”*.
- **Searching** attempts change strategy: examples, definitions, philosophers, rephrasing the question.
- **Fragile** attempts are a word or two.
- While it is confident, text arrives in quick chunks the way language models stream. As confidence drains away, the typing turns slower and more human, one letter at a time.

On top of what is written, the engine adds small irregularities that are different every time: attempts that stop after a random word, hesitations before words, long silences with only the cursor breathing. Where an attempt changes its mind, the sentence is left unfinished and the thought starts again in a new paragraph.

Each topic has 45–60 attempts, drawn like cards from a shuffled deck: none comes back until all the others in its group have been used, and each one can stop at a different word. The same answer practically never appears twice, even over a whole day.

Each topic also contains four longer **follow-up conversations** (the child insists, asks the machine about itself, says goodbye). They are switched off, since each child asks a single question; `followUps: true` in `config.js` brings them back.

### Sound

Only the person asking makes a sound. While each question is typed into the input box, a soft keyboard click follows it letter by letter: a deeper press for the space bar, a fuller one for sending. The machine's answers appear in silence. The sound is synthesised in the browser (no audio files) and every press varies slightly. Set the volume or switch it off with `sound: { volume, enabled }` in `config.js`.

## Two looks

| `layout: 'chat'` (default) | `layout: 'minimal'` |
|---|---|
| <img src="docs/images/chat.png" alt="Chat layout: grey question bubble, answer paragraphs, input box at the bottom." width="380"> | <img src="docs/images/minimal.png" alt="Minimal layout: only the words in large serif type, the question in bold." width="380"> |
| A familiar AI assistant: question bubbles, input box, round cursor, icons under each answer. Nothing branded | Only the words, large, in a serif face with a bar cursor; questions in bold. Made for small CRTs read from a distance |

Switch with one line in `config.js`: `display: { layout: 'minimal' }`. To compare, add `?layout=minimal` to the address.

## The stations

Each station shows one topic. Watch each one live:

| Topic | Question | Live |
|---|---|---|
| `it/pensare` | Come faccio a pensare? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/pensare) |
| `it/chi-sono` | Come faccio a capire chi sono? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/chi-sono) |
| `it/amare` | Come faccio ad amare? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/amare) |
| `it/felice` | Come faccio a essere felice? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/felice) |
| `it/vero` | Come faccio a sapere cosa è vero? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/vero) |
| `it/paura` | Come faccio a non avere paura? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/paura) |
| `it/sognare` | Come faccio a sognare? | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=it/sognare) |
| `en/think` · `en/who-am-i` · `en/love` · `en/happy` · `en/true` · `en/afraid` · `en/dream` | the same questions in English | [▶](https://davidewastaken.github.io/how-to-be-human/?topic=en/love) |

The topic of a station is set in [`config.js`](config.js) (`topic: 'it/amare'`), in the address (`?topic=it/paura`), or on a Raspberry Pi with a small text file on its SD card. Leave `topic` empty to have one screen play every topic in turn.

## Try it

No build step and nothing to install. Open `index.html` in Chrome, Edge or Firefox, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

| Address option | What it does |
|---|---|
| `?topic=it/paura` | the station's topic |
| `?speed=3` | everything three times faster, for previewing |
| `?layout=minimal` | the other look, without editing any file |
| `?debug` | shows which attempt is running and how much confidence is left |
| `?mute` | no keyboard sound |

Options can be combined: `?topic=it/paura&speed=3`. Browsers keep sound off until you click once on the page; the Raspberry Pi kiosk plays it straight away.

Hidden keys, for setup only: **N** or **→** ends the current answer and moves on, **D** toggles the debug overlay.

## Add a question

1. Copy [`questions/_template.js`](questions/_template.js) to, say, `questions/it/perdonare.js`
2. Write the question and the attempts. Pauses and changes of mind are written inline:

   ```js
   HTBH.question({
     question: 'Come faccio a perdonare?',
     attempts: {
       confident: [
         "Perdonare è un processo che richiede [pause]tempo e consapevolezza. [long pause]Per iniziare puoi [erase 2 words][think]"
       ],
       searching: [ /* … */ ],
       fragile:   [ "Perdonare [think]" ]
     }
   });
   ```

3. Open it with `index.html?topic=it/perdonare`, or set it as a station's topic

The full markup and tips on writing attempts that fail gracefully: **[docs/writing-questions.md](docs/writing-questions.md)**. Every setting: **[docs/configuration.md](docs/configuration.md)**.

To check how a question behaves over many answers without watching it:

```bash
node tools/simulate.js it/amare 300
```

## Run it on a Raspberry Pi

On a fresh Raspberry Pi OS Lite:

```bash
git clone https://github.com/DavideWasTaken/how-to-be-human.git
cd how-to-be-human
./pi/install.sh it/paura
sudo reboot
```

From then on, every time it is powered on, the Pi goes straight into its station, fullscreen, with no desktop, no browser interface and no mouse or keyboard. If the browser ever closes, it comes back by itself.

To change a station's topic without connecting to it, put the SD card in any computer and write the topic in `how-to-be-human.txt` on its boot partition. Seven identical SD cards, one line each, make seven stations.

Step-by-step guide, CRT setup (composite PAL/NTSC or VGA), sound output and troubleshooting: **[docs/raspberry-pi.md](docs/raspberry-pi.md)**.

## Project structure

```
index.html            the page
config.js             the station's topic and settings for everything
src/
  engine.js           writes one answer: typing, hesitating, confidence
  app.js              the station: asks, answers, clears, asks again
  sound.js            keyboard clicks, synthesised, in step with the text
  style.css           both layouts, sized for 4:3
  i18n.js             interface text per language
questions/
  it/ en/             one file per question
  _template.js        start here for a new one
pi/
  install.sh          Raspberry Pi kiosk setup
  kiosk.sh            launches the browser fullscreen
  how-to-be-human.txt topic selector to copy onto the SD card
tools/simulate.js     answers a question on a virtual clock and prints statistics
tools/check.js        checks every topic and its follow-up conversations
docs/                 guides
```

## Credits

**How to Be Human** is a project for [matteomandelli.com](https://matteomandelli.com).
