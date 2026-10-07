#!/usr/bin/env bash
#
# How to Be Human — Raspberry Pi installer.
#
#   ./pi/install.sh                 # installs with the default station (it/amare)
#   ./pi/install.sh it/pensare      # installs and selects a station
#
# Tested target: Raspberry Pi OS Lite (Bookworm or newer), run as the normal
# user (not root). After a reboot the Pi starts straight into the station:
# no desktop, no browser chrome, no mouse or keyboard needed.
#
set -euo pipefail

STATION="${1:-it/amare}"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MARK_BEGIN="# >>> how-to-be-human >>>"
MARK_END="# <<< how-to-be-human <<<"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

if [ "$(id -u)" -eq 0 ]; then
  echo "Run this as your normal user (e.g. pi), not with sudo. It will ask for sudo when needed."
  exit 1
fi

if [ ! -f "$APP_DIR/stations/$STATION.js" ]; then
  echo "Station not found: stations/$STATION.js"
  echo "Available:"; (cd "$APP_DIR/stations" && find . -name '*.js' ! -name '_*' | sed 's|^\./||; s|\.js$||' | sort)
  exit 1
fi

say "1/5  Installing packages (cage, chromium, fonts)"
sudo apt-get update
sudo apt-get install -y --no-install-recommends cage
if apt-cache show chromium >/dev/null 2>&1; then
  sudo apt-get install -y --no-install-recommends chromium
else
  sudo apt-get install -y --no-install-recommends chromium-browser
fi
# Inter for the chat layout, Liberation Serif for the minimal layout
sudo apt-get install -y --no-install-recommends fonts-inter fonts-liberation \
  || echo "Some fonts are not available — falling back to system fonts."

say "2/5  Selecting station: $STATION"
printf 'STATION=%s\n' "$STATION" > "$APP_DIR/pi/station.conf"
chmod +x "$APP_DIR/pi/kiosk.sh"

say "3/5  Enabling console auto-login"
sudo raspi-config nonint do_boot_behaviour B2
touch "$HOME/.hushlogin"

say "4/5  Starting the kiosk on boot"
PROFILE_FILE="$HOME/.bash_profile"
touch "$PROFILE_FILE"
sed -i "/$MARK_BEGIN/,/$MARK_END/d" "$PROFILE_FILE"
cat >> "$PROFILE_FILE" <<EOF
$MARK_BEGIN
# Start How to Be Human fullscreen on the first console. Restarts if it ever closes.
if [ -z "\${WAYLAND_DISPLAY:-}" ] && [ "\$(tty)" = "/dev/tty1" ]; then
  while true; do
    cage -s -- "$APP_DIR/pi/kiosk.sh" >/dev/null 2>&1
    sleep 2
  done
fi
$MARK_END
EOF

say "5/5  Quiet boot and no screen blanking"
CMDLINE=/boot/firmware/cmdline.txt
[ -f "$CMDLINE" ] || CMDLINE=/boot/cmdline.txt
sudo cp -n "$CMDLINE" "$CMDLINE.htbh-backup" || true
for opt in consoleblank=0 quiet loglevel=3 logo.nologo vt.global_cursor_default=0; do
  grep -qw -- "$opt" "$CMDLINE" || sudo sed -i "1 s|\$| $opt|" "$CMDLINE"
done

say "Done."
echo "Station: $STATION"
echo "Reboot to start:  sudo reboot"
echo "Change station later by editing how-to-be-human.txt on the SD card boot partition,"
echo "or by running this script again with another station name."
