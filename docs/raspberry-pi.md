# Running on a Raspberry Pi

The goal: plug in the Pi, and a few seconds later the station is running fullscreen on the monitor. No desktop, no browser interface, no mouse or keyboard, nothing to start by hand.

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
./pi/install.sh it/paura
sudo reboot
```

Replace `it/paura` with this station's topic (the list is in [Choosing the topic](#choosing-the-topic)). The script:

1. installs `cage`, `chromium` and the fonts
2. saves the topic in `pi/kiosk.conf`
3. turns on automatic login on the console
4. adds a few lines to `~/.profile` that start the station on the first console, and restart it if it ever closes
5. hides boot messages and disables screen blanking (the original `cmdline.txt` is saved as `cmdline.txt.htbh-backup`)

After the reboot the station starts by itself. This is what happens every time the Pi is powered on:

```
power on → quiet boot → automatic login on tty1 → ~/.profile starts cage
        → cage opens Chromium in kiosk mode, fullscreen → index.html?topic=it/paura
```

Chromium runs with no address bar, no tabs, no error dialogs and no "restore pages" prompt, and the mouse pointer is hidden. If Chromium ever closes or crashes, it is started again after two seconds.

### Updating

```bash
cd ~/how-to-be-human && git pull && sudo reboot
```

### Uninstalling

```bash
./pi/uninstall.sh
```

## Choosing the topic

Each station shows one topic. Three ways to set it, from the most convenient:

**From any computer, without connecting to the Pi.** Copy [`pi/how-to-be-human.txt`](../pi/how-to-be-human.txt) to the SD card's boot partition (the small partition that Windows and macOS can open, called `bootfs`) and write the topic on its last line:

```
it/paura
```

This file wins over everything else, so you can prepare identical SD cards and give each station its topic with a text editor.

| Topic | Question |
|---|---|
| `it/pensare` | Come faccio a pensare? |
| `it/chi-sono` | Come faccio a capire chi sono? |
| `it/amare` | Come faccio ad amare? |
| `it/felice` | Come faccio a essere felice? |
| `it/vero` | Come faccio a sapere cosa è vero? |
| `it/paura` | Come faccio a non avere paura? |
| `it/sognare` | Come faccio a sognare? |
| `en/think` `en/who-am-i` `en/love` `en/happy` `en/true` `en/afraid` `en/dream` | the same in English |

**By running the installer again:** `./pi/install.sh it/sognare`

**In `config.js`** (`topic: 'it/amare'`), which is used when neither of the above is set.

## Changing the look and the rest

Everything else is in `config.js` in the project folder: the look (`chat`, `minimal`, or the `matrix` and `dark` themes), text size, timing. Edit it on the Pi (`nano ~/how-to-be-human/config.js`) and restart the browser with `pkill -f chromium`, or reboot. See [configuration.md](configuration.md).

To try something without editing `config.js`, add address options to `pi/kiosk.conf`, for example three times faster with the debug overlay:

```bash
echo 'QUERY="speed=3&debug"' >> ~/how-to-be-human/pi/kiosk.conf
```

Remove that line to go back to normal.

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

For a black screen, the `matrix` theme (green phosphor text with a soft glow and dim falling code) suits a CRT particularly well; `dark` is the same in white, without the falling code:

```js
display: { theme: 'matrix', overscan: 7 }
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

**A timer socket** that cuts power at closing time and restores it in the morning is all that is needed: the Pi starts its station on its own every time.

## Troubleshooting

**The console with a login prompt appears instead of the station.** Automatic login is off. Run `sudo raspi-config nonint do_boot_behaviour B2` and reboot.

**Black screen, or the station does not start.** Connect a keyboard, press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F2</kbd> to get a second console, log in, and start it by hand to see the error:

```bash
cage -- ~/how-to-be-human/pi/kiosk.sh
```

**"No questions found"** in small grey letters. The topic (in `how-to-be-human.txt`, `pi/kiosk.conf` or `config.js`) does not match a file in `questions/`. Topics are like `it/amare`: language folder, slash, file name without `.js`.

**Restart without rebooting:** `pkill -f chromium` over SSH. It comes back after two seconds.

**Watch it faster on the Pi:** add the line `QUERY="speed=3&debug"` to `pi/kiosk.conf` and restart. Remove it afterwards.
