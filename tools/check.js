#!/usr/bin/env node
/*
 * Checks every topic of a conversation in config.js: the files load, the
 * follow-up conversations are complete, no markup command is misspelled.
 * Also prints how long each follow-up conversation takes on a virtual clock.
 *
 *   node tools/check.js        # Italian conversation
 *   node tools/check.js en
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const lang = process.argv[2] || 'it';

let clock = 0;
const warnings = [];
const sandbox = {
  console: { warn: (m) => warnings.push(m), log: console.log, error: console.error },
  setTimeout,
  clearTimeout,
  performance: { now: () => clock },
  HTBH_CONFIG: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const run = (file) => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
run('src/engine.js');
run('config.js');

const H = sandbox.HTBH;
const ui = new Proxy({}, { get: () => () => {} });

(async () => {
  const ids = (sandbox.HTBH_CONFIG.conversation || {})[lang] || [];
  if (!ids.length) throw new Error('no conversation for "' + lang + '" in config.js');

  for (const id of ids) {
    let def = null;
    H.question = H.station = (d) => { def = d; };
    run('questions/' + id + '.js');
    new H.Performer(H.merge({}, H.DEFAULTS, def), ui, {}); // throws if the first answer has no attempts

    const followUps = def.followUps || [];
    const times = [];
    for (const conversation of followUps) {
      let total = 0;
      for (const [k, turn] of conversation.entries()) {
        if (!turn.ask) throw new Error(id + ': a follow-up message has no "ask"');
        const settings = H.merge({}, H.DEFAULTS, { timing: { cycleSeconds: H.DEFAULTS.timing.followUpSeconds } }, turn);
        if (turn.seconds) settings.timing.cycleSeconds = turn.seconds;
        const p = new H.Performer(settings, ui, {});
        p.sleep = (s) => { clock += s * 1000; return Promise.resolve(); };
        const t0 = clock;
        await p.answer({ startConfidence: Math.max(0.45, 1 - 0.15 * (k + 1)) });
        total += (clock - t0) / 1000;
      }
      times.push(Math.round(total) + 's');
    }

    console.log(
      id.padEnd(14) +
      'follow-up conversations: ' + followUps.length +
      (followUps.length ? '   messages: ' + followUps.map((c) => c.length).join('/') + '   answer time: ' + times.join(' ') : '')
    );
  }
  console.log(warnings.length ? '\nWARNINGS:\n' + warnings.join('\n') : '\nall good: no unknown commands');
})().catch((e) => {
  console.error('ERROR: ' + e.message);
  process.exit(1);
});
