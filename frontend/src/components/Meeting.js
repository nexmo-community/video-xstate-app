import React from 'react';
import { Redirect, useParams } from "react-router-dom";
import { useMachine } from '@xstate/react';
import { Flex } from '@chakra-ui/core'
import { useAsync } from 'react-async-hook';
import { functions } from '../context/firebase';
import { session } from '../machines/session';
import Loading from './Loading';
import Staging from './Meeting/Staging';
import Room from './Meeting/Room';

const getSession = functions.httpsCallable('getSession');
const getSessionByMeetingId = async (meetingId) => await getSession(meetingId);

function Meeting() {
  // get session ID from Firebase and determine if the meeting ID exists.
  // if not, redirect to the home page to create a new meeting
  const { meetingId } = useParams();
  const { result, loading } = useAsync(getSessionByMeetingId, [meetingId]);
  const [current, send] = useMachine(session);
  const state = current.value;
  const context = current.context;
  if (!!result?.data?.sessionId) {
    send({ type: "START", sessionId: result.data.sessionId })
  };
  return (
    <Flex h="100%" direction="column" alignItems="center" justifyContent="center">
      {result?.data === null && !loading ? <Redirect to={{ pathname: "/" }} /> : null}
      {loading ?
        <>
          <Loading />
        </>
        : <>
          {state.disconnected ? <Staging {...context} send={send} /> : null}
          {state === "connected" ? <Room {...context} send={send} /> : null}
        </>
      }
    </Flex>
  );
}

export default Meeting;