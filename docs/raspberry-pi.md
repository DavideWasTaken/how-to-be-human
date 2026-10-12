# Running on a Raspberry Pi

The goal: plug in the Pi, and a few seconds later the conversation is running fullscreen on the monitor. No desktop, no browser interface, no mouse or keyboard, nothing to start by hand.

How it works: the Pi logs in automatically on its first console and launches [cage](https://github.com/cage-kiosk/cage), a minimal kiosk compositor that can show exactly one application fullscreen. That application is Chromium in kiosk mode, opening `index.html` from the SD card. Nothing needs the internet once installed.

- [What you need](#what-you-need)
- [Installation](#installation)
- [Changing what it shows](#changing-what-it-shows)
- [Connecting a CRT](#connecting-a-crt)
- [For a long exhibition](#for-a-long-exhibition)
- [Troubleshooting](#troubleshooting)

## What you need

- **Raspberry Pi 4** (2 GB or more) or **Raspberry Pi 5**. A Pi 3B+ works too. A Pi Zero 2 W can run it but Chromium is slow on it.
- A microSD card, 16 GB or more
- The monitor and the right cable (see [Connecting a CRT](#connecting-a-crt))
- A computer to prepare the SD card

## Installation

### 1. Prepare the SD card

With [Raspberry Pi Imager](https://www.raspberrypi.com/software/):

1. Choose your Pi model and **Raspberry Pi OS Lite (64-bit)**. Lite has no desktop, which is what we want.
2. Open the settings (*Edit settings*) and set a username and password, your Wi-Fi network, and enable **SSH**.
3. Write the card, put it in the Pi, power it on.

### 2. Get the project onto the Pi

Connect from your computer (`ssh <username>@<pi-name>.local`) and run:

```bash
sudo apt-get install -y git
git clone https://github.com/DavideWasTaken/how-to-be-human.git
cd how-to-be-human
```

> No internet at the venue? Copy the folder to the Pi with a USB stick or `scp -r how-to-be-human <username>@<pi-name>.local:~` instead.

### 3. Install

```bash
./pi/install.sh
sudo reboot
```

The script:

1. installs `cage`, `chromium` and the fonts
2. turns on automatic login on the console
3. adds a few lines to `~/.profile` that start the conversation on the first console, and restart it if it ever closes
4. hides boot messages and disables screen blanking (the original `cmdline.txt` is saved as `cmdline.txt.htbh-backup`)

After the reboot the conversation starts by itself. This is what happens every time the Pi is powered on:

```
power on → quiet boot → automatic login on tty1 → ~/.profile starts cage
        → cage opens Chromium in kiosk mode, fullscreen → index.html
```

Chromium runs with no address bar, no tabs, no error dialogs and no "restore pages" prompt, and the mouse pointer is hidden. If Chromium ever closes or crashes, it is started again after two seconds. Sound is allowed to play without anyone touching the page.

### Sound

The keyboard clicks play on the Pi's default audio output. Choose it with `sudo raspi-config` → *System Options* → *Audio*:

- **HDMI**: the sound goes to the monitor or to an HDMI-to-VGA adapter with an audio jack
- **Headphones / AV jack** (Pi 4, Pi 3): small active speakers, or the red and white plugs of the composite AV cable straight into the television

Set the volume with `alsamixer`, or with `sound.volume` in `config.js`. To switch the sound off: `sound: { enabled: false }`.

### Updating

```bash
cd ~/how-to-be-human && git pull && sudo reboot
```

### Uninstalling

```bash
./pi/uninstall.sh
```

## Changing what it shows

Everything is in `config.js` in the project folder: which questions are asked and in what order, the language, the look (`chat` or `minimal`), text size, sound volume. Edit it on the Pi (`nano ~/how-to-be-human/config.js`) and restart the browser with `pkill -f chromium`, or reboot. See [configuration.md](configuration.md).

To try something without editing `config.js`, create `pi/kiosk.conf` with address options, for example the English conversation three times faster:

```bash
echo 'QUERY="lang=en&speed=3&debug"' > ~/how-to-be-human/pi/kiosk.conf
```

Delete the file to go back to normal.

## Connecting a CRT

### Composite video (TV-style CRTs, yellow RCA plug)

Composite is the most authentic signal for an old CRT television.

| Model | Where the composite signal is |
|---|---|
| Pi 4, Pi 3 | the 3.5 mm audio/video jack. You need a 4-pole AV cable wired for the Raspberry Pi; camcorder cables often have the video on a different ring |
| Pi 5 | no jack: two small solder pads on the board (signal and ground). Check the official documentation for their position |
| Pi Zero 2 W | the `TV` pads on the board |

Then edit two files on the boot partition (from the Pi with `sudo nano /boot/firmware/config.txt`, or from a computer):

**`config.txt`:** find the line `dtoverlay=vc4-kms-v3d` and change it to:

```ini
dtoverlay=vc4-kms-v3d,composite
```

On a **Pi 4**, also add this line (composite is disabled by default to save power):

```ini
enable_tvout=1
```

**`cmdline.txt`:** this file is a single line. Add at the end of it, on the same line, separated by a space:

```
video=Composite-1:720x576@50ie,tv_mode=PAL
```

PAL is the standard in Italy and most of Europe. For an NTSC television (Americas, Japan) use `video=Composite-1:720x480@60ie,tv_mode=NTSC` instead.

The details change slightly between Pi models and OS releases; if the picture does not appear, check the official [display documentation](https://www.raspberrypi.com/documentation/computers/config_txt.html#video-options).

Composite is soft and interlaced, so thin lines shimmer. In `config.js`, a slightly bigger text and larger margins help:

```js
display: { textSize: 1.15, overscan: 7 }
```

On a small television, the `minimal` layout (only the words, large serif type) is often easier to read from a distance than the chat interface:

```js
display: { layout: 'minimal', overscan: 7 }
```

### VGA (computer CRT monitors)

Use an **active HDMI-to-VGA adapter** (they cost a few euros). Most VGA CRTs look sharpest at 800×600 or 1024×768. To force a resolution, add to `cmdline.txt` (same single line):

```
video=HDMI-A-1:800x600@60
```

Some monitors are more comfortable to look at at 75 or 85 Hz: `800x600@75`.

### Overscan

CRTs often cut off the edges of the picture. Instead of the firmware overscan settings, increase `display.overscan` (in % of the screen) until the input box and the header are fully visible.

## For a long exhibition

**Burn-in.** The header and the input box never move, and CRTs can mark permanently over weeks. `display.antiBurnIn` (on by default) shifts the whole layout by a few pixels every cycle. Turning the monitors off at night helps much more.

**Power cuts.** If the installation is switched on and off at the mains every day, protect the SD card by making it read-only: `sudo raspi-config` → *Performance Options* → *Overlay File System* → enable it, and reboot. To change anything later (`config.js`, updates), disable it again the same way.

**A timer socket** that cuts power at closing time and restores it in the morning is all that is needed: the Pi starts the conversation on its own every time.

## Troubleshooting

**The console with a login prompt appears instead of the conversation.** Automatic login is off. Run `sudo raspi-config nonint do_boot_behaviour B2` and reboot.

**Black screen, or the conversation does not start.** Connect a keyboard, press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F2</kbd> to get a second console, log in, and start it by hand to see the error:

```bash
cage -- ~/how-to-be-human/pi/kiosk.sh
```

**"No questions found"** in small grey letters. The names in `conversation` in `config.js` do not match files in `questions/`. Names are like `it/amare`: language folder, slash, file name without `.js`.

**Restart without rebooting:** `pkill -f chromium` over SSH. It comes back after two seconds.

**Watch it faster on the Pi:** put `QUERY="speed=3&debug"` in `pi/kiosk.conf` and restart. Delete the file afterwards.
