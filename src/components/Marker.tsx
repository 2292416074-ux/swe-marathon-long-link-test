import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, TABLE} from '../theme';
import {BEATS, noise} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const roughQuad = (w: number, h: number, seed: number, amp = 2.6): string => {
  const pts: string[] = [];
  const push = (x: number, y: number) => pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);

  const seg = (x1: number, y1: number, x2: number, y2: number, n: number, s: number) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const jx = (noise(seed + s + i * 3.1) - 0.5) * amp;
      const jy = (noise(seed + s + i * 5.7 + 11) - 0.5) * amp;
      push(x1 + (x2 - x1) * t + jx, y1 + (y2 - y1) * t + jy);
    }
  };

  seg(0, 0, w, 2.5, 9, 1);
  push(w, 2.5);
  seg(w, 2.5, w - 5, h - 2, 5, 20);
  seg(w - 5, h - 2, 0, h, 9, 40);
  push(0, h);
  seg(0, h, 0, 0, 3, 60);
  return pts.join(' ');
};

const MarkerStroke: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  start: number;
  seed: number;
  opacity?: number;
}> = ({x, y, w, h, start, seed, opacity = 0.93}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 7], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const clipId = `marker-clip-${seed}`;

  return (
    <svg
      width={w + 12}
      height={h + 12}
      viewBox={`${-6} ${-6} ${w + 12} ${h + 12}`}
      style={{position: 'absolute', left: x - 6, top: y - 6, overflow: 'visible'}}
    >
      <defs>
        <clipPath id={clipId}>
          {/* ragged leading edge so the wipe looks like a felt pen */}
          <polygon
            points={`${-6},${-6} ${-6 + (w + 12) * p + 8},${-6 + 2} ${
              -6 + (w + 12) * p - 4
            },${h + 6} ${-6},${h + 6}`}
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <polygon points={roughQuad(w, h, seed)} fill={COLORS.marker} opacity={opacity} />
        <polygon
          points={roughQuad(w, h, seed + 77, 3.4)}
          fill={COLORS.marker}
          opacity={0.35}
          transform="translate(3, 1)"
        />
      </g>
    </svg>
  );
};

/** The two highlighter bars over the 42.0 / 35.0 scores. */
export const MarkerHighlight: React.FC = () => {
  const [from] = BEATS.markerSwipe;
  const m = TABLE.marker;
  return (
    <>
      <MarkerStroke
        x={m.left}
        y={m.top}
        w={m.right - m.left - 4}
        h={132}
        start={from}
        seed={3}
      />
      <MarkerStroke
        x={m.left + 3}
        y={m.top + 124}
        w={m.right - m.left - 8}
        h={139}
        start={from + 3}
        seed={19}
      />
    </>
  );
};

