/*
 * How to Be Human — keyboard sound.
 *
 * Every character that appears on screen is a key press; every character
 * that disappears is a backspace. Clicks are synthesised (no audio files):
 * a short filtered noise burst for the plastic tick, plus a soft low tone for
 * the key bottoming out. Space, enter and backspace each sound a little
 * different, and every press varies slightly, like a real keyboard.
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});

  const PROFILES = {
    key:       { freq: 3200, q: 1.2, gain: 0.5,  decay: 0.028, body: 220, bodyGain: 0.12 },
    space:     { freq: 1500, q: 0.9, gain: 0.45, decay: 0.045, body: 140, bodyGain: 0.18 },
    enter:     { freq: 1900, q: 0.9, gain: 0.55, decay: 0.05,  body: 160, bodyGain: 0.2 },
    backspace: { freq: 2600, q: 1.1, gain: 0.45, decay: 0.032, body: 190, bodyGain: 0.12 }
  };

  // a held key repeats at most this often; faster erasing is thinned out
  const MIN_GAP = 0.016;

  class KeySound {
    constructor(opts) {
      this.enabled = !!opts.enabled;
      this.ctx = null;
      if (!this.enabled) return;

      const AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) {
        this.enabled = false;
        return;
      }
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = opts.volume;
      const soften = this.ctx.createBiquadFilter();
      soften.type = 'lowpass';
      soften.frequency.value = 6000;
      this.master.connect(soften);
      soften.connect(this.ctx.destination);

      const len = Math.floor(this.ctx.sampleRate * 0.3);
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

      // browsers start audio suspended until a gesture; the Pi kiosk allows it outright
      const unlock = () => this.resume();
      ['keydown', 'pointerdown', 'touchstart'].forEach((e) => global.addEventListener(e, unlock));
      this.resume();
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    }

    ready() {
      return this.enabled && this.ctx.state === 'running';
    }

    click(at, kind) {
      const ctx = this.ctx;
      const p = PROFILES[kind];
      const v = 0.8 + Math.random() * 0.4;

      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const band = ctx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.value = p.freq * (0.88 + Math.random() * 0.24);
      band.Q.value = p.q;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(p.gain * v, at + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, at + p.decay);
      src.connect(band);
      band.connect(g);
      g.connect(this.master);
      src.start(at, Math.random() * 0.25, p.decay + 0.02);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(p.body * (0.93 + Math.random() * 0.14), at);
      osc.frequency.exponentialRampToValueAtTime(p.body * 0.6, at + p.decay);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, at);
      og.gain.exponentialRampToValueAtTime(p.bodyGain * v, at + 0.003);
      og.gain.exponentialRampToValueAtTime(0.0001, at + p.decay * 1.2);
      osc.connect(og);
      og.connect(this.master);
      osc.start(at);
      osc.stop(at + p.decay * 1.3);
    }

    /** One press per character, spread over `span` seconds when text arrives in a chunk. */
    typed(text, span) {
      if (!this.ready() || !text) return;
      const n = text.length;
      const step = n > 1 ? Math.max(MIN_GAP, Math.min(span / n, 0.09)) : 0;
      const t0 = this.ctx.currentTime + 0.005;
      for (let i = 0; i < n; i++) {
        const ch = text[i];
        const kind = ch === ' ' ? 'space' : ch === '\n' ? 'enter' : 'key';
        this.click(t0 + i * step + (i ? Math.random() * step * 0.3 : 0), kind);
      }
    }

    /** `count` backspace presses over `span` seconds. */
    erased(count, span) {
      if (!this.ready() || count < 1) return;
      const presses = Math.max(1, Math.min(count, Math.floor(span / MIN_GAP)));
      const step = presses > 1 ? span / presses : 0;
      const t0 = this.ctx.currentTime + 0.005;
      for (let i = 0; i < presses; i++) this.click(t0 + i * step, 'backspace');
    }
  }

  HTBH.KeySound = KeySound;
})(window);
