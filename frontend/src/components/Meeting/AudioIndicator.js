import React from 'react';
import { Box, Flex } from '@chakra-ui/core';
import { FaMicrophoneSlash } from 'react-icons/fa';

function AudioIndicator({ level, size = "md", mirrored, hasAudio = true }) {
  let sizes = {
    xs: 1,
    sm: 1.5,
    md: 2,
    lg: 2.5,
    xl: 3
  }

  let width = 2 * sizes[size];
  let margin = 1 * sizes[size];
  let height1 = 8 * sizes[size];
  let height2 = 12 * sizes[size];

  const leftOrRight = { [`${mirrored ? 'right' : 'left'}`]: 0 }
  const mirror = mirrored ? `scaleX(-1)` : null;

  return (
    <Flex m={`${4 * margin}px`} position="absolute" alignItems="center" bottom="0" transform={mirror} style={leftOrRight}>
      {!hasAudio ?
        <Box as={FaMicrophoneSlash} color="white" />
        : <><Box
          w={`${width}px`}
          m={`${margin}px`}
          minH={`${width}px`}
          rounded="8px"
          transform={`translateY(${height1 / 2.5 * level}px)`}
          transition="ease-out height transform 500ms"
          h={`${height1 * level}px`}
          background="white"
        />
          <Box
            w={`${width}px`}
            m={`${margin}px`}
            minH={`${width}px`}
            rounded="8px"
            transform={`translateY(${height2 / 4 * level}px)`}
            h={`${height2 * level}px`}
            transition="ease-out height transform 500ms"
            background="white"
          />
          <Box
            w={`${width}px`}
            m={`${margin}px`}
            minH={`${width}px`}
            rounded="8px"
            transform={`translateY(${height1 / 2.5 * level}px)`}
            h={`${height1 * level}px`}
            transition="ease-out height transform 500ms"
            background="white"
          /></>
      }
    </Flex>
  )
}

export default AudioIndicator;

