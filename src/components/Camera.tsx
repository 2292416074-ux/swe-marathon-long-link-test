import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CAMERA_TRAVEL, cameraY} from '../timeline';
import {POSTER} from '../theme';

/**
 * Virtual camera over the tall poster.
 *
 * The track is the measured reference curve (see timeline.ts) sampled through
 * a monotone spline, so velocity stays continuous through the whip-pan. Blur
 * is *directional* — vertical only — driven by that velocity, which is what
 * makes the whip read as a camera move rather than a soft focus pull.
 */
export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const camY = cameraY(frame);
  const k = POSTER.tableOffset / CAMERA_TRAVEL;
  const offset = (95 - camY) * k;

  const velocity = Math.abs(cameraY(frame) - cameraY(frame - 1)) * k;
  const blur = Math.min(velocity * 0.12, 24);

  // gentle push-in once the table has landed
  const scale = interpolate(frame, [72, 236], [1, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#cfcdc7'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="vblur" x="-5%" y="-10%" width="110%" height="120%">
          <feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`} />
        </filter>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: POSTER.width,
          height: POSTER.height,
          transformOrigin: `50% ${offset + 486}px`,
          transform: `scale(${scale}) translateY(${-offset}px)`,
          filter: `${
            blur > 0.4 ? 'url(#vblur) ' : ''
          }brightness(0.94) contrast(0.99) saturate(0.9)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
