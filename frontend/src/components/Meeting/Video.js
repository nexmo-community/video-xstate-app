import React, { useEffect, useRef } from 'react';
import { useService } from "@xstate/react";
import { Box, Flex } from '@chakra-ui/core';
import AudioIndicator from './AudioIndicator';
import { FaUserCircle } from 'react-icons/fa';

export default function Video({ stream, size, monitorResize = true, mirrored = false, muted = false }) {
  const [state] = useService(stream);
  const { videoSrcObject, audioLevel, hasAudio, hasVideo } = state.context

  const refVideo = useRef(null);

  const mirror = mirrored ? `scaleX(-1)` : null;

  useEffect(() => {
    if (!refVideo.current) return;
    if (refVideo.current.srcObject) return;
    refVideo.current.srcObject = videoSrcObject;
  }, [videoSrcObject]);

  return (
    <Flex position="relative" justifyContent="center" alignItems="center" height="100%" transform={mirror}>
      <video
        width="100%"
        ref={refVideo}
        autoPlay
        playsInline
        muted={muted}
        style={{ display: hasVideo ? 'block' : 'none' }}
      />
      <Box size="100px" height="100%" color="white" as={FaUserCircle} style={{ display: hasVideo ? 'none' : 'block' }} />
      <AudioIndicator level={audioLevel.logLevel} hasAudio={hasAudio} mirrored={mirrored} size={size} />
    </Flex>
  )
}