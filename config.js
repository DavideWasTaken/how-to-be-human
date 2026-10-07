/*
 * How to Be Human — global configuration.
 *
 * `station` is the station shown when the URL does not say otherwise
 * (index.html?station=it/amare). On the Raspberry Pi the station is set by
 * pi/station.conf or by a file on the SD card — see docs/raspberry-pi.md.
 *
 * Anything in `timing`, `behaviour` or `display` here applies to every
 * station, and each station file can still override it.
 */
window.HTBH_CONFIG = {
  station: 'it/amare',

  timing: {},
  behaviour: {},
  display: {},     // e.g. { layout: 'minimal' }
  sound: {}        // e.g. { volume: 0.2 } or { enabled: false }
};
