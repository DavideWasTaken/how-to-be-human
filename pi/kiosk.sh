#!/usr/bin/env bash
#
# How to Be Human — kiosk launcher.
# Started automatically on tty1 (see install.sh). Opens this station's topic
# fullscreen with no browser interface, inside the `cage` kiosk compositor.
#
# The topic is chosen, in order of priority, by:
#   1. how-to-be-human.txt on the SD card boot partition (one line, e.g.
#      it/paura) — editable from any computer
#   2. TOPIC in pi/kiosk.conf, written by install.sh
#   3. `topic` in config.js
# pi/kiosk.conf can also hold extra address options, e.g. QUERY="speed=3&debug"
#
set -u

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TOPIC=""
QUERY=""

# shellcheck disable=SC1091
[ -f "$APP_DIR/pi/kiosk.conf" ] && . "$APP_DIR/pi/kiosk.conf"

for f in /boot/firmware/how-to-be-human.txt /boot/how-to-be-human.txt; do
  if [ -f "$f" ]; then
    t="$(grep -v '^[[:space:]]*#' "$f" | tr -d ' \r\t' | grep -m 1 . || true)"
    [ -n "$t" ] && TOPIC="$t"
    break
  fi
done

ARGS="${TOPIC:+topic=$TOPIC}"
[ -n "$QUERY" ] && ARGS="${ARGS:+$ARGS&}$QUERY"

BROWSER="$(command -v chromium || command -v chromium-browser)"
URL="file://$APP_DIR/index.html${ARGS:+?$ARGS}"
PROFILE="$HOME/.cache/how-to-be-human/chromium"
mkdir -p "$PROFILE"

exec "$BROWSER" \
  --kiosk \
  --user-data-dir="$PROFILE" \
  --ozone-platform=wayland \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --no-default-browser-check \
  --disable-session-crashed-bubble \
  --disable-features=Translate,TranslateUI,OverscrollHistoryNavigation \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --check-for-update-interval=31536000 \
  --password-store=basic \
  --autoplay-policy=no-user-gesture-required \
  --incognito \
  "$URL"
