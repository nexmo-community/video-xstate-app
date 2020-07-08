import { Machine, assign, spawn } from 'xstate';
import { functions } from '../context/firebase';
import OT from '@opentok/client';
import { streamConfig, invokeConnectSession } from './constants';
import { stream } from './stream';
const createToken = functions.httpsCallable('createToken');

export const session = Machine({
  id: 'session',
  initial: 'disconnected',
  context: {
    sessionId: null,
    session: null,
    token: null,
    publisher: null,
    subscribers: new Map()
  },
  states: {
    disconnected: {
      id: 'disconnected',
      initial: 'idle',
      states: {
        'idle': {
          id: 'idle',
          on: {
            'START': {
              target: 'init',
              actions: assign({
                sessionId: (ctx, e) => e.sessionId
              }
              )
            }
          }
        },
        'init': {
          id: 'init',
          entry: ['initSession', 'initPublisher'],
          invoke: [
            {
              id: 'createToken',
              src: 'invokeCreateToken',
              onDone: {
                actions: 'assignToken'
              },
              onError: {
                actions: (ctx, e) => console.log(e)
              }
            }
          ],
          on: {
            '': {
              target: 'ready',
              cond: 'checkReady'
            }
          }
        },
        'ready': {
          id: 'ready',
          on: {
            'CONNECT': '#connected'
          }
        }
      }
    },
    connected: {
      id: 'connected',
      invoke: {
        id: 'connectSession',
        src: 'invokeConnectSession'
      },
      on: {
        'SUBSCRIBER_ADDED': { actions: 'addNewSusbscriber' },
        'SUBSCRIBER_REMOVED': { actions: 'removeSusbscriber' },
        'AUDIO_PROPERTY_CHANGED': {
          actions: (ctx, e) => ctx.subscribers.get(e.id).send('TOGGLE_AUDIO', { value: e.value })
        },
        'VIDEO_PROPERTY_CHANGED': {
          actions: (ctx, e) => ctx.subscribers.get(e.id).send('TOGGLE_VIDEO', { value: e.value })
        },
        'DISCONNECT': '#disconnected'
      }
    },
    error: {}
  }
}, {
  actions: {
    addNewSusbscriber: assign({
      subscribers: (ctx, e) => (
        ctx.subscribers.set(
          e.subscriber.streamId,
          spawn(stream.withContext({
            ...stream.context,
            stream: e.subscriber,
            hasAudio: e.subscriber.stream.hasAudio,
            hasVideo: e.subscriber.stream.hasVideo
          }))
        )
      )
    }),
    assignToken: assign({ token: (_, e) => e.data.data.token }),
    initSession: assign({ session: (ctx) => OT.initSession(process.env.REACT_APP_OPENTOK_APIKEY, ctx.sessionId) }),
    removeSusbscriber: assign({ subscribers: (ctx, e) => ctx.subscribers.delete(e.stream) && ctx.subscribers }),
    initPublisher: assign({
      publisher: () => {
        let publisher = OT.initPublisher(streamConfig);
        return spawn(stream.withContext({ ...stream.context, stream: publisher }))
      }
    })
  },
  guards: {
    checkReady: (ctx, e) => ctx.token && ctx.publisher
  },
  services: {
    invokeCreateToken: (ctx) => createToken(ctx.sessionId),
    invokeConnectSession: invokeConnectSession
  }
});