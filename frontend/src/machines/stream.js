import { Machine, assign, send } from 'xstate';
import { streamEvents } from './constants';

export const stream = Machine(
  {
    id: 'stream',
    initial: 'connected',
    context: {
      stream: null,
      hasAudio: true,
      hasVideo: true,
      videoSrcObject: null,
      audioLevel: {
        movingAvg: null,
        logLevel: null,
      },
    },
    states: {
      connected: {
        id: 'connected',
        invoke: {
          id: 'monitorStreamEvents',
          src: 'monitorStreamEvents',
        },
        on: {
          AUDIO_LEVEL_UPDATED: {
            actions: 'updateAudioLevel',
          },
          VIDEO_ELEMENT_CREATED: {
            actions: 'assignStream',
          },
          TOGGLE_AUDIO_PUBLISH: {
            actions: ['toggleAudioPublish', 'sendToggleAudioEvent'],
          },
          TOGGLE_VIDEO_PUBLISH: {
            actions: ['toggleVideoPublish', 'sendToggleVideoEvent'],
          },
          TOGGLE_AUDIO: { actions: 'toggleAudio' },
          TOGGLE_VIDEO: { actions: 'toggleVideo' },
        },
      },
    },
  },
  {
    actions: {
      updateAudioLevel: assign({ audioLevel: (ctx, e) => e.audioLevel }),
      assignStream: assign({
        stream: (_, e) => e.stream,
        videoSrcObject: (_, e) => e.stream.videoElement().srcObject,
      }),
      sendToggleAudioEvent: send((ctx, e) => ({
        type: 'TOGGLE_AUDIO',
        value: !ctx.hasAudio,
      })),
      sendToggleVideoEvent: send((ctx, e) => ({
        type: 'TOGGLE_VIDEO',
        value: !ctx.hasVideo,
      })),
      toggleAudioPublish: (ctx) => ctx.stream.publishAudio(!ctx.hasAudio),
      toggleVideoPublish: (ctx) => ctx.stream.publishVideo(!ctx.hasVideo),
      toggleAudio: assign({ hasAudio: (ctx, e) => e.value }),
      toggleVideo: assign({ hasVideo: (ctx, e) => e.value }),
    },
    services: {
      monitorStreamEvents: streamEvents,
    },
  }
);
