import React from 'react';
import { Heading, Spinner } from '@chakra-ui/core'

function Loading() {
  return (
    <>
      <Heading mb={10}>Loading</Heading>
      <Spinner size="xl" />
    </>
  );
}

export default Loading;