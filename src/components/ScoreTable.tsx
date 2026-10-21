import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS, TABLE} from '../theme';
import {BEATS, ROWS} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Row label wipes in left -> right through a clip, with a short horizontal
 * jitter on the way in. In the reference the rows are not faded: they are
 * *revealed*, as if the type were being printed.
 */
const RowLabel: React.FC<{frame: number; i: number}> = ({frame, i}) => {
  const row = ROWS[i];
  const start = BEATS.rowWipe[i];
  const p = interpolate(
    frame,
    [start, start + BEATS.wipeFrames],
    [0, 1],
    {...clamp, easing: Easing.out(Easing.cubic)},
  );
  if (p <= 0) {
    return null;
  }
  const jitter = p < 1 ? (1 - p) * (i % 2 === 0 ? 6 : -6) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: row.left + jitter,
        top: row.baseline - row.fontSize * 0.79,
        fontFamily: FONTS.heavy,
        fontWeight: 400,
        fontSize: row.fontSize,
        lineHeight: 1,
        letterSpacing: '-0.035em',
        transform: 'scaleX(1.07)',
        transformOrigin: 'left center',
        color: COLORS.ink,
        whiteSpace: 'pre',
        clipPath: `inset(-25% ${(1 - p) * 100}% -25% 0)`,
      }}
    >
      {row.name}
    </div>
  );
};

/**
 * Score digits are typed on at a fixed cadence. Untyped glyphs stay in the
 * flow as invisible spacers, so the number never shifts while it is typing.
 */
const RowScore: React.FC<{frame: number; i: number}> = ({frame, i}) => {
  const row = ROWS[i];
  const start = BEATS.scoreType[i];
  const n = frame < start ? 0 : Math.floor((frame - start) / BEATS.typeStep) + 1;
  if (n <= 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 1920 - TABLE.scoreRight,
        top: row.baseline - 101 * 0.79 - 11,
        fontFamily: FONTS.heavy,
        fontWeight: 400,
        fontSize: 101,
        lineHeight: 1,
        letterSpacing: '0.1em',
        transform: 'scaleX(1.06)',
        transformOrigin: 'right top',
        color: COLORS.ink,
        display: 'flex',
        justifyContent: 'flex-end',
        whiteSpace: 'pre',
      }}
    >
      {row.score.split('').map((c, k) => (
        <span key={`${c}-${k}`} style={{opacity: k < n ? 1 : 0}}>
          {c}
        </span>
      ))}
    </div>
  );
};

/** The leaderboard block, positioned in table-local coordinates. */
export const ScoreTable: React.FC = () => {
  const frame = useCurrentFrame();

  const titleP = interpolate(frame, [BEATS.tableTitle, BEATS.tableTitle + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{overflow: 'visible'}}>
      {/* column + row rules */}
      <div
        style={{
          position: 'absolute',
          left: 400,
          top: TABLE.ruleTopY,
          width: 1186,
          height: 1,
          background: 'rgba(20,20,18,0.16)',
          opacity: 0.8 * titleP,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: TABLE.verticalRuleX,
          top: TABLE.ruleTopY,
          width: 1,
          height: TABLE.ruleBottomY - TABLE.ruleTopY,
          background: 'rgba(20,20,18,0.14)',
          opacity: 0.9 * titleP,
        }}
      />
      {TABLE.rowRules.map((y, i) => {
        const p = interpolate(frame, [BEATS.rowWipe[i] - 2, BEATS.rowWipe[i] + 8], [0, 1], clamp);
        return (
          <div
            key={y}
            style={{
              position: 'absolute',
              left: 400,
              top: y,
              width: 1186,
              height: 1,
              background: 'rgba(20,20,18,0.19)',
              opacity: p,
            }}
          />
        );
      })}

      {/* table title: Latin serif + Ming, sharing a baseline */}
      <div
        style={{
          position: 'absolute',
          left: 398,
          top: TABLE.titleTop - 36,
          display: 'flex',
          alignItems: 'baseline',
          lineHeight: 1.2,
          color: COLORS.ink,
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 22}px)`,
          filter: titleP < 1 ? `blur(${(1 - titleP) * 6}px)` : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: FONTS.latinSerif,
            fontWeight: 400,
            fontSize: 118,
            letterSpacing: '0em',
            lineHeight: 1.2,
            fontStyle: 'italic',
          }}
        >
          SWE Marathon
        </span>
        <span
          style={{
            fontFamily: FONTS.serif,
            fontWeight: 400,
            fontSize: 92,
            letterSpacing: '0em',
            lineHeight: 1.2,
            marginLeft: 12,
            transform: 'scaleX(0.83)',
            transformOrigin: 'left bottom',
            display: 'inline-block',
          }}
        >
          长链路测试
        </span>
      </div>

      {ROWS.map((row, i) => (
        <React.Fragment key={row.name}>
          <RowLabel frame={frame} i={i} />
          <RowScore frame={frame} i={i} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
