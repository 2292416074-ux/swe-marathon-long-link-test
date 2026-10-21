import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, POSTER} from '../theme';

/**
 * The paper stock itself: a real generated sheet (fibre, dust, creases) rather
 * than flat colour. Sits inside the poster so it moves with the camera.
 */
export const PaperStock: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper, overflow: 'hidden'}}>
      <Img
        src={staticFile('assets/paper.jpg')}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POSTER.width,
          height: POSTER.height,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Film grain: three pre-baked plates cycled every frame at sub-pixel offsets.
 * Cheaper than regenerating an SVG turbulence per frame and it reads like
 * actual scanned stock.
 */
export const FilmGrain: React.FC<{opacity?: number; scale?: number}> = ({
  opacity = 0.13,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const plate = (frame % 3) + 1;
  const ox = ((frame * 37) % 97) / 97;
  const oy = ((frame * 53) % 89) / 89;

  return (
    <AbsoluteFill
      style={{
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
        backgroundImage: `url(${staticFile(`assets/grain-${plate}.png`)})`,
        backgroundSize: `${width * 1.05 * scale}px ${height * 1.05 * scale}px`,
        backgroundPosition: `${-ox * 40}px ${-oy * 40}px`,
      }}
    />
  );
};

/** Projector-ish vignette + a touch of uneven print density. */
export const Haze: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      opacity: 0.05,
      background: 'linear-gradient(180deg, rgba(70,66,58,0.6), rgba(40,38,34,0.8))',
    }}
  />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(108% 82% at 50% 45%, rgba(0,0,0,0) 34%, rgba(24,22,20,0.16) 66%, rgba(16,15,14,0.55) 100%)',
    }}
  />
);

/** Colour fringing at the edges of the lens, strongest in the corners. */
export const ChromaticEdges: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'screen',
      opacity: 0.22,
      background:
        'radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(190,40,30,0.20) 78%, rgba(30,90,180,0.14) 100%)',
    }}
  />
);


/**
 * Halftone/rosette hint: the reference is a printed sheet that has been
 * photographed, so a very low-opacity dot screen keeps the flat areas alive.
 */
export const PrintScreen: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: 0.05,
      mixBlendMode: 'multiply',
      backgroundImage:
        'radial-gradient(rgba(30,28,24,0.9) 0.6px, rgba(0,0,0,0) 0.7px)',
      backgroundSize: '3.5px 3.5px',
      transform: 'rotate(14deg) scale(1.25)',
    }}
  />
);
