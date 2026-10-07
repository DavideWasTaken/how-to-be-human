/*
 * How to Be Human — interface and boot.
 *
 * Picks the station (URL ?station= or config.js), loads its file, builds the
 * chat interface and hands it to the performer.
 *
 * Hidden keys, for setup only (the installation needs no keyboard):
 *   N or →   start a new cycle now
 *   D        show / hide the debug overlay
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});
  const CONFIG = global.HTBH_CONFIG || {};
  const params = new URLSearchParams(location.search);

  const stationId = (params.get('station') || CONFIG.station || 'it/amare').replace(/[^a-z0-9/_-]/gi, '');
  const speed = parseFloat(params.get('speed')) || 1;

  const $ = (id) => document.getElementById(id);
  const el = {
    screen: $('screen'),
    topbar: $('topbar'),
    title: $('title'),
    thread: $('thread'),
    userTurn: $('user-turn'),
    assistantTurn: $('assistant-turn'),
    question: $('question'),
    answer: $('answer'),
    composerArea: $('composer-area'),
    input: $('input'),
    placeholder: $('placeholder'),
    send: $('send'),
    footnote: $('footnote'),
    notice: $('notice'),
    debug: $('debug')
  };

  let performer = null;
  let sound = null;
  let started = false;
  let minimal = false;
  let question = '';

  /* ---------- loading the station ---------- */

  HTBH.station = function (def) {
    if (started) return;
    started = true;
    try {
      start(def);
    } catch (e) {
      notice(e.message);
      console.error(e);
    }
  };

  function load() {
    const script = document.createElement('script');
    script.src = 'stations/' + stationId + '.js';
    script.onerror = () => notice('Station not found: stations/' + stationId + '.js');
    document.head.appendChild(script);
  }

  function notice(msg) {
    el.notice.textContent = msg;
    el.notice.hidden = false;
  }

  /* ---------- building the interface ---------- */

  function start(def) {
    const station = HTBH.merge(
      {},
      HTBH.DEFAULTS,
      { timing: CONFIG.timing, behaviour: CONFIG.behaviour, display: CONFIG.display, sound: CONFIG.sound },
      def
    );
    const d = station.display;
    if (params.get('layout')) d.layout = params.get('layout');
    const strings = Object.assign({}, HTBH.STRINGS.en, HTBH.STRINGS[station.language] || {});
    const text = (key) => (d[key] == null ? strings[key] : d[key]);

    document.documentElement.lang = station.language;
    document.title = station.question || 'How to Be Human';

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
    el.footnote.hidden = !d.showFootnote || !text('footnote');
    question = station.question;
    el.question.textContent = question;

    sound = new HTBH.KeySound({
      enabled: station.sound.enabled && !params.has('mute'),
      volume: station.sound.volume
    });

    performer = new HTBH.Performer(station, ui, { speed });
    performer.run();
  }

  /* ---------- the interface the performer drives ---------- */

  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const LIST_ITEM = /^(\d+\.|[-•])\s/;

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
      el.answer.innerHTML = out;
      el.assistantTurn.scrollTop = el.assistantTurn.scrollHeight;

      if (!cursorHidden) {
        el.answer.dataset.cursor = 'typing';
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (!cursorHidden) el.answer.dataset.cursor = 'idle';
        }, 450);
      }
    },

    cursor(state) {
      clearTimeout(idleTimer);
      cursorHidden = state === 'hidden';
      el.answer.dataset.cursor = state;
    },

    /** Key clicks for text that just appeared, spread over `span` seconds. */
    keys(text, span) {
      if (sound) sound.typed(text, span);
    },

    backspace(count, span) {
      if (sound) sound.erased(count, span);
    },

    setGenerating(on) {
      el.send.dataset.state = on ? 'stop' : 'empty';
    },

    showQuestion(on) {
      if (minimal) {
        // no composer: the question is typed in place
        if (on) el.question.textContent = question;
        return;
      }
      el.userTurn.classList.toggle('is-hidden', !on);
    },

    setInput(value) {
      if (minimal) {
        el.question.textContent = value;
        const caret = document.createElement('span');
        caret.className = 'input-caret';
        el.question.appendChild(caret);
        return;
      }
      el.input.textContent = '';
      if (value) {
        el.input.appendChild(document.createTextNode(value));
        const caret = document.createElement('span');
        caret.className = 'input-caret';
        el.input.appendChild(caret);
      } else {
        el.input.appendChild(el.placeholder);
      }
      el.send.dataset.state = value ? 'ready' : 'empty';
    },

    pressSend() {
      el.send.classList.add('is-pressed');
      setTimeout(() => el.send.classList.remove('is-pressed'), 180);
    },

    fadeAnswer() {
      el.answer.classList.add('is-fading');
    },

    resetAnswer() {
      el.answer.classList.remove('is-fading');
    },

    /** Tiny shift of the whole layout every cycle, so static parts do not burn into a CRT. */
    nudge() {
      if (!performer || !performer.s.display.antiBurnIn) return;
      const r = () => Math.round((Math.random() * 2 - 1) * 4);
      el.screen.style.transform = 'translate(' + r() + 'px,' + r() + 'px)';
    },

    debug(info) {
      if (el.debug.hidden) return;
      if (!info) {
        el.debug.textContent = 'station   ' + stationId + '\n(question only)';
        return;
      }
      el.debug.textContent =
        'station   ' + stationId + '\n' +
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
    if ((k === 'n' || k === 'arrowright') && performer) performer.skip();
    if (k === 'd') el.debug.hidden = !el.debug.hidden;
  });

  load();
})(window);
