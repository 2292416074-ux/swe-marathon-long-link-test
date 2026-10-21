import {Easing, interpolate} from 'remotion';

/**
 * Timeline of the 8 second piece.
 *
 * 0.00 - 0.75  poster settles out of a punch-in (scale 1.24 -> 1.00)
 * 0.75 - 1.50  slow drift, title collage holds
 * 1.50 - 2.45  whip-pan up the poster, motion blur peaks
 * 2.00 - 3.10  table rows + scores land, staggered
 * 4.30 - 4.75  highlighter swipes the score column
 * 5.60 - 6.15  "也就是说" beat, then final hold
 */
export const BEATS = {
  introHold: 22,
  panStart: 45,
  panEnd: 74,
  settle: 96,
  tableTitle: 56,
  rowIn: [62, 70, 78],
  scoreIn: [70, 79, 88],
  markerSwipe: [130, 142],
  finalHold: 186,
} as const;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Piecewise camera pan down the poster. */
export const cameraOffset = (frame: number): number =>
  interpolate(
    frame,
    [0, 20, 30, 45, 57, 65, 74, 88, 240],
    [0, 0, 26, 170, 530, 648, 737, 752, 756],
    {...clamp, easing: Easing.inOut(Easing.cubic)},
  );

/** Punch-in that relaxes into the locked-off shot. */
export const cameraScale = (frame: number): number =>
  interpolate(frame, [0, 12, 26, 48, 96, 240], [1.24, 1.14, 1.045, 1.012, 1.0, 1.018], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

/** Paper sits a hair off-axis, like a photographed sheet. */
export const cameraRotation = (frame: number): number =>
  interpolate(frame, [0, 40, 90, 240], [1.9, 1.45, 1.25, 1.05], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

/**
 * Blur driven by the derivative of the pan: the reference is very soft through
 * the whip-pan and perfectly sharp once the table locks in.
 */
export const cameraBlur = (frame: number): number => {
  const v = Math.abs(cameraOffset(frame + 1) - cameraOffset(frame - 1)) / 2;
  const zoom = Math.abs(cameraScale(frame + 1) - cameraScale(frame - 1)) / 2;
  return Math.min(9, v * 0.115 + zoom * 900);
};

export type CaptionCue = {
  from: number;
  to: number;
  text: string;
  /** Reference subtitle had a hard cut on some lines, a 4 frame fade on others. */
  fade?: number;
};

/** Captions transcribed from the reference, held in the same order. */
export const CAPTIONS: CaptionCue[] = [
  {from: 0, to: 58, text: '在这项长链路的测试里边', fade: 6},
  {from: 60, to: 88, text: 'K3拿了42分', fade: 4},
  {from: 90, to: 166, text: '比Fable 5的35分高出了7分', fade: 4},
  {from: 168, to: 184, text: '也就是说', fade: 3},
  {from: 186, to: 240, text: 'K3赢的不只是页面做的好不好看', fade: 4},
];

export type ScoreRow = {
  name: string;
  score: string;
  /** Local y of the label's cap line. */
  top: number;
};

export const ROWS: ScoreRow[] = [
  {name: 'Kimi K3', score: '42.0', top: 153},
  {name: 'Fable 5', score: '35.0', top: 293},
  {name: 'GPT-5.6Sol', score: '39.0', top: 437},
];

/** Deterministic 0..1 jitter, used for hand-drawn edges. */
export const noise = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
