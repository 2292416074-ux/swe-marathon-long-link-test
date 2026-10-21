import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {POSTER, STAGE} from './theme';
import {Camera} from './components/Camera';
import {PaperStock} from './components/Paper';
import {DottedChain, IntroGears, IntroTitle} from './components/IntroCollage';
import {ScoreTable} from './components/ScoreTable';
import {MarkerHighlight} from './components/Marker';
import {Captions} from './components/Captions';
import {FloatingDebris} from './components/Foreground';
import {ChromaticEdges, FilmGrain, Haze, PrintScreen, Vignette} from './components/Paper';

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

  return (
    <AbsoluteFill style={{backgroundColor: '#c9c7c1', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: flicker}}>
        <Camera>
          <PaperStock />

          {/* ---- opening collage ---- */}
          <IntroTitle />
          <IntroGears />
          <DottedChain x={948} from={640} to={986} />

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
