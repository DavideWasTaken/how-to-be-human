/*
 * How to Be Human — the station.
 *
 * Each station is one topic: a child types the question, the assistant
 * answers (differently every time), the chat clears, and the same question
 * is asked again. Forever.
 *
 * The topic is set in config.js, or in the address:
 *   ?topic=it/amare     this station's question
 *   &speed=3 &debug &layout=minimal &mute
 *
 * Without a topic, the page plays every question of `conversation` in turn.
 *
 * Hidden keys, for setup only (the installation needs no keyboard):
 *   N or →   end the current answer now and move on
 *   D        show / hide the debug overlay
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});
  const CONFIG = global.HTBH_CONFIG || {};
  const params = new URLSearchParams(location.search);

  const clean = (s) => (s || '').replace(/[^a-z0-9/_-]/gi, '');
  const topic = clean(params.get('topic') || params.get('only') || params.get('station')) || CONFIG.topic || '';
  const topicLang = topic.split('/')[0];
  const language = clean(params.get('lang')) || (topic && HTBH.STRINGS[topicLang] ? topicLang : '') || CONFIG.language || 'it';
  const conversation = CONFIG.conversation || {};
  const ids = topic ? [topic] : conversation[language] || [];
  const speed = parseFloat(params.get('speed')) || 1;

  const $ = (id) => document.getElementById(id);
  const el = {
    screen: $('screen'),
    topbar: $('topbar'),
    title: $('title'),
    thread: $('thread'),
    inner: $('thread-inner'),
    composerArea: $('composer-area'),
    input: $('input'),
    placeholder: $('placeholder'),
    send: $('send'),
    footnote: $('footnote'),
    notice: $('notice'),
    debug: $('debug')
  };

  const MAX_TURNS = 10; // older messages, long scrolled away, are removed

  const rand = (a, b) => a + Math.random() * (b - a);
  const range = (v) => (Array.isArray(v) ? rand(v[0], v[1]) : v);
  const wait = (seconds) => new Promise((r) => setTimeout(r, (seconds * 1000) / speed));

  let page = null;       // settings shared by the whole page
  let minimal = false;
  let sound = null;
  let current = null;    // the answer being written: { turn, answer, id }
  let active = null;     // the performer writing it
  const defs = {};
  const performers = {};
  const followUpPerformers = {};

  /* ---------- loading the questions ---------- */

  let loading = null;
  HTBH.question = function (def) {
    if (loading) defs[loading] = def;
  };
  HTBH.station = HTBH.question; // older name

  function load(i) {
    if (i >= ids.length) return start();
    loading = ids[i];
    const script = document.createElement('script');
    script.src = 'questions/' + ids[i] + '.js';
    script.onload = () => load(i + 1);
    script.onerror = () => {
      console.warn('[how-to-be-human] question not found: questions/' + ids[i] + '.js');
      load(i + 1);
    };
    document.head.appendChild(script);
  }

  function notice(msg) {
    el.notice.textContent = msg;
    el.notice.hidden = false;
  }

  /* ---------- building the page ---------- */

  function start() {
    loading = null;
    const found = ids.filter((id) => defs[id]);
    if (!found.length) {
      notice(ids.length ? 'No questions found in questions/: ' + ids.join(', ') : 'No conversation for language "' + language + '" in config.js');
      return;
    }

    page = HTBH.merge({}, HTBH.DEFAULTS, {
      timing: CONFIG.timing, behaviour: CONFIG.behaviour, display: CONFIG.display, sound: CONFIG.sound
    });
    const d = page.display;
    if (params.get('layout')) d.layout = params.get('layout');

    const strings = Object.assign({}, HTBH.STRINGS.en, HTBH.STRINGS[language] || {});
    const text = (key) => (d[key] == null ? strings[key] : d[key]);

    document.documentElement.lang = language;
    const root = document.documentElement.style;
    root.setProperty('--text-size', String(d.textSize));
    root.setProperty('--overscan', d.overscan + '%');

    minimal = d.layout === 'minimal';
    document.body.dataset.layout = minimal ? 'minimal' : 'chat';
    document.body.dataset.theme = d.theme;
    document.body.dataset.cursor = d.cursor || (minimal ? 'bar' : 'dot');
    document.body.dataset.font = d.font || (minimal ? 'serif' : 'sans');

    el.title.textContent = text('headerTitle');
    el.topbar.hidden = minimal || !d.showHeader || !text('headerTitle');
    el.composerArea.hidden = minimal || !d.showComposer;
    el.placeholder.textContent = text('placeholder');
    el.footnote.textContent = text('footnote');
    el.footnote.hidden = minimal || !d.showFootnote || !text('footnote');

    sound = new HTBH.KeySound({
      enabled: page.sound.enabled && !params.has('mute'),
      volume: page.sound.volume
    });

    for (const id of found) {
      const def = defs[id];
      const base = { timing: CONFIG.timing, behaviour: CONFIG.behaviour };
      try {
        performers[id] = new HTBH.Performer(HTBH.merge({}, HTBH.DEFAULTS, base, def), ui, { speed });
      } catch (e) {
        console.warn('[how-to-be-human] ' + id + ': ' + e.message);
        continue;
      }
      // follow-ups (only when switched on): shorter answers, the topic's own settings still apply
      followUpPerformers[id] = (CONFIG.followUps ? def.followUps || [] : []).map((conversation, v) =>
        conversation.map((turn, k) => {
          const settings = HTBH.merge({}, HTBH.DEFAULTS, base,
            { timing: def.timing, behaviour: def.behaviour },
            { timing: { cycleSeconds: page.timing.followUpSeconds } },
            turn);
          if (turn.seconds) settings.timing.cycleSeconds = turn.seconds;
          try {
            return new HTBH.Performer(settings, ui, { speed });
          } catch (e) {
            console.warn('[how-to-be-human] ' + id + ' follow-up ' + (v + 1) + '.' + (k + 1) + ': ' + e.message);
            return null;
          }
        }).filter(Boolean)
      ).filter((c) => c.length);
    }

    converse(found.filter((id) => performers[id]));
  }

  /* ---------- the endless conversation ---------- */

  /**
   * The question is asked and answered; then the chat is cleared and the
   * question is asked again (a station has a single topic, so it is always
   * the same question, with a different answer each time). With several
   * topics they take turns. If follow-ups are switched on in config.js,
   * the person keeps the conversation going before it clears.
   */
  async function converse(list) {
    let first = true;
    for (;;) {
      const order = CONFIG.shuffle ? shuffled(list) : list;
      for (const id of order) {
        if (!first && page.display.newChatPerTopic) await newChat();

        const p = performers[id];
        await ask(p.s.question, first);
        first = false;
        await respond(p, id, 1);

        const followUps = pickFollowUps(id);
        for (let k = 0; k < followUps.length; k++) {
          await wait(range(page.timing.nextFollowUp));
          await ask(followUps[k].s.ask, false);
          // a little less sure of itself with every exchange
          await respond(followUps[k], id + ' → ' + (k + 2), Math.max(0.45, 1 - 0.15 * (k + 1)));
        }

        await wait(range(page.timing.nextQuestion));
      }
    }
  }

  async function respond(performer, label, startConfidence) {
    current = addAssistantTurn(label);
    active = performer;
    nudge();
    try {
      await performer.answer({ startConfidence });
    } catch (e) {
      if (!(e instanceof HTBH.Cancelled)) console.error(e);
    }
    active = null;
    ui.setGenerating(false);
    finishAnswer(current);
    prune();
  }

  /**
   * Each topic can have several follow-up conversations; they take turns,
   * like a shuffled deck, so the same topic never plays out the same way twice in a row.
   */
  const followDecks = {};
  function pickFollowUps(id) {
    const variants = followUpPerformers[id] || [];
    if (!variants.length) return [];
    let deck = followDecks[id];
    if (!deck || !deck.length) {
      deck = followDecks[id] = shuffled(variants.map((v, i) => i));
      if (deck.length > 1 && deck[0] === followDecks[id + '#last']) deck.push(deck.shift());
    }
    const i = deck.shift();
    followDecks[id + '#last'] = i;
    return variants[i];
  }

  /** The conversation closes: the chat fades away and a new, empty one begins. */
  async function newChat() {
    el.inner.classList.add('is-clearing');
    await wait(1.1);
    el.inner.innerHTML = '';
    el.inner.classList.remove('is-clearing');
    await wait(1.2);
  }

  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** The question is typed like a person would (into the input box, or in place in minimal), then sent. */
  async function ask(question, first) {
    await wait(first ? 1.6 : 0.6);
    let target = null;
    if (minimal) {
      target = addUserTurn('').querySelector('.bubble');
      scrollToEnd();
    }
    for (let i = 0; i < question.length; i++) {
      setTyped(target, question.slice(0, i + 1));
      if (sound) sound.typed(question[i], 0);
      await wait(rand(0.07, 0.22) + (question[i] === ' ' ? rand(0, 0.15) : 0));
    }
    await wait(0.8);
    if (minimal) {
      target.textContent = question;
    } else {
      el.send.classList.add('is-pressed');
      if (sound) sound.typed('\n', 0);
      setTimeout(() => el.send.classList.remove('is-pressed'), 180);
      await wait(0.2);
      setTyped(null, '');
      addUserTurn(question);
    }
    scrollToEnd();
    await wait(0.5);
  }

  function setTyped(target, value) {
    if (target) {
      target.textContent = value;
      target.appendChild(caret());
      return;
    }
    el.input.textContent = '';
    if (value) {
      el.input.appendChild(document.createTextNode(value));
      el.input.appendChild(caret());
    } else {
      el.input.appendChild(el.placeholder);
    }
    el.send.dataset.state = value ? 'ready' : 'empty';
  }

  function caret() {
    const c = document.createElement('span');
    c.className = 'input-caret';
    return c;
  }

  function addUserTurn(text) {
    const turn = document.createElement('div');
    turn.className = 'turn turn-user';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    turn.appendChild(bubble);
    el.inner.appendChild(turn);
    return turn;
  }

  function addAssistantTurn(id) {
    const turn = document.createElement('div');
    turn.className = 'turn turn-assistant';
    const answer = document.createElement('div');
    answer.className = 'answer';
    turn.appendChild(answer);
    el.inner.appendChild(turn);
    scrollToEnd();
    return { turn, answer, id };
  }

  /** When an answer is over: the small row of icons a chat assistant shows under its messages. */
  function finishAnswer(c) {
    c.answer.dataset.cursor = 'hidden';
    if (minimal) return;
    const icon = (d) => '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const row = document.createElement('div');
    row.className = 'actions';
    row.innerHTML =
      icon('M7 7V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5v7a1.5 1.5 0 0 1-1.5 1.5H13M4.5 7h7A1.5 1.5 0 0 1 13 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 15.5v-7A1.5 1.5 0 0 1 4.5 7z') +
      icon('M6 9v8H3.5V9H6zm0 0l3-6a2 2 0 0 1 2 2v3h4.4a1.5 1.5 0 0 1 1.5 1.8l-1.2 6A1.5 1.5 0 0 1 14.2 17H6') +
      icon('M6 11V3H3.5v8H6zm0 0l3 6a2 2 0 0 0 2-2v-3h4.4a1.5 1.5 0 0 0 1.5-1.8l-1.2-6A1.5 1.5 0 0 0 14.2 3H6') +
      icon('M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3.2h-3.2');
    c.turn.appendChild(row);
    scrollToEnd();
  }

  function scrollToEnd() {
    el.thread.scrollTop = el.thread.scrollHeight;
  }

  function prune() {
    while (el.inner.children.length > MAX_TURNS) el.inner.removeChild(el.inner.firstChild);
    scrollToEnd();
  }

  /** Tiny shift of the whole layout for every answer, so static parts do not burn into a CRT. */
  function nudge() {
    if (!page.display.antiBurnIn) return;
    const r = () => Math.round((Math.random() * 2 - 1) * 4);
    el.screen.style.transform = 'translate(' + r() + 'px,' + r() + 'px)';
  }

  /* ---------- the interface the performer drives ---------- */

  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const LIST_ITEM = /^(\d+\.|[-•])(\s|$)/; // an item left empty ("3.") still lines up

  function runsHtml(glyphs) {
    let out = '';
    let bold = false;
    let buf = '';
    const flush = () => {
      if (buf) out += bold ? '<strong>' + escapeHtml(buf) + '</strong>' : escapeHtml(buf);
      buf = '';
    };
    for (const g of glyphs) {
      if (g.b !== bold) {
        flush();
        bold = g.b;
      }
      buf += g.c;
    }
    flush();
    return out;
  }

  function lineHtml(line, cursor) {
    const plain = line.map((g) => g.c).join('');
    const m = plain.match(LIST_ITEM);
    if (m) {
      return '<div class="line li"><span class="li-marker">' + escapeHtml(m[1]) + '</span><span class="li-body">' +
        runsHtml(line.slice(m[0].length)) + cursor + '</span></div>';
    }
    return '<div class="line">' + runsHtml(line) + cursor + '</div>';
  }

  let idleTimer = null;
  let cursorHidden = false;

  const ui = {
    render(glyphs) {
      if (!current) return;
      const lines = [[]];
      for (const g of glyphs) {
        if (g.c === '\n') lines.push([]);
        else lines[lines.length - 1].push(g);
      }
      let out = '';
      let open = false;
      lines.forEach((line, i) => {
        const isLast = i === lines.length - 1;
        if (!line.length && !isLast) {
          if (open) out += '</div>';
          open = false;
          return;
        }
        if (!open) {
          out += '<div class="para">';
          open = true;
        }
        out += lineHtml(line, isLast ? '<span class="cursor"></span>' : '');
      });
      if (open) out += '</div>';
      current.answer.innerHTML = out;
      scrollToEnd();

      if (!cursorHidden) {
        const answer = current.answer;
        answer.dataset.cursor = 'typing';
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (!cursorHidden) answer.dataset.cursor = 'idle';
        }, 450);
      }
    },

    cursor(state) {
      clearTimeout(idleTimer);
      cursorHidden = state === 'hidden';
      if (current) current.answer.dataset.cursor = state;
    },

    // The answer is silent: only the person asking types on a keyboard.
    keys() {},
    backspace() {},

    setGenerating(on) {
      el.send.dataset.state = on ? 'stop' : 'empty';
    },

    fadeAnswer() {
      if (current) current.answer.classList.add('is-fading');
    },

    resetAnswer() {
      if (current) current.answer.classList.remove('is-fading');
    },

    debug(info) {
      if (el.debug.hidden) return;
      const id = current ? current.id : '';
      if (!info) {
        el.debug.textContent = 'question  ' + id + '\n(answer finished)';
        return;
      }
      el.debug.textContent =
        'question  ' + id + '\n' +
        'attempt   ' + info.attempt + '\n' +
        'confidence ' + info.confidence.toFixed(2) + '\n' +
        'time      ' + info.elapsed.toFixed(1) + ' / ' + info.target.toFixed(1) + ' s\n' +
        'abort at  ' + info.abort + (speed !== 1 ? '\nspeed     ×' + speed : '');
    }
  };

  HTBH.ui = ui; // handy from the browser console while designing

  /* ---------- setup keys ---------- */

  if (params.has('debug')) el.debug.hidden = false;

  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if ((k === 'n' || k === 'arrowright') && active) active.skip();
    if (k === 'd') el.debug.hidden = !el.debug.hidden;
  });

  load(0);
})(window);
