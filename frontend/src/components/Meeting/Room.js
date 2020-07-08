import React from 'react';
import { useService } from "@xstate/react";
import { AspectRatioBox, Box, Divider, Flex, Heading, Text } from '@chakra-ui/core';
import Video from './Video';
import Controls from './Controls';

const sortByActiveSpeaker = (streams) => {
  const streamArr = [...streams];
  if (streamArr.length >= 2) {
    streamArr.shift();
    if (streamArr.length > 1) {
      streamArr.sort((a, b) => {
        return a[1].state?.context.audioLevel.movingAvg < b[1].state?.context.audioLevel.movingAvg ? -1 : 1
      })
    }
  }
  return streamArr[0][0];
}

function Room({ publisher, subscribers }) {
  const [pubState, pubSend] = useService(publisher);
  const { hasAudio, hasVideo } = pubState.context
  const streams = [['publisher', publisher], ...subscribers.entries()];
  const activeSpeaker = sortByActiveSpeaker(streams)

  return (
    <Flex direction="row" h="100vh" w="100vw" alignItems="stretch" >
      <Flex
        direction="column"
        justifyContent="space-between"
        flex="1 1 500px"
        h="100%"
        minWidth="448px"
        alignItems="stretch"
        backgroundColor="red.400"
      >
        <Flex
          direction="column"
          overflow="hidden"
          justifyContent="center"
          min-height="600px;"
          h="100%"
          w="100%"
          background="black"
        >

          {streams.map((s) => (
            <Box
              background="black"
              width="100%"
              minHeight="500px"
              key={s[0]}
              display={activeSpeaker === s[0] ? "block" : "none"}
            >
              <Video
                stream={s[1]}
                mirrored={s[0] === 'publisher'}
                muted
              />
            </Box>
          ))}

        </Flex>
        <Box flexShrink="0" w="100%" h="75px" background="white">
          <Controls hasAudio={hasAudio} hasVideo={hasVideo} send={pubSend} dark />
        </Box>
      </Flex>
      <Flex
        flexShrink="0"
        direction="column"
        w="300px"
        h="100%"
        borderLeft="1px"
        borderLeftColor="gray.300"
        backgroundColor="white"
      >
        <Heading size="md" p={4}>Meeting Attendees</Heading>
        <Divider />

        {streams.map((s) => (
          <Flex direction="row" alignItems="center" key={s[0]}>
            <AspectRatioBox
              width="100px"
              ratio={16 / 9}
              backgroundColor="black"
            >
              <Box h="100%" w="100%">
                <Video
                  stream={s[1]}
                  size="sm"
                  mirrored={s[0] === 'publisher'}
                  muted
                  monitorResize={false}
                />
              </Box>
            </AspectRatioBox>
            <Text fontSize="sm" p={4}>{s[0] === 'publisher' ? "You" : "Them"}</Text>
          </Flex>
        ))
        }
      </Flex>
    </Flex>
  )
}

export default Room;