import React from 'react';
import { useService } from "@xstate/react";
import { AspectRatioBox, Box, Button, Flex, Heading } from '@chakra-ui/core';
import Video from './Video';
import Controls from './Controls';

function Staging({ publisher, send }) {
  const [state, streamSend] = useService(publisher);
  const { hasAudio, hasVideo } = state.context
  return (
    <Flex
      w="100%"
      direction={{ base: "column", lg: "row" }}
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        flex={{ lg: "0 1 740px" }}
        minWidth="448px"
        backgroundColor="black"
        direction="column"
        m={16}
        mr={{ lg: 8 }}
      >
        <AspectRatioBox ratio={16 / 9} w="100%">
          <Box>
            {publisher ?
              <>
                <Video stream={publisher} mirrored muted />
                <Controls hasAudio={hasAudio} hasVideo={hasVideo} send={streamSend} overlay />
              </>
              : null
            }
          </Box>
        </AspectRatioBox>

      </Flex>
      <Flex
        flex={{ lg: "0 0 448px" }}
        justifyContent="center"
        alignItems="center"
        backgroundColor="green"
        h={{ lg: "540px" }}
        m={16}
        ml={{ lg: 8 }}
        direction="column"
      >
        <Heading mb={8}>Ready to Join?</Heading>
        <Button
          size="large"
          variant="solid"
          variantColor="green"
          p={4}
          pl={8}
          pr={8}
          rounded={30}
          onClick={() => send('CONNECT')}
        >
          Join Now
        </Button>
      </Flex>
    </Flex>
  )
}

export default Staging;