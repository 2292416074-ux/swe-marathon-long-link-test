import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {POSTER, STAGE} from './theme';
import {Camera} from './components/Camera';
import {PaperStock} from './components/Paper';
import {DottedChain, IntroProps, IntroTitle} from './components/IntroCollage';
import {ScoreTable} from './components/ScoreTable';
import {MarkerHighlight} from './components/Marker';
import {Captions} from './components/Captions';
import {FloatingDebris} from './components/Foreground';
import {ChromaticEdges, FilmGrain, Haze, PrintScreen, Vignette} from './components/Paper';
import {BEATS} from './timeline';

/**
 * Stand-in for the live-action presenter shot the reference cuts to for its
 * last few frames. There is no footage here, so it is a deliberately neutral
 * warm-room gradient — replace it with the real clip when available.
 */
const SpeakerPlaceholder: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(circle at 12% 42%, #ffb347 0%, #f08a1c 7%, rgba(240,138,28,0) 15%), linear-gradient(90deg, #6b6660 0%, #8a857e 35%, #77726b 70%, #3a3835 100%)',
    }}
  />
);

/**
 * "SWE Marathon — 长链路测试"
 *
 * An 8 second paper-collage motion graphic: a photographed sheet, heavy Ming
 * display type printed with registration ghosts, two gear cut-outs, a dotted
 * chain running into a leaderboard, and a highlighter swipe over the scores.
 */
export const LongLinkTest: React.FC = () => {
  const frame = useCurrentFrame();

  // projector exposure flicker (very subtle)
  const flicker = 1 + Math.sin(frame * 0.9) * 0.006 + Math.sin(frame * 2.3) * 0.004;

  if (frame >= BEATS.cutToSpeaker) {
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <SpeakerPlaceholder />
        <FilmGrain opacity={0.18} scale={0.62} />
        <Vignette />
        <Captions />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#c9c7c1', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: flicker}}>
        <Camera>
          <PaperStock />

          {/* ---- opening collage ---- */}
          <IntroTitle />
          <IntroProps />
          <DottedChain x={948} from={640} to={1400} />

          {/* ---- leaderboard ---- */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: POSTER.tableTop,
              width: POSTER.width,
              height: STAGE.height,
            }}
          >
            <MarkerHighlight />
            <ScoreTable />
          </div>
        </Camera>

        {/* foreground collage, closer to the lens than the sheet */}
        <FloatingDebris />
      </div>

      <PrintScreen />
      <Haze />
      <Vignette />
      <FilmGrain opacity={0.13} scale={0.62} />
      <ChromaticEdges />
      <Captions />
    </AbsoluteFill>
  );
};
