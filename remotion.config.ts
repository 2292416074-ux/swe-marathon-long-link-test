import {Config} from '@remotion/cli/config';

/**
 * Render settings tuned for a photography-style piece:
 * JPEG frames keep the grain cheap, and CRF 16 keeps the paper texture crisp.
 */
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
