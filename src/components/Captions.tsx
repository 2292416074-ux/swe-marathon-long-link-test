import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CAPTIONS} from '../timeline';
import {COLORS, FONTS} from '../theme';

/** Lower-third captions, hard-cut or softly faded like the source edit. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {CAPTIONS.map((cue) => {
        const fade = cue.fade ?? 4;
        if (frame < cue.from - 1 || frame > cue.to + 1) {
          return null;
        }
        const inP = Math.min(1, Math.max(0, (frame - cue.from) / fade));
        const outP = Math.min(1, Math.max(0, (cue.to - frame) / fade));
        const opacity = Math.min(inP, outP);

        return (
          <div
            key={cue.text}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 974,
              textAlign: 'center',
              opacity,
              color: COLORS.caption,
              fontFamily: FONTS.sans,
              fontWeight: 400,
              fontSize: 53,
              letterSpacing: '0.045em',
              textShadow:
                '0 1px 2px rgba(0,0,0,0.30), 0 3px 14px rgba(0,0,0,0.42), 0 0 1px rgba(0,0,0,0.4)',
              filter: 'blur(0.25px)',
            }}
          >
            {cue.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
