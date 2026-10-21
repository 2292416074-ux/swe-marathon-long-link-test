import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';
import {COLORS, FONTS, TABLE} from '../theme';
import {BEATS, ROWS} from '../timeline';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Highlighter strokes are built as hand-wobbled polygons rather than a plain
 * rectangle: the reference marker has a slanted, ragged edge where the pen
 * lifts between rows.
 */
const ScoreChars: React.FC<{text: string; start: number}> = ({text, start}) => {
  const frame = useCurrentFrame();
  return (
    <span style={{display: 'inline-flex'}}>
      {text.split('').map((ch, i) => {
        const t = start + i * 2.4;
        const p = interpolate(frame, [t, t + 7], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={`${ch}-${i}`}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 7}px)` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
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
        const p = interpolate(frame, [BEATS.rowIn[i] - 2, BEATS.rowIn[i] + 8], [0, 1], clamp);
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
          top: TABLE.titleTop - 46,
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

      {/* rows */}
      {ROWS.map((row, i) => {
        const t0 = BEATS.rowIn[i];
        const p = interpolate(frame, [t0, t0 + 13], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const baseline = [230, 370, 508][i];
        const size = [106, 106, 91][i];
        const left = [400, 400, 346][i];
        return (
          <React.Fragment key={row.name}>
            <div
              style={{
                position: 'absolute',
                left,
                top: baseline - size * 0.79,
                fontFamily: FONTS.heavy,
                fontWeight: 400,
                fontSize: size,
                lineHeight: 1,
                letterSpacing: '-0.035em',
                transformOrigin: 'left center',
                color: COLORS.ink,
                opacity: p,
                transform: `translateY(${(1 - p) * 34}px) scaleX(1.07)`,
                filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined,
              }}
            >
              {row.name}
            </div>
            <div
              style={{
                position: 'absolute',
                right: 1920 - TABLE.scoreRight,
                top: baseline - 101 * 0.79 - 11,
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
              }}
            >
              <ScoreChars text={row.score} start={BEATS.scoreIn[i]} />
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
