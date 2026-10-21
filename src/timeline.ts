import {Easing, interpolate} from 'remotion';
import {monotoneCubic} from './lib/spline';

/**
 * Timeline of the 8 second piece, in frames @30fps.
 *
 * The camera track is *measured* from the reference (following the red
 * "Long link testing" kicker through scene 1 and the "SWE Marathon" header
 * through scene 2), then interpolated with a monotone cubic spline so the
 * velocity stays continuous through the whip-pan.
 */
export const CAMERA_Y_KEYS: [number, number][] = [
  [0, 95],
  [8, 70],
  [16, 50],
  [24, 30],
  [32, 10],
  [36, 0],
  [40, -50],
  [44, -130],
  [48, -265],
  [52, -498],
  [56, -758],
  [60, -918],
  [64, -998],
  [68, -1050],
  [72, -1074],
  [84, -1086],
  [239, -1100],
];

/** Total vertical travel of the reference camera (world -> screen). */
export const CAMERA_TRAVEL = 1195;

const cameraSpline = monotoneCubic(
  CAMERA_Y_KEYS.map(([f]) => f),
  CAMERA_Y_KEYS.map(([, y]) => y),
);

/** Reference camera position at a (possibly fractional) frame. */
export const cameraY = (frame: number): number => cameraSpline(frame);

export const BEATS = {
  /** red kicker typewriter */
  kickerStart: 0,
  kickerCps: 0.9,
  /** layered entrance settle durations */
  titleSettle: [20, 16, 14] as const,
  handSettle: 24,
  gearSettle: 22,
  /** table */
  tableTitle: 48,
  rowWipe: [55, 70, 86] as const,
  scoreType: [66, 81, 97] as const,
  wipeFrames: 7,
  typeStep: 2,
  /** highlighter wipe */
  markerSwipe: [106, 126] as const,
  /** hard cut to the presenter shot */
  cutToSpeaker: 236,
} as const;

export type CaptionCue = {
  from: number;
  to: number;
  text: string;
  fade?: number;
};

/** Burned-in captions transcribed from the reference. */
export const CAPTIONS: CaptionCue[] = [
  {from: 0, to: 53, text: '在这项长链路的测试里边', fade: 4},
  {from: 53, to: 89, text: 'K3拿了42分', fade: 3},
  {from: 89, to: 159, text: '比Fable 5的35分高出了7分', fade: 3},
  {from: 159, to: 175, text: '也就是说', fade: 2},
  {from: 175, to: 240, text: 'K3赢的不只是页面做的好不好看', fade: 3},
];

export type ScoreRow = {
  name: string;
  score: string;
  fontSize: number;
  left: number;
  baseline: number;
};

export const ROWS: ScoreRow[] = [
  {name: 'Kimi K3', score: '42.0', fontSize: 106, left: 400, baseline: 230},
  {name: 'Fable 5', score: '35.0', fontSize: 106, left: 400, baseline: 370},
  {name: 'GPT-5.6Sol', score: '39.0', fontSize: 91, left: 346, baseline: 508},
];

/** Deterministic 0..1 jitter, used for hand-drawn edges. */
export const noise = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** ease used by every entrance in the reference */
export const EASE_SETTLE = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 -> 1 over `dur` frames with the reference's settle ease. */
export const progress = (frame: number, dur: number): number =>
  interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_SETTLE,
  });

/** Offset that settles from `from` to 0 over `dur` frames. */
export const settle = (frame: number, dur: number, from: number): number =>
  interpolate(frame, [0, dur], [from, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_SETTLE,
  });
