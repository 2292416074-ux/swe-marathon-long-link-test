import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../theme';
import {BEATS, progress, settle} from '../timeline';

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

/**
 * One glyph group of the title: three print ghosts plus the solid pass,
 * arriving from its own direction with its own settle time — the reference
 * animates 长 / 链路 / 测试 independently, not as one block.
 */
const GlyphGroup: React.FC<{
  text: string;
  left: number;
  top: number;
  fontSize: number;
  fromX?: number;
  fromY?: number;
  fromBlur?: number;
  rotate?: number;
  settleFrames: number;
  chromatic?: number;
}> = ({
  text,
  left,
  top,
  fontSize,
  fromX = 0,
  fromY = 0,
  fromBlur = 0,
  rotate = 0,
  settleFrames,
  chromatic = 0,
}) => {
  const frame = useCurrentFrame();
  const s = progress(frame, settleFrames);
  const dx = fromX * (1 - s);
  const dy = fromY * (1 - s);
  const blur = fromBlur * (1 - s);

  const type: React.CSSProperties = {
    fontFamily: FONTS.serif,
    fontWeight: 900,
    fontSize,
    lineHeight: 0.82,
    letterSpacing: '-0.01em',
    color: COLORS.ink,
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        opacity: Math.min(1, 0.55 + s * 1.6),
      }}
    >
      <Ghost dx={-18} dy={9} opacity={0.17} blur={0.4}>
        <span style={type}>{text}</span>
      </Ghost>
      <Ghost dx={11} dy={-7} opacity={0.1} blur={0.3}>
        <span style={type}>{text}</span>
      </Ghost>
      <Ghost dx={24} dy={4} opacity={0.05} blur={0.6}>
        <span style={type}>{text}</span>
      </Ghost>
      <span
        style={{
          ...type,
          position: 'relative',
          textShadow:
            chromatic > 0.3
              ? `${-chromatic}px 0 rgba(0,90,255,0.55), ${chromatic}px 0 rgba(255,60,0,0.45)`
              : '-2.5px 0 rgba(196, 36, 34, 0.28), 2.5px 0 rgba(36, 74, 132, 0.26)',
        }}
      >
        {text}
      </span>
    </div>
  );
};

/**
 * The opening lock-up. Positions are poster-space and match the reference
 * frame at rest; the entrance offsets come from tracking frames 0-20.
 */
export const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const chromatic = settle(frame, 18, 9);
  const chars = Math.max(
    0,
    Math.min(
      'Long link testing'.length,
      Math.floor((frame - BEATS.kickerStart) * BEATS.kickerCps) + 1,
    ),
  );

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1100}}>
      <GlyphGroup
        text="长"
        left={330}
        top={246}
        fontSize={304}
        fromX={-410}
        fromBlur={6}
        settleFrames={BEATS.titleSettle[0]}
        chromatic={chromatic}
      />
      <GlyphGroup
        text="链路"
        left={660}
        top={328}
        fontSize={204}
        fromY={160}
        fromBlur={10}
        settleFrames={BEATS.titleSettle[1]}
        chromatic={chromatic * 0.8}
      />
      <GlyphGroup
        text="测试"
        left={1112}
        top={324}
        fontSize={208}
        fromX={125}
        fromY={115}
        fromBlur={10}
        rotate={-2}
        settleFrames={BEATS.titleSettle[2]}
        chromatic={chromatic * 0.8}
      />

      {/* red kicker, typed on */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 500,
          transform: 'rotate(-0.5deg) skewX(-11deg)',
          fontFamily: '"Helvetica Neue", "PingFang SC", Arial, sans-serif',
          fontWeight: 500,
          fontSize: 100,
          lineHeight: 1,
          letterSpacing: '0.015em',
          color: COLORS.red,
          WebkitTextStroke: '2px rgba(226, 223, 215, 0.7)',
          paintOrder: 'stroke fill',
          whiteSpace: 'pre',
        }}
      >
        {'Long link testing'.slice(0, chars)}
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
      filter: `grayscale(1) contrast(1.06) brightness(1.03) blur(${blur}px)`,
      opacity,
    }}
  />
);

/**
 * Gear resting in an open palm — one prop that travels with the sheet.
 * The gear settles later than the hand, so it drops into the palm.
 */
const GearPalm: React.FC<{
  gearLeft: number;
  gearTop: number;
  gearSize: number;
  gearRotate: number;
  gearFall: number;
  gearSlide: number;
  handLeft: number;
  handTop: number;
  handWidth: number;
  handRotate: number;
  handFromX?: number;
  handFromY?: number;
  hand: 'left' | 'right';
}> = ({
  gearLeft,
  gearTop,
  gearSize,
  gearRotate,
  gearFall,
  gearSlide,
  handLeft,
  handTop,
  handWidth,
  handRotate,
  handFromX = 0,
  handFromY = 0,
  hand,
}) => {
  const frame = useCurrentFrame();
  const hs = progress(frame, BEATS.handSettle);
  const gs = progress(frame, BEATS.gearSettle);

  return (
    <>
      <Img
        src={staticFile(`assets/hand-${hand}.png`)}
        style={{
          position: 'absolute',
          left: handLeft + handFromX * (1 - hs),
          top: handTop + handFromY * (1 - hs),
          width: handWidth,
          transform: `rotate(${handRotate}deg)`,
          filter: 'grayscale(1) contrast(1.02) brightness(1.12) blur(1.5px)',
          opacity: 0.8 * Math.min(1, 0.5 + hs * 1.5),
        }}
      />
      <Gear
        left={gearLeft + gearSlide * (1 - gs)}
        top={gearTop + gearFall * (1 - gs)}
        size={gearSize}
        rotate={gearRotate}
        opacity={Math.min(1, 0.5 + gs * 1.5)}
      />
    </>
  );
};

/** The two opening props: small gear on the left palm, big gear on the right. */
export const IntroProps: React.FC = () => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 38) * 3;
  const spin = frame * 0.14;

  return (
    <>
      <GearPalm
        gearLeft={330}
        gearTop={676 + float}
        gearSize={202}
        gearRotate={-6 + spin}
        gearSlide={20}
        gearFall={-10}
        handLeft={-593}
        handTop={792}
        handWidth={1175}
        handRotate={-2}
        handFromY={150}
        hand="left"
      />
      <GearPalm
        gearLeft={1160}
        gearTop={506 - float}
        gearSize={292}
        gearRotate={5 + spin * 0.6}
        gearSlide={10}
        gearFall={-245}
        handLeft={1016}
        handTop={716}
        handWidth={1234}
        handRotate={1.5}
        handFromX={520}
        hand="right"
      />
    </>
  );
};

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
