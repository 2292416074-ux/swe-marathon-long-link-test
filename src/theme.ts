/**
 * Design tokens for the "paper collage" look.
 *
 * Everything is tuned against the reference frames: warm grey paper stock,
 * near-black ink, a single red accent for the English kicker and a highlighter
 * yellow for the score call-out.
 */

export const COLORS = {
  paper: '#d6d3cc',
  paperShadow: '#b9b7b1',
  ink: '#131313',
  inkSoft: '#2b2b29',
  red: '#cf2024',
  marker: '#f2b705',
  caption: '#fdfdfb',
  hairline: 'rgba(20, 20, 20, 0.28)',
} as const;

/**
 * macOS-first stacks: Songti SC is the exact Ming/Song face family the
 * reference uses; Noto Serif SC is the free fallback for other platforms.
 */
export const FONTS = {
  serif:
    '"Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", "Times New Roman", serif',
  latinSerif: '"Times New Roman", "Noto Serif SC", "Songti SC", serif',
  heavy:
    '"Arial Black", "Helvetica Neue", "Archivo", "Inter", "PingFang SC", "Noto Sans SC", Arial, sans-serif',
  sans:
    '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
} as const;

/** Frame geometry of the 1920x1080 stage. */
export const STAGE = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 240,
} as const;

/** The collage is a tall poster that the virtual camera pans across. */
export const POSTER = {
  width: 1920,
  height: 2600,
  /** Poster-space y of the table block (title sits at local y = 0). */
  tableTop: 1440,
  /** Final camera offset; table title lands at screen y = 295. */
  tableOffset: 1148,
} as const;

/** Table geometry, in table-local pixels (screen space at rest). */
export const TABLE = {
  titleTop: 0,
  titleLeft: 400,
  labelLeft: 400,
  scoreRight: 1530,
  verticalRuleX: 960,
  ruleTopY: 95,
  ruleBottomY: 505,
  rowTops: [153, 293, 437],
  rowRules: [265, 405, 545],
  marker: {left: 1076, right: 1586, top: 135, bottom: 398},
} as const;
