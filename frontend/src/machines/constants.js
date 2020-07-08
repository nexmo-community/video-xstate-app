import throttle from 'lodash/throttle';

export const streamConfig = {
  insertDefaultUI: false,
  resolution: "1280x720"
};

export const streamEvents = (ctx) => (cb) => {
  ctx.stream.on({
    'videoElementCreated': (e) => {
      cb({ type: 'VIDEO_ELEMENT_CREATED', stream: e.target })
    },
    'audioLevelUpdated': throttle(e => {
      cb({ type: 'AUDIO_LEVEL_UPDATED', audioLevel: updateAudioLevel(ctx.movingAvg, e.audioLevel) })
    }, 200)
  })
}

export const invokeConnectSession = (ctx) => (cb) => {
  ctx.session.on({
    'streamCreated': (e) => {
      let subscriber = ctx.session.subscribe(e.stream, streamConfig);
      cb({ type: 'SUBSCRIBER_ADDED', subscriber: subscriber })
    },
    'streamDestroyed': (e) => {
      cb({ type: 'SUBSCRIBER_REMOVED', stream: e.stream.id })
    },
    'streamPropertyChanged': (e) => {
      if (e.changedProperty === "hasAudio") {
        if (!ctx.subscribers.get(e.stream.id)) return;
        cb({ type: 'AUDIO_PROPERTY_CHANGED', value: e.newValue, id: e.stream.id })
      } else if (e.changedProperty === "hasVideo") {
        if (!ctx.subscribers.get(e.stream.id)) return;
        cb({ type: 'VIDEO_PROPERTY_CHANGED', value: e.newValue, id: e.stream.id })
      }
    }
  });

  ctx.session.connect(ctx.token, (err) => {
    if (err) console.log(err);
    ctx.session.publish(ctx.publisher.state.context.stream);
  })
}

export const updateAudioLevel = (movingAvg, audioLevel) => {
  let newMovingAvg;
  if (movingAvg === undefined || movingAvg <= audioLevel) {
    newMovingAvg = audioLevel;
  } else {
    newMovingAvg = 0.7 * movingAvg + 0.3 * audioLevel;
  }

  let logLevel = (Math.log(newMovingAvg) / Math.LN10) / 1.5 + 1;
  logLevel = Math.min(Math.max(logLevel, 0), 1);

  return { movingAvg: newMovingAvg, logLevel: logLevel };
}