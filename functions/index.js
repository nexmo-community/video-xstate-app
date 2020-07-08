const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenTok = require('opentok');
const cors = require('cors')({ origin: true });

admin.initializeApp();
let db = admin.firestore();

const {
  api_key,
  api_secret,
} = functions.config().opentok;

const opentok = new OpenTok(api_key, api_secret);

function startSession(opts = {}) {
  return new Promise((resolve, reject) => {
    opentok.createSession(opts, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

exports.createSession = functions.https.onCall(async () => {
  let session = await startSession();
  let ref = await db.collection('opentok-sessions').add({ sessionId: session.sessionId });
  return ({ sessionRef: ref.id });
});

exports.getSession = functions.https.onCall(async (data) => {
  let lookup = await admin.firestore().doc(`/opentok-sessions/${data}`).get();
  return (lookup.data());
});

exports.createToken = functions.https.onCall(async (data) => {
  let token = await opentok.generateToken(data);
  return ({ token: token });
});