#!/usr/bin/env node
/*
 * Runs a station many times on a virtual clock and prints statistics:
 * how long cycles last, how many attempts they contain, which tiers appear.
 * Useful when tuning timing/behaviour without watching the screen for hours.
 *
 *   node tools/simulate.js it/amare [cycles]
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const stationId = process.argv[2] || 'it/amare';
const cycles = parseInt(process.argv[3], 10) || 200;
const root = path.join(__dirname, '..');

let clock = 0;
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  performance: { now: () => clock },
  window: {},
  HTBH_CONFIG: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const run = (file) => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
run('src/engine.js');
run('config.js');

let def = null;
sandbox.HTBH.station = (d) => { def = d; };
run('stations/' + stationId + '.js');

const cfg = sandbox.HTBH_CONFIG;
const station = sandbox.HTBH.merge({}, sandbox.HTBH.DEFAULTS,
  { timing: cfg.timing, behaviour: cfg.behaviour, display: cfg.display }, def);

const log = [];
const ui = {
  render() {}, keys() {}, backspace() {}, cursor() {}, setGenerating() {}, showQuestion() {}, setInput() {},
  pressSend() {}, fadeAnswer() {}, resetAnswer() {}, nudge() {},
  debug(info) { if (info) log.push(info.attempt); }
};

const p = new sandbox.HTBH.Performer(station, ui, { speed: 1 });
p.sleep = (s) => { clock += s * 1000; return Promise.resolve(); };

(async () => {
  const stats = [];
  for (let i = 0; i < cycles; i++) {
    log.length = 0;
    const t0 = clock;
    await p.cycle();
    stats.push({ seconds: (clock - t0) / 1000, attempts: log.slice() });
  }

  const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const secs = stats.map((s) => s.seconds);
  const counts = stats.map((s) => s.attempts.length);
  const tiers = {};
  stats.forEach((s) => s.attempts.forEach((a) => {
    const t = a.split('#')[0];
    tiers[t] = (tiers[t] || 0) + 1;
  }));

  console.log('station        ' + stationId + '  (' + cycles + ' cycles)');
  console.log('cycle length   avg ' + avg(secs).toFixed(1) + 's   min ' + Math.min(...secs).toFixed(1) + 's   max ' + Math.max(...secs).toFixed(1) + 's');
  console.log('attempts/cycle avg ' + avg(counts).toFixed(1) + '   min ' + Math.min(...counts) + '   max ' + Math.max(...counts));
  console.log('tiers          ' + Object.entries(tiers).map(([k, v]) => k + ' ' + v).join('   '));
  console.log('example cycle  ' + stats[0].attempts.join(' → '));
})();
