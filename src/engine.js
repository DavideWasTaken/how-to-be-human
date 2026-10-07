/*
 * How to Be Human — performance engine.
 *
 * Takes a station (a question + prepared attempts) and performs it forever:
 * typing, hesitating, erasing, restarting. No randomness is visible as
 * "glitch": every behaviour is something a writer would do.
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});

  HTBH.DEFAULTS = {
    language: 'it',
    question: '',
    timing: {
      cycleSeconds: [30, 50],     // how long it keeps trying (a full loop adds ~10–15 s of ending)
      typingSpeed: 45,            // characters per second at full confidence
      minTypingSpeed: 10,         // characters per second at zero confidence
      eraseSpeed: 26,             // characters per second when backspacing
      shortPause: 0.7,            // [pause]
      longPause: 2.0,             // [long pause]
      thinkPause: [4, 5.5],       // [think] — the cursor just sits there
      firstWordDelay: [1.2, 2.6], // pulsing dot before the first word
      betweenAttempts: [0.5, 1.6],
      lateRegretDelay: [1.6, 2.6],// finishes a sentence, waits, then erases half of it
      finalHold: [2, 4],          // last state before everything is erased
      questionHold: [3, 5]        // only the question on screen
    },
    behaviour: {
      eraseAttempt: 0.6,    // chance an attempt is erased entirely when it ends
      erasePartial: 0.2,    // chance it is cut in half instead ("late regret")
      abortChance: 0.25,    // chance an attempt stops halfway through
      hesitation: 0.08,     // chance of a micro-pause before any word
      retypeWord: 0.035,    // chance a word is erased and retyped identical
      longThink: 0.18,      // chance of a long cursor hold between attempts
      streaming: true,      // when confident, text arrives in token-like chunks
      confidenceCurve: 1,   // >1 loses confidence faster, <1 holds on longer
      maxKeptChars: 420,    // when kept text grows past this, it gets retracted
      finalErase: 'backspace' // 'backspace' | 'fade' | 'instant'
    },
    display: {
      textSize: 1,
      overscan: 4,
      layout: 'chat',       // 'chat' (assistant interface) | 'minimal' (only the words, large)
      font: null,           // 'sans' | 'serif' — null: sans for chat, serif for minimal
      theme: 'light',       // 'light' | 'gray'
      cursor: null,         // 'dot' | 'bar' | 'block' — null: dot for chat, bar for minimal
      showHeader: true,
      showComposer: true,
      showFootnote: true,
      headerTitle: null,    // null = default for the language, '' = hidden
      placeholder: null,
      footnote: null,
      introTyping: true,    // at boot, the question is typed and "sent"
      antiBurnIn: true      // shifts the layout by a few pixels every cycle
    },
    sound: {
      enabled: true,        // a soft key click for every character written or erased
      volume: 0.35          // 0–1
    },
    attempts: {}
  };

  const TIERS = ['confident', 'searching', 'fragile'];

  /* ---------- small utilities ---------- */

  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const range = (v) => (Array.isArray(v) ? rand(v[0], v[1]) : v);
  const chance = (p) => Math.random() < p;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const isSpace = (ch) => /\s/.test(ch);
  const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

  function merge(target, ...sources) {
    for (const src of sources) {
      if (!isPlainObject(src)) continue;
      for (const key of Object.keys(src)) {
        const val = src[key];
        if (isPlainObject(val)) {
          target[key] = merge(isPlainObject(target[key]) ? target[key] : {}, val);
        } else if (Array.isArray(val)) {
          target[key] = val.slice();
        } else if (val !== undefined) {
          target[key] = val;
        }
      }
    }
    return target;
  }
  HTBH.merge = merge;

  class Cancelled extends Error {}
  class Aborted extends Error {}

  /* ---------- attempt markup ---------- */

  function parseCommand(raw) {
    const s = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    let m;
    if (s === 'pause') return { type: 'pause', kind: 'short' };
    if (s === 'long pause') return { type: 'pause', kind: 'long' };
    if (s === 'think' || s === 'hold') return { type: 'pause', kind: 'think' };
    if ((m = s.match(/^pause (\d+(?:\.\d+)?)s?$/))) return { type: 'pause', seconds: +m[1] };

    if (s === 'erase' || s === 'erase word') return { type: 'erase', unit: 'word', n: 1 };
    if ((m = s.match(/^erase (\d+) words?$/))) return { type: 'erase', unit: 'word', n: +m[1] };
    if ((m = s.match(/^erase (\d+)(?: chars?| characters?)?$/))) return { type: 'erase', unit: 'char', n: +m[1] };
    if (s === 'erase sentence') return { type: 'erase', unit: 'sentence' };
    if (s === 'erase line') return { type: 'erase', unit: 'line' };
    if (s === 'erase half') return { type: 'erase', unit: 'half' };
    if (s === 'erase all' || s === 'erase everything') return { type: 'erase', unit: 'all' };

    if (s === 'retype') return { type: 'retype' };
    if (s === 'keep') return { type: 'keep' };

    if (s === 'very slow') return { type: 'speed', factor: 0.3 };
    if (s === 'slow') return { type: 'speed', factor: 0.5 };
    if (s === 'normal') return { type: 'speed', factor: 1 };
    if (s === 'fast') return { type: 'speed', factor: 1.6 };
    if ((m = s.match(/^speed (\d+(?:\.\d+)?)$/))) return { type: 'speed', factor: +m[1] };

    console.warn('[how-to-be-human] unknown command [' + raw + '] — ignored');
    return null;
  }

  function parseAttempt(src) {
    const ops = [];
    const re = /\[([^\]]*)\]/g;
    let last = 0;
    let m;
    while ((m = re.exec(src))) {
      if (m.index > last) ops.push({ type: 'text', text: src.slice(last, m.index) });
      const cmd = parseCommand(m[1]);
      if (cmd) ops.push(cmd);
      last = re.lastIndex;
    }
    if (last < src.length) ops.push({ type: 'text', text: src.slice(last) });
    return ops;
  }
  HTBH.parseAttempt = parseAttempt;

  function visibleLength(ops) {
    return ops.reduce((n, op) => (op.type === 'text' ? n + op.text.replace(/\*\*/g, '').length : n), 0);
  }

  function normaliseAttempt(a, tier, i) {
    const obj = typeof a === 'string' ? { text: a } : Object.assign({}, a);
    obj.weight = obj.weight == null ? 1 : obj.weight;
    obj.id = tier + '#' + (i + 1);
    obj.ops = parseAttempt(obj.text || '');
    obj.length = visibleLength(obj.ops);
    return obj;
  }

  /* ---------- the performer ---------- */

  class Performer {
    constructor(station, ui, opts) {
      this.s = station;
      this.t = station.timing;
      this.b = station.behaviour;
      this.ui = ui;
      this.scale = (opts && opts.speed) || 1;
      this.glyphs = [];
      this.pending = null;
      this.used = new Set();
      this.lastOpener = null;
      this.lastPicked = null;
      this.cycleStart = performance.now();
      this.target = 1;

      this.pools = {};
      for (const tier of TIERS.concat('closing')) {
        const list = (station.attempts && station.attempts[tier]) || [];
        this.pools[tier] = list.map((a, i) => normaliseAttempt(a, tier, i));
      }
      if (!TIERS.some((t) => this.pools[t].length)) {
        throw new Error('This station has no attempts. Add some to attempts.confident / searching / fragile.');
      }
    }

    /* --- time --- */

    elapsed() {
      return ((performance.now() - this.cycleStart) * this.scale) / 1000;
    }

    confidence() {
      const t = clamp01(this.elapsed() / this.target);
      return Math.pow(1 - t, this.b.confidenceCurve);
    }

    sleep(seconds) {
      const ms = Math.max(0, (seconds * 1000) / this.scale);
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending = null;
          resolve();
        }, ms);
        this.pending = { timer, reject };
      });
    }

    /** Interrupts whatever is happening; the main loop starts a fresh cycle. */
    skip() {
      if (!this.pending) return;
      clearTimeout(this.pending.timer);
      const { reject } = this.pending;
      this.pending = null;
      reject(new Cancelled());
    }

    /* --- main loop --- */

    async run() {
      if (this.s.display.introTyping) {
        try {
          await this.intro();
        } catch (e) {
          if (!(e instanceof Cancelled)) throw e;
        }
      }
      this.ui.showQuestion(true);
      for (;;) {
        try {
          await this.cycle();
        } catch (e) {
          if (!(e instanceof Cancelled)) {
            console.error(e);
            await new Promise((r) => setTimeout(r, 1000));
          }
        }
      }
    }

    async intro() {
      const q = this.s.question;
      this.ui.showQuestion(false);
      this.ui.setInput('');
      await this.sleep(1.6);
      for (let i = 0; i < q.length; i++) {
        this.ui.setInput(q.slice(0, i + 1));
        this.ui.keys(q[i], 0);
        await this.sleep(rand(0.07, 0.22) + (q[i] === ' ' ? rand(0, 0.15) : 0));
      }
      await this.sleep(0.9);
      this.ui.pressSend();
      await this.sleep(0.2);
      this.ui.setInput('');
      this.ui.showQuestion(true);
      await this.sleep(0.4);
    }

    async cycle() {
      this.glyphs = [];
      this.ui.resetAnswer();
      this.ui.render(this.glyphs);
      this.ui.cursor('idle');
      this.ui.setGenerating(true);
      this.ui.nudge();

      this.cycleStart = performance.now();
      this.target = range(this.t.cycleSeconds);

      await this.sleep(range(this.t.firstWordDelay));

      let first = true;
      while (this.elapsed() < this.target) {
        const tier = first && this.pools.confident.length ? 'confident' : this.pickTier();
        const attempt = this.pickAttempt(tier, first);
        if (!attempt) break;
        await this.perform(attempt, { first });
        first = false;

        const c = this.confidence();
        if (chance(this.b.longThink * (1.4 - c))) await this.sleep(range(this.t.thinkPause));
        else await this.sleep(range(this.t.betweenAttempts) * (1.5 - 0.5 * c));
      }

      const closing = this.pickAttempt('closing');
      if (closing) await this.perform(closing, {});

      await this.sleep(range(this.t.finalHold));
      await this.finalErase();
      this.ui.cursor('hidden');
      this.ui.setGenerating(false);
      this.ui.debug(null);
      await this.sleep(range(this.t.questionHold));
    }

    pickTier() {
      const c = this.confidence();
      const weights = [c * c, 2 * c * (1 - c), (1 - c) * (1 - c)];
      const tiers = TIERS.filter((t, i) => this.pools[t].length && weights[i] > 0);
      if (!tiers.length) return TIERS.find((t) => this.pools[t].length);
      const ws = tiers.map((t) => weights[TIERS.indexOf(t)]);
      let r = Math.random() * ws.reduce((a, b) => a + b, 0);
      for (let i = 0; i < tiers.length; i++) {
        if ((r -= ws[i]) <= 0) return tiers[i];
      }
      return tiers[tiers.length - 1];
    }

    /**
     * Shuffle-bag selection: every attempt of a tier is used once, across
     * cycles, before any of them comes back.
     */
    pickAttempt(tier, first) {
      const pool = this.pools[tier] || [];
      if (!pool.length) return null;
      let candidates = pool.filter((a) => !this.used.has(a.id) && !(first && a.id === this.lastOpener));
      if (!candidates.length) {
        pool.forEach((a) => this.used.delete(a.id));
        candidates = pool.filter((a) => a.id !== this.lastOpener && a.id !== this.lastPicked);
        if (!candidates.length) candidates = pool;
      }
      let r = Math.random() * candidates.reduce((n, a) => n + a.weight, 0);
      let pick = candidates[candidates.length - 1];
      for (const a of candidates) {
        if ((r -= a.weight) <= 0) {
          pick = a;
          break;
        }
      }
      this.used.add(pick.id);
      this.lastPicked = pick.id;
      if (first) this.lastOpener = pick.id;
      return pick;
    }

    /* --- one attempt --- */

    async perform(attempt, { first }) {
      await this.makeRoom();

      while (this.glyphs.length && this.glyphs[this.glyphs.length - 1].c === ' ') this.glyphs.pop();
      const base = this.glyphs.length;
      if (base > 0) {
        const prev = this.glyphs.length ? this.glyphs[this.glyphs.length - 1].c : '';
        const sep = /[.!?]/.test(prev) && chance(0.35) ? ' ' : '\n\n';
        await this.typeChars(sep, { bold: false, typed: 0, speed: 1 });
      }

      const c0 = this.confidence();
      const ctx = { bold: false, typed: 0, speed: 1, start: this.glyphs.length, base, cutAt: 0, keep: false, erasedAll: false };

      let abortP = this.b.abortChance * (1.3 - c0);
      if (first) abortP *= 0.3;
      if (attempt.length > 14 && chance(abortP)) ctx.cutAt = Math.max(4, Math.floor(attempt.length * rand(0.15, 0.7)));

      this.ui.debug({
        attempt: attempt.id,
        confidence: c0,
        elapsed: this.elapsed(),
        target: this.target,
        abort: ctx.cutAt ? ctx.cutAt + '/' + attempt.length : '—'
      });

      try {
        for (const op of attempt.ops) await this.runOp(op, ctx);
        if (!ctx.keep && !ctx.erasedAll) await this.ending(ctx);
      } catch (e) {
        if (!(e instanceof Aborted)) throw e;
        await this.afterAbort(ctx);
      }

      // nothing left of this attempt: take back the paragraph break too
      if (this.glyphs.length <= ctx.start && ctx.start > base) await this.eraseTo(base, true);
    }

    async runOp(op, ctx) {
      const c = this.confidence();
      ctx.erasedAll = false;
      switch (op.type) {
        case 'text':
          await this.typeText(op.text, ctx);
          break;
        case 'pause': {
          let secs = op.seconds;
          if (secs == null) {
            if (op.kind === 'think') secs = range(this.t.thinkPause);
            else if (op.kind === 'long') secs = this.t.longPause * rand(0.8, 1.25) * (1.3 - 0.3 * c);
            else secs = this.t.shortPause * rand(0.7, 1.3) * (1.3 - 0.3 * c);
          }
          await this.sleep(secs);
          break;
        }
        case 'erase':
          await this.eraseTo(this.boundary(op, ctx.start));
          ctx.erasedAll = op.unit === 'all';
          break;
        case 'retype':
          await this.retype(this.wordBoundary(1, ctx.start), ctx);
          break;
        case 'speed':
          ctx.speed = op.factor;
          break;
        case 'keep':
          ctx.keep = true;
          break;
      }
    }

    async ending(ctx) {
      if (this.glyphs.length <= ctx.start) return;
      const c = this.confidence();
      const pAll = this.b.eraseAttempt;
      const pHalf = this.b.erasePartial;
      const pKeep = Math.max(0, 1 - pAll - pHalf) * (0.35 + 0.65 * c);
      const r = Math.random() * (pAll + pHalf + pKeep);

      if (r < pAll) {
        await this.sleep(rand(0.8, 2.2) * (1.5 - 0.5 * c));
        if (chance(0.3)) {
          // takes it apart a little at a time before giving up on it
          await this.eraseTo(this.wordBoundary(randInt(1, 2), ctx.start));
          await this.sleep(this.t.shortPause * rand(0.8, 2));
        }
        await this.eraseTo(ctx.start);
      } else if (r < pAll + pHalf) {
        await this.sleep(range(this.t.lateRegretDelay));
        await this.eraseTo(this.halfBoundary(ctx.start));
        await this.sleep(this.t.longPause * rand(0.6, 1.4));
        if (chance(0.55)) await this.eraseTo(ctx.start);
      }
      // otherwise: it stays, and the next attempt builds on top of it
    }

    async afterAbort(ctx) {
      if (chance(0.35)) await this.sleep(range(this.t.thinkPause));
      else await this.sleep(this.t.longPause * rand(0.6, 1.3));
      if (chance(0.3)) {
        await this.eraseTo(this.wordBoundary(1, ctx.start));
        await this.sleep(this.t.shortPause * rand(0.6, 1.8));
      }
      await this.eraseTo(ctx.start);
    }

    /** Too much text has piled up: retract the last paragraph(s). */
    async makeRoom() {
      const max = this.b.maxKeptChars;
      while (max && this.glyphs.length > max) {
        const text = this.glyphs.map((g) => g.c).join('');
        const cut = text.trimEnd().lastIndexOf('\n\n');
        await this.sleep(rand(0.8, 1.8));
        await this.eraseTo(cut > 0 ? cut : 0);
      }
    }

    /* --- typing --- */

    async typeText(text, ctx) {
      const parts = text.split('**');
      for (let p = 0; p < parts.length; p++) {
        if (p > 0) ctx.bold = !ctx.bold;
        for (const tok of parts[p].split(/(\s+)/)) {
          if (!tok) continue;
          if (/^\s+$/.test(tok)) {
            await this.typeChars(tok, ctx);
            continue;
          }
          const c = this.confidence();
          if (ctx.typed > 0 && chance(this.b.hesitation * (1.6 - c))) {
            await this.sleep(this.t.shortPause * rand(0.5, 1.6));
          }
          const from = this.glyphs.length;
          await this.typeChars(tok, ctx);
          if (tok.length >= 3 && chance(this.b.retypeWord * (1.5 - c))) await this.retype(from, ctx);
        }
      }
    }

    async typeChars(str, ctx) {
      let i = 0;
      while (i < str.length) {
        const c = this.confidence();
        const streaming = this.b.streaming && c > 0.55;
        const maxChunk = streaming ? Math.max(1, Math.round(1 + (4 * (c - 0.55)) / 0.45)) : 1;
        const piece = str.slice(i, i + randInt(1, maxChunk));
        const delay = this.charDelay(piece, c, ctx.speed);
        for (let k = 0; k < piece.length; k++) {
          this.glyphs.push({ c: piece[k], b: ctx.bold });
          ctx.typed++;
          if (ctx.cutAt && ctx.typed >= ctx.cutAt) {
            this.ui.render(this.glyphs);
            this.ui.keys(piece.slice(0, k + 1), 0.05);
            throw new Aborted();
          }
        }
        i += piece.length;
        this.ui.render(this.glyphs);
        this.ui.keys(piece, Math.min(delay, piece.length / this.t.typingSpeed) / this.scale);
        await this.sleep(delay);
      }
    }

    charDelay(piece, c, speed) {
      const cps = (this.t.minTypingSpeed + (this.t.typingSpeed - this.t.minTypingSpeed) * c) * speed;
      let d = (piece.length / cps) * rand(0.55, 1.45);
      const last = piece[piece.length - 1];
      const doubt = 1.7 - c;
      if (/[,;:—]/.test(last)) d += rand(0.1, 0.3) * doubt;
      else if (/[.!?…]/.test(last)) d += rand(0.25, 0.6) * doubt;
      else if (last === '\n') d += rand(0.15, 0.35);
      return d;
    }

    /** Erases from `from` to the end and types exactly the same thing again. */
    async retype(from, ctx) {
      const saved = this.glyphs.slice(from);
      if (!saved.length) return;
      await this.sleep(rand(0.3, 0.9));
      await this.eraseTo(from, true);
      await this.sleep(rand(0.4, 1.4));
      const c = this.confidence();
      for (const g of saved) {
        this.glyphs.push(g);
        this.ui.render(this.glyphs);
        this.ui.keys(g.c, 0);
        await this.sleep(this.charDelay(g.c, Math.min(c, 0.4), ctx.speed));
      }
    }

    /* --- erasing --- */

    async eraseTo(target, immediate) {
      target = Math.max(0, target);
      if (target >= this.glyphs.length) return;
      if (!immediate) await this.sleep(rand(0.15, 0.5));
      // a word goes key by key; a long passage speeds up like a held backspace
      let delay = 1 / this.t.eraseSpeed;
      const floor = delay / 3;
      while (this.glyphs.length > target) {
        this.glyphs.pop();
        this.ui.render(this.glyphs);
        this.ui.backspace(1, 0);
        await this.sleep(delay * rand(0.7, 1.3));
        delay = Math.max(floor, delay * 0.96);
      }
    }

    async finalErase() {
      if (!this.glyphs.length) return;
      const mode = this.b.finalErase;
      if (mode === 'instant') {
        this.glyphs = [];
        this.ui.render(this.glyphs);
        return;
      }
      if (mode === 'fade') {
        this.ui.cursor('hidden');
        this.ui.fadeAnswer();
        await this.sleep(1.2);
        this.glyphs = [];
        this.ui.render(this.glyphs);
        this.ui.resetAnswer();
        return;
      }
      // like holding the backspace key down: slow at first, then faster
      let delay = 1 / this.t.eraseSpeed;
      const frame = 1 / 60;
      while (this.glyphs.length) {
        const n = Math.min(this.glyphs.length, delay < frame ? Math.ceil(frame / delay) : 1);
        for (let i = 0; i < n; i++) this.glyphs.pop();
        this.ui.render(this.glyphs);
        this.ui.backspace(n, Math.max(delay, frame) / this.scale);
        await this.sleep(Math.max(delay, frame));
        delay = Math.max(0.004, delay * 0.985);
      }
    }

    /* --- where an erase stops --- */

    boundary(op, floor) {
      const len = this.glyphs.length;
      switch (op.unit) {
        case 'word': return this.wordBoundary(op.n, floor);
        case 'char': return Math.max(floor, len - op.n);
        case 'sentence': return this.sentenceBoundary(floor);
        case 'line': return this.lineBoundary(floor);
        case 'half': return this.halfBoundary(floor);
        default: return floor;
      }
    }

    wordBoundary(n, floor) {
      const g = this.glyphs;
      let i = g.length;
      for (let k = 0; k < n; k++) {
        while (i > floor && isSpace(g[i - 1].c)) i--;
        while (i > floor && !isSpace(g[i - 1].c)) i--;
      }
      return i;
    }

    sentenceBoundary(floor) {
      const g = this.glyphs;
      let i = g.length;
      while (i > floor && isSpace(g[i - 1].c)) i--;
      while (i > floor && /[.!?…]/.test(g[i - 1].c)) i--;
      while (i > floor && !/[.!?…:\n]/.test(g[i - 1].c)) i--;
      while (i < g.length && g[i].c === ' ') i++;
      return i;
    }

    lineBoundary(floor) {
      const g = this.glyphs;
      let i = g.length;
      while (i > floor && g[i - 1].c === '\n') i--;
      while (i > floor && g[i - 1].c !== '\n') i--;
      return i;
    }

    halfBoundary(floor) {
      const g = this.glyphs;
      let i = floor + Math.floor((g.length - floor) / 2);
      while (i > floor && !isSpace(g[i - 1].c)) i--;
      return i;
    }
  }

  HTBH.Performer = Performer;
})(window);
