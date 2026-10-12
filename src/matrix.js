/*
 * How to Be Human — falling code behind the "matrix" theme.
 *
 * Very dim on purpose: it is a texture behind the words, not a show.
 * Drawn at a low frame rate so it stays light on a Raspberry Pi.
 */
(function (global) {
  'use strict';

  const HTBH = (global.HTBH = global.HTBH || {});

  const GLYPHS = ('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン' +
    '0123456789').split('');

  HTBH.startRain = function (canvas, opts) {
    const ctx = canvas.getContext('2d');
    const interval = 1000 / ((opts && opts.fps) || 16);
    let width = 0;
    let height = 0;
    let size = 16;
    let drops = [];

    function resize() {
      width = canvas.width = global.innerWidth;
      height = canvas.height = global.innerHeight;
      size = Math.max(12, Math.round(height / 32));
      // spread over the whole screen from the start, not all waiting above it
      const rows = Math.ceil(height / size);
      drops = Array.from({ length: Math.ceil(width / size) }, () => Math.random() * rows * 1.3 - rows * 0.3);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
    }

    function frame() {
      // fade what was drawn before, leaving trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = size + 'px "Liberation Mono", "DejaVu Sans Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * size;
        if (y > 0) {
          ctx.fillStyle = Math.random() < 0.04 ? '#c8ffd4' : '#00ff41';
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * size, y);
        }
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }

    resize();
    global.addEventListener('resize', resize);
    global.setInterval(frame, interval);
  };
})(window);
