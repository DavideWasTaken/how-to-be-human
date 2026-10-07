#!/usr/bin/env bash
#
# How to Be Human — kiosk launcher.
# Started automatically on tty1 (see install.sh). Opens the station fullscreen
# with no browser interface, inside the `cage` kiosk compositor.
#
# Station is chosen, in order of priority, by:
#   1. a text file on the SD card boot partition:  how-to-be-human.txt
#      (one line, e.g.  it/amare  — editable from any computer)
#   2. pi/station.conf, written by install.sh
#   3. the default below
#
set -u

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATION="it/amare"
EXTRA_QUERY=""

# shellcheck disable=SC1091
[ -f "$APP_DIR/pi/station.conf" ] && . "$APP_DIR/pi/station.conf"

for f in /boot/firmware/how-to-be-human.txt /boot/how-to-be-human.txt; do
  if [ -f "$f" ]; then
    s="$(grep -v '^\s*#' "$f" | tr -d ' \r\t' | head -n 1)"
    [ -n "$s" ] && STATION="$s"
    break
  fi
done

BROWSER="$(command -v chromium || command -v chromium-browser)"
URL="file://$APP_DIR/index.html?station=$STATION$EXTRA_QUERY"
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
