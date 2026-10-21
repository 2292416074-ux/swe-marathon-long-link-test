import {Composition} from 'remotion';
import {LongLinkTest} from './LongLinkTest';
import {STAGE} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LongLinkTest"
      component={LongLinkTest}
      durationInFrames={STAGE.durationInFrames}
      fps={STAGE.fps}
      width={STAGE.width}
      height={STAGE.height}
    />
  );
};
