import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../theme';

/** One pass of the mis-registered screen print. */
const Ghost: React.FC<{
  dx: number;
  dy: number;
  opacity: number;
  blur: number;
  children: React.ReactNode;
}> = ({dx, dy, opacity, blur, children}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${dx}px, ${dy}px)`,
      opacity,
      filter: `blur(${blur}px)`,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const TitleRow: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      whiteSpace: 'nowrap',
      color: COLORS.ink,
      fontFamily: FONTS.serif,
      fontWeight: 900,
      lineHeight: 0.82,
      letterSpacing: '-0.01em',
    }}
  >
    <span style={{fontSize: 316}}>长</span>
    <span style={{fontSize: 212, marginLeft: 40}}>链路</span>
    <span style={{fontSize: 216, marginLeft: 52}}>测试</span>
  </div>
);

/**
 * The opening lock-up: heavy Ming type, two offset print ghosts, a red italic
 * English kicker knocked out of the paper.
 */
export const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 26) * 3;

  return (
    <div
      style={{
        position: 'absolute',
        left: 298,
        top: 246 + drift,
        width: 1400,
        height: 460,
      }}
    >
      <Ghost dx={-18} dy={9} opacity={0.17} blur={0.4}>
        <TitleRow />
      </Ghost>
      <Ghost dx={11} dy={-7} opacity={0.1} blur={0.3}>
        <TitleRow />
      </Ghost>
      <Ghost dx={24} dy={4} opacity={0.05} blur={0.6}>
        <TitleRow />
      </Ghost>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          color: COLORS.ink,
          textShadow:
            '-2.5px 0 rgba(196, 36, 34, 0.42), 2.5px 0 rgba(36, 74, 132, 0.38), 0 0 1px rgba(0,0,0,0.35)',
        }}
      >
        <TitleRow />
      </div>

      {/* red kicker */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 300,
          transform: 'rotate(-0.5deg) skewX(-11deg)',
          fontFamily: '"Helvetica Neue", "PingFang SC", Arial, sans-serif',
          fontWeight: 500,
          fontStyle: 'normal',
          fontSize: 88,
          lineHeight: 1,
          letterSpacing: '0.015em',
          color: COLORS.red,
          WebkitTextStroke: '2px rgba(226, 223, 215, 0.7)',
          paintOrder: 'stroke fill',
          textShadow: '0 2px 6px rgba(120, 20, 18, 0.18)',
          whiteSpace: 'nowrap',
        }}
      >
        Long link testing
      </div>
    </div>
  );
};

/** A single photographic gear cut-out, multiplied onto the paper. */
export const Gear: React.FC<{
  left: number;
  top: number;
  size: number;
  rotate: number;
  blur?: number;
  opacity?: number;
}> = ({left, top, size, rotate, blur = 0, opacity = 1}) => (
  <Img
    src={staticFile('assets/gear.png')}
    style={{
      position: 'absolute',
      left,
      top,
      width: size,
      height: size * 1.073,
      transform: `rotate(${rotate}deg)`,
      mixBlendMode: 'multiply',
      filter: `grayscale(1) contrast(1.02) brightness(1.12) blur(${blur}px)`,
      opacity,
    }}
  />
);

/**
 * The dotted "chain" that runs from the title down into the table. One line,
 * drawn between the two gears, exactly like the reference.
 */
export const DottedChain: React.FC<{x: number; from: number; to: number}> = ({
  x,
  from,
  to,
}) => {
  const dots: React.ReactNode[] = [];
  const gap = 21;
  const count = Math.floor((to - from) / gap);
  for (let i = 0; i <= count; i++) {
    const y = from + i * gap;
    const taper = Math.min(1, i / 3, (count - i) / 4);
    dots.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - 1.6,
          top: y,
          width: 3.2,
          height: 3.2,
          borderRadius: '50%',
          backgroundColor: 'rgba(24,24,22,0.72)',
          opacity: 0.55 * taper,
        }}
      />,
    );
  }
  return <>{dots}</>;
};

/** Torn dark photo edges that hold the composition in at the corners. */
export const EdgeBands: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        left: -80,
        top: 946,
        width: 360,
        height: 86,
        background: '#191817',
        transform: 'rotate(-4deg)',
        filter: 'blur(0.4px)',
        boxShadow: '0 -5px 0 rgba(196, 126, 30, 0.55)',
        opacity: 0.9,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 1748,
        top: 720,
        width: 260,
        height: 240,
        background: '#171615',
        transform: 'rotate(2.5deg)',
        filter: 'blur(0.5px)',
        boxShadow: '0 -5px 0 rgba(200, 128, 30, 0.5)',
        opacity: 0.85,
      }}
    />
  </>
);


/**
 * Gear resting in an open palm.
 *
 * In the reference the two cut-outs are a single prop: the palm carries the
 * gear and the pair travels with the sheet as the camera pans. They are not
 * screen-fixed foreground.
 */
const GearPalm: React.FC<{
  gearLeft: number;
  gearTop: number;
  gearSize: number;
  gearRotate: number;
  handLeft: number;
  handTop: number;
  handWidth: number;
  handRotate: number;
  hand: 'left' | 'right';
  blur?: number;
}> = ({gearLeft, gearTop, gearSize, gearRotate, handLeft, handTop, handWidth, handRotate, hand, blur = 0}) => (
  <>
    <Img
      src={staticFile(`assets/hand-${hand}.png`)}
      style={{
        position: 'absolute',
        left: handLeft,
        top: handTop,
        width: handWidth,
        transform: `rotate(${handRotate}deg)`,
        filter: `grayscale(1) contrast(1.02) brightness(1.12) blur(${blur}px)`,
        opacity: 0.76,
      }}
    />
    <Gear left={gearLeft} top={gearTop} size={gearSize} rotate={gearRotate} />
  </>
);

/** The two opening props: small gear on the left palm, big gear on the right. */
export const IntroProps: React.FC = () => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 38) * 3;
  const spin = frame * 0.14;

  return (
    <>
      <GearPalm
        gearLeft={345}
        gearTop={715 + float}
        gearSize={212}
        gearRotate={-6 + spin}
        handLeft={120}
        handTop={800}
        handWidth={600}
        handRotate={-2}
        hand="left"
        blur={1.5}
      />
      <GearPalm
        gearLeft={1172}
        gearTop={642 - float}
        gearSize={296}
        gearRotate={5 + spin * 0.6}
        handLeft={1132}
        handTop={700}
        handWidth={612}
        handRotate={1.5}
        hand="right"
        blur={1.5}
      />
    </>
  );
};
