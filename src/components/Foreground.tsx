import React from 'react';
import {Img, staticFile, useCurrentFrame, interpolate} from 'remotion';


/**
 * Elements that live between the lens and the sheet: out-of-focus gear
 * cut-outs and torn dark photo edges. They stay roughly put while the camera
 * pans, which is what gives the shot its depth.
 */
export const FloatingDebris: React.FC = () => {
  const frame = useCurrentFrame();

  // the table page has its own defocused props; they fade in as the first
  // page (with its palm-and-gear pair) leaves the top of frame
  const tableIn = interpolate(frame, [52, 74], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const drift = Math.sin(frame / 48) * 6 + (1 - tableIn) * 120;
  const handOpacity = tableIn * 0.5;
  const handBlur = 5 + tableIn * 6;

  const gears = [
    {left: -170, top: 640, size: 430, blur: 11, opacity: 0.26, rotate: 12},
    {left: 1600, top: 600, size: 500, blur: 14, opacity: 0.24, rotate: -8},
    {left: 40, top: 900, size: 260, blur: 7, opacity: 0.2, rotate: 40},
  ];

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <Img
        src={staticFile('assets/hand-left.png')}
        style={{
          position: 'absolute',
          left: -70,
          top: 828 + drift * 0.5 + tableIn * 70,
          width: 690,
          transform: 'rotate(-3deg)',
          filter: `grayscale(1) contrast(1.06) brightness(1.04) blur(${handBlur}px)`,
          opacity: handOpacity,
        }}
      />
      <Img
        src={staticFile('assets/hand-right.png')}
        style={{
          position: 'absolute',
          left: 1284,
          top: 806 - drift * 0.5 + tableIn * 70,
          width: 650,
          transform: 'rotate(2.5deg)',
          filter: `grayscale(1) contrast(1.06) brightness(1.04) blur(${handBlur}px)`,
          opacity: handOpacity,
        }}
      />

      {gears.map((g) => (
        <Img
          key={`${g.left}-${g.top}`}
          src={staticFile('assets/gear.png')}
          style={{
            position: 'absolute',
            left: g.left,
            top: g.top + drift * 0.6,
            width: g.size,
            height: g.size * 1.073,
            transform: `rotate(${g.rotate}deg)`,
            mixBlendMode: 'multiply',
            filter: `grayscale(1) blur(${g.blur}px) contrast(1.05)`,
            opacity: g.opacity,
          }}
        />
      ))}

      {/* torn photo edges, bottom corners */}
      <div
        style={{
          position: 'absolute',
          left: -90,
          top: 986,
          width: 340,
          height: 120,
          background: '#191817',
          transform: `rotate(-4deg) translateY(${drift * 0.4}px)`,
          boxShadow: '0 -6px 0 rgba(196, 126, 30, 0.6)',
          filter: 'blur(1px)',
          opacity: 0.82,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1770,
          top: 850,
          width: 240,
          height: 300,
          background: '#171615',
          transform: 'rotate(2.5deg)',
          boxShadow: '0 -6px 0 rgba(200, 128, 30, 0.5)',
          filter: 'blur(1.2px)',
          opacity: 0.7,
        }}
      />
    </div>
  );
};
