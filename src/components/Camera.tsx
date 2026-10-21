import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {cameraBlur, cameraOffset, cameraRotation, cameraScale} from '../timeline';
import {POSTER} from '../theme';

/**
 * Virtual camera over the tall poster.
 *
 * The reference is a camera move across a printed sheet, not a UI transition:
 * so pan + scale + rotation all happen on one wrapper, and a velocity-driven
 * Gaussian blur sells the whip-pan.
 */
export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const offset = cameraOffset(frame);
  const scale = cameraScale(frame);
  const rotate = cameraRotation(frame);
  const blur = cameraBlur(frame);

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#cfcdc7'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POSTER.width,
          height: POSTER.height,
          transformOrigin: '50% 32%',
          transform: `translateY(${-offset}px) scale(${scale}) rotate(${rotate}deg)`,
          filter: `brightness(0.94) contrast(0.99) saturate(0.9) blur(${(0.45 + blur).toFixed(
            2,
          )}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
