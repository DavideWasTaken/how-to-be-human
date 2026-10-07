#!/usr/bin/env bash
#
# How to Be Human — removes the kiosk autostart. Packages are left installed.
#
set -euo pipefail

MARK_BEGIN="# >>> how-to-be-human >>>"
MARK_END="# <<< how-to-be-human <<<"

for f in "$HOME/.profile" "$HOME/.bash_profile"; do
  [ -f "$f" ] && sed -i "/$MARK_BEGIN/,/$MARK_END/d" "$f"
done

CMDLINE=/boot/firmware/cmdline.txt
[ -f "$CMDLINE" ] || CMDLINE=/boot/cmdline.txt
if [ -f "$CMDLINE.htbh-backup" ]; then
  sudo cp "$CMDLINE.htbh-backup" "$CMDLINE"
  echo "Restored $CMDLINE"
fi

echo "Kiosk autostart removed. Auto-login is still on: change it with  sudo raspi-config  (System → Boot / Auto Login)."
