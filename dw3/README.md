# Death Wish 3 V9990 in WebMSX

`index.html` loads WebMSX and the config `dw3.json`:

- WebMSX 6.0.8, C-BIOS embedded build (`wmsx.js`, 1.5 MB), from
  https://github.com/ppeccin/WebMSX `release/stable/6.0/cbios/embedded`. The C-BIOS
  build is the light one: no floppy drive, Kanji or MoonSound, and its own BIOS is
  replaced here anyway.
- Machine: MSX1 America (NTSC) with the Expert BIOS (`bios.rom`, through the
  custom `EXPERT` preset, applied after the machine's own BIOS setting).
- V9990 cartridge (`V9990` preset); video output on auto (`SCREEN_VIDEO_OUT: -1`):
  the internal VDP shows the BIOS boot, and WebMSX switches to the V9990 when the
  game turns its display on. The V9990 button on the control bar cycles the
  outputs by hand (auto, internal, V9990, superimposed, mixed).
- VSync off (`VSYNCOFF`); no screen post-processing: CRT scanlines and phosphor
  off, smoothing filter level 0; no RTC.
- `dw3_v9990.rom` in cartridge slot 1: the 1 MB ASCII16 MegaROM
  (`CARTRIDGE1_FORMAT: ASCII16`, so WebMSX does not have to guess the mapper).
- Controls: cursor keys move, SPACE fires, F7 (SELECT) changes weapon, F8 (STOP)
  pauses. A joystick works too.
- Browsers mute audio until the page gets a user gesture; a click on the
  emulator screen (or a key press) unmutes it.

Browsers don't let a page fetch files over `file://`, so serve the folder:
`python3 -m http.server -d release 8000`, then open http://localhost:8000/.
