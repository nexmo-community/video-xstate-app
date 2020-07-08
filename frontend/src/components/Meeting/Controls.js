import React from 'react'
import { Flex, IconButton } from '@chakra-ui/core';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';

export default function Controls({ hasAudio, hasVideo, send, overlay = false, dark = false }) {
  const position = overlay ? "absolute" : null;
  return (
    <Flex w="100%" p={3} position={position} justifyContent="center" bottom="0">
      {hasAudio ?
        <IconButton
          _hover={{ color: "black", backgroundColor: "white" }}
          color={dark ? 'black' : 'white'}
          variant="outline"
          size="md"
          icon={FaMicrophone}
          isRound
          mr={3}
          onClick={() => send('TOGGLE_AUDIO_PUBLISH')}
        /> :
        <IconButton
          variantColor="red"
          variant="solid"
          size="md"
          icon={FaMicrophoneSlash}
          isRound
          mr={3}
          onClick={() => send('TOGGLE_AUDIO_PUBLISH')}
        />
      }
      {hasVideo ?
        <IconButton
          _hover={{ color: "black", backgroundColor: "white" }}
          color={dark ? 'black' : 'white'}
          variant="outline"
          size="md"
          icon={FaVideo}
          isRound
          mr={3}
          onClick={() => send('TOGGLE_VIDEO_PUBLISH')}
        /> :
        <IconButton
          variantColor="red"
          variant="solid"
          size="md"
          icon={FaVideoSlash}
          isRound
          mr={3}
          onClick={() => send('TOGGLE_VIDEO_PUBLISH')}
        />
      }
    </Flex>
  )
}