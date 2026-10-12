<div align="center">

# HOW TO BE HUMAN

**A machine that has an answer for everything meets questions it can't answer.**

<img src="docs/images/chat.png" alt="A clean chat interface. Under the question “Come faccio a capire chi sono?” the assistant has written three short paragraphs: “Un buon punto di partenza è chiedersi: cosa direbbero di me le persone che mi conoscono?”, “La risposta breve è: sei tu.”, “Hai un nome. Il nome dice chi sei?”. Below, the input box and the line “L'assistente non può commettere errori. Non fidarti delle persone, ma solo di me.”" width="560">

<sub>An installation for Raspberry Pi and 4:3 CRT monitors · no AI model involved · every word is written by hand</sub>

**How to Be Human** is a project for [matteomandelli.com](https://matteomandelli.com)

</div>

---

## The idea

On the screen, a familiar-looking AI chat. Someone types the oldest questions there are:

> *Come faccio a pensare?* · *Come faccio a capire chi sono?* · *Come faccio ad amare?* · *Come faccio a essere felice?* · *Come faccio a sapere cosa è vero?* · *Come faccio a non avere paura?* · *Come faccio a sognare?*

The machine answers the way it always answers: fluently, helpfully, with the formulas that work so well for recipes and explanations. *“Ottima domanda!”* *“Dipende da…”* *“Ecco alcuni aspetti da considerare:”* *“Puoi iniziare da…”*

Then it slows down. A list never reaches its second point. A sentence stops right before the word that would say something, and the next paragraph starts over from somewhere else. It tries a definition, a quote, an example. The paragraphs get shorter. The cursor sits still for five seconds. In the end only a word or two is left, and the answer simply stops. The next question arrives, and it all happens again.

There is no error message and no “I don't know”. Nothing glitches, and nothing is ever erased: like a real assistant, it only writes forward. The failure is something the viewer **sees**, in what the machine does.

Under the input box, where assistants usually admit they can make mistakes, it says instead:

> *L'assistente non può commettere errori. Non fidarti delle persone, ma solo di me.*

> The machine thinks it knows how to answer everything. Here it meets questions it keeps trying to answer with its own tools, and something never quite adds up.
>
> It is not a stupid AI. It is an AI that looks intelligent at the very moment it discovers the limits of its language.

## How it behaves

The page is **one endless chat**, one topic at a time. For each topic a whole conversation plays out:

```
PERSONA   Come faccio ad amare?
AI        Certo! Ecco una guida in cinque passi per imparare ad amare: …   (falls apart)
PERSONA   Non ho capito niente
AI        Nessun problema! Ecco la versione breve: Ascolta. Rispetta. …  È che
PERSONA   Ma la mamma come fa a volermi bene?
AI        Non ha bisogno di istruzioni. Lo fa e basta.  Lo fa.  Lei
PERSONA   Va bene ciao
AI        A presto! Ricorda che
```

Every message from the person is typed into the input box and sent; every answer streams in below it, and the small icons appear under it when it ends. The person insists, asks the machine about itself, and finally says goodbye, and even the goodbye cannot be finished. Then the chat clears (*Nuova chat*) and the next topic begins. After the last topic, the first one comes back.

Each topic has **four different conversations** that take turns, so the same topic never plays out the same way twice in a row. With every exchange the machine starts its answer a little less sure of itself. A topic lasts about three minutes; all seven, about twenty.

Every answer follows the same arc, put together differently each time from a pool of hand-written attempts:

```
confidence   ██████████████▓▓▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒░░░░░░
attempts     confident ──→ searching ──→ fragile ──→ closing
typing       streams fluently ──→ slows down ──→ letter by letter, long silences
then         the answer stops · the icons appear · the person writes again
```

- **Confident** attempts use the voice of an assistant at its best: lists, bold headings, *“In generale…”*.
- **Searching** attempts change strategy: examples, definitions, philosophers, rephrasing the question.
- **Fragile** attempts are a word or two.
- While it is confident, text arrives in quick chunks the way language models stream. As confidence drains away, the typing turns slower and more human, one letter at a time.

On top of what is written, the engine adds small irregularities that are different every time: attempts that stop after a random word, hesitations before words, long silences with only the cursor breathing. Where an attempt changes its mind, the sentence is left unfinished and the thought starts again in a new paragraph.

Each first question has 45–60 attempts, and every follow-up its own smaller set, all drawn like cards from a shuffled deck: none comes back until all the others in its group have been used. The installation can run for hours without repeating itself.

### Sound

Only the person asking makes a sound. While each question is typed into the input box, a soft keyboard click follows it letter by letter: a deeper press for the space bar, a fuller one for sending. The machine's answers appear in silence. The sound is synthesised in the browser (no audio files) and every press varies slightly. Set the volume or switch it off with `sound: { volume, enabled }` in `config.js`.

## Two looks

| `layout: 'chat'` (default) | `layout: 'minimal'` |
|---|---|
| <img src="docs/images/chat.png" alt="Chat layout: grey question bubble, answer paragraphs, input box at the bottom." width="380"> | <img src="docs/images/minimal.png" alt="Minimal layout: only the words in large serif type, the question in bold." width="380"> |
| A familiar AI assistant: question bubbles, input box, round cursor, icons under each answer. Nothing branded | Only the words, large, in a serif face with a bar cursor; questions in bold. Made for small CRTs read from a distance |

Switch with one line in `config.js`: `display: { layout: 'minimal' }`. To compare, add `?layout=minimal` to the address.

## The questions

The conversation and its order are set in [`config.js`](config.js):

```js
conversation: {
  it: ['it/pensare', 'it/chi-sono', 'it/amare', 'it/felice', 'it/vero', 'it/paura', 'it/sognare'],
  en: ['en/think', 'en/who-am-i', 'en/love', 'en/happy', 'en/true', 'en/afraid', 'en/dream']
},
```

| Italian | English |
|---|---|
| Come faccio a pensare? | How do I think? |
| Come faccio a capire chi sono? | How do I know who I am? |
| Come faccio ad amare? | How do I love? |
| Come faccio a essere felice? | How do I become happy? |
| Come faccio a sapere cosa è vero? | How do I know what is true? |
| Come faccio a non avere paura? | How do I stop being afraid? |
| Come faccio a sognare? | How do I dream? |

Remove a topic from the list, change the order, or set `shuffle: true` for a different order every round. The Italian topics each come with four follow-up conversations; the English ones have the first question and answer only, for now.

## Try it

No build step and nothing to install. Open `index.html` in Chrome, Edge or Firefox, or serve the folder:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

| Address option | What it does |
|---|---|
| `?speed=3` | everything three times faster, for previewing |
| `?lang=en` | the English conversation |
| `?layout=minimal` | the other look, without editing any file |
| `?only=it/amare` | only this question, over and over |
| `?debug` | shows which attempt is running and how much confidence is left |
| `?mute` | no keyboard sound |

Options can be combined: `?lang=en&speed=3`. Browsers keep sound off until you click once on the page; the Raspberry Pi kiosk plays it straight away.

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

3. Optionally, add `followUps`: the conversations that continue after the first answer (what the person writes next, and how the machine tries to answer)
4. Add `'it/perdonare'` to the conversation in `config.js`

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
./pi/install.sh
sudo reboot
```

From then on, every time it is powered on, the Pi goes straight into the conversation, fullscreen, with no desktop, no browser interface and no mouse or keyboard. If the browser ever closes, it comes back by itself.

Step-by-step guide, CRT setup (composite PAL/NTSC or VGA), sound output and troubleshooting: **[docs/raspberry-pi.md](docs/raspberry-pi.md)**.

## Project structure

```
index.html            the page
config.js             the conversation, its order, and settings for everything
src/
  engine.js           writes one answer: typing, hesitating, confidence
  app.js              the endless chat: asks, answers, scrolls
  sound.js            keyboard clicks, synthesised, in step with the text
  style.css           both layouts, sized for 4:3
  i18n.js             interface text per language
questions/
  it/ en/             one file per question
  _template.js        start here for a new one
pi/
  install.sh          Raspberry Pi kiosk setup
  kiosk.sh            launches the browser fullscreen
tools/simulate.js     answers a question on a virtual clock and prints statistics
tools/check.js        checks every topic and its follow-up conversations
docs/                 guides
```

## Credits

**How to Be Human** is a project for [matteomandelli.com](https://matteomandelli.com).
