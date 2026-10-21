# SWE Marathon — 长链路测试

A frame-accurate-feeling **Remotion** recreation of an 8 second editorial motion
graphic: a photographed sheet of paper, heavy Ming display type printed with
registration ghosts, two gear cut-outs, a dotted "chain" that runs into a
leaderboard, and a highlighter swipe over the scores.

| | |
|---|---|
| Format | 1920 × 1080, 30 fps, 240 frames (8.0 s) |
| Composition id | `LongLinkTest` |
| Source clip | `1f6419af-0fba-4b69-b76f-55bdc6196a29` ("8月27日 (2)(1)-15") |
| Audio | none — the original narration/music is not reproduced |

![Preview](docs/preview.png)

## What the rebuild reproduces

**Look.** Warm grey paper stock generated from value noise (broad pulp cloud,
fibre streaks, dust, two soft creases), a halftone screen, film grain cycled
across three baked plates, a projector vignette, and a touch of chromatic
fringing. Everything is composited at 1920×1080 with a 0.45 px base softness so
the render reads as a photographed print rather than flat UI.

**Camera.** The whole collage lives on a 1920 × 2600 poster. A virtual camera
punches in at 1.24×, relaxes to 1.0×, then whip-pans 752 px down the sheet to
the leaderboard. The pan is velocity-driven: Gaussian blur and the settle are
computed from the derivative of the camera track, which is why the whip-pan
smears and the table snaps into focus.

**Typography.** Black Songti for 长链路测试, italic Times for *SWE Marathon*,
Arial Black for the leaderboard, Helvetica for the red *Long link testing*
kicker, PingFang for the captions. Font stacks are macOS-first with free
fallbacks (see `src/theme.ts`).

**Motion, beat by beat**

| Time | Beat |
|---|---|
| 0.00–0.75 | punch-in settles, ghosts mis-register, grain runs |
| 0.75–1.50 | hold on the title collage; gears drift, hands breathe |
| 1.50–2.45 | whip-pan down the poster with motion blur |
| 1.85–3.10 | table title, rows and scores land in a stagger; scores reveal per glyph |
| 4.30–4.75 | two ragged highlighter strokes wipe over 42.0 / 35.0 |
| 5.60–6.15 | "也就是说" beat |
| 6.15–8.00 | final hold on the marked-up table |

Captions are transcribed from the source and cut on the same beats:

```
在这项长链路的测试里边   K3拿了42分   比Fable 5的35分高出了7分
也就是说                 K3赢的不只是页面做的好不好看
```

## Run it

```bash
npm install          # Node 18+; package-lock.json is committed
npm run dev          # Remotion Studio at http://localhost:3000
npm run render       # -> out/long-link-test.mp4
npm run still        # -> out/poster.png (frame 150)
npm run typecheck
```

`npm run render` writes H.264 / yuv420p at CRF 16. Remotion downloads its own
Chrome Headless Shell on first run.

## Project layout

```
src/
  index.ts               entry (registerRoot + global css)
  Root.tsx               composition registration
  LongLinkTest.tsx       scene assembly
  theme.ts               colours, font stacks, stage/poster/table geometry
  timeline.ts            camera track, blur, caption cues, row timing
  components/
    Camera.tsx           poster camera: pan + scale + rotation + velocity blur
    Paper.tsx            paper stock, grain, halftone, vignette, fringe, haze
    IntroCollage.tsx     title lock-up, gears, dotted chain, kicker
    ScoreTable.tsx       rules, mixed-script title, rows, per-glyph score reveal
    Marker.tsx           hand-wobbled highlighter polygons + wipe
    Foreground.tsx       screen-space hands and defocused debris
    Captions.tsx         lower-third cues
public/assets/           paper, grain plates, generated gear + hand cut-outs
tools/                   deterministic texture + cut-out generators
```

## Rebuilding the textures

The paper stock, grain plates and the alpha cut-outs are reproducible:

```bash
python3 tools/make-textures.py     # needs numpy + Pillow
python3 tools/cutout-assets.py     # keys the generated hand plates
```

The gear and hand photographs in `public/assets` were generated for this
project (plain white studio cut-outs), then trimmed, keyed and graded. The
textures are synthetic, so the repository ships no third-party imagery. No frame
of the reference clip is included — the reference was used only for timing,
composition and palette analysis.

## Notes

- **Fonts.** On macOS the piece uses Songti SC / Times / Arial Black /
  Helvetica Neue / PingFang SC. On other systems it falls back to Noto Serif SC,
  Noto Sans SC and the generic serif/sans stacks; letter-spacing and a couple of
  `scaleX` values in `ScoreTable.tsx` are tuned for the macOS faces.
- **Audio.** The source has narration. This rebuild is intentionally silent —
  drop an audio file in and add `<Audio src={staticFile('audio.mp3')} />` if you
  want it scored.
- **Tuning.** Camera keyframes live in `src/timeline.ts`; table geometry lives in
  `src/theme.ts`. Both are plain numbers, so the whole piece re-times without
  touching a component.

MIT licensed.
