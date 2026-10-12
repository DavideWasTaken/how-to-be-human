#!/usr/bin/env bash
#
# How to Be Human — kiosk launcher.
# Started automatically on tty1 (see install.sh). Opens the conversation
# fullscreen with no browser interface, inside the `cage` kiosk compositor.
#
# What it shows is set in config.js. For a quick test without editing it,
# create pi/kiosk.conf with e.g.  QUERY="lang=en&speed=3&debug"
#
set -u

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
QUERY=""

# shellcheck disable=SC1091
[ -f "$APP_DIR/pi/kiosk.conf" ] && . "$APP_DIR/pi/kiosk.conf"

BROWSER="$(command -v chromium || command -v chromium-browser)"
URL="file://$APP_DIR/index.html${QUERY:+?$QUERY}"
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
