import React from 'react';
import { useHistory } from "react-router-dom";
import { Box, Button, Flex, Heading } from '@chakra-ui/core'
import { functions } from '../context/firebase';

const createSession = functions.httpsCallable('createSession');

// button calls a Firebase Function to create a new session with OpenTok 
// once the session is created, the page will redirect to the new meeting room
function Home() {
  const history = useHistory();
  const clickHandler = async () => {
    const result = await createSession();
    history.push(`/meeting/${result.data.sessionRef}`)
  }

  return (
    <Flex
      h="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Box textAlign="center">
        <Heading mb={10}>Welcome</Heading>
        <Button
          size="large"
          variant="solid"
          variantColor="green"
          p={4}
          rounded={30}
          onClick={clickHandler}
        >
          Create New Meeting
        </Button>
      </Box>
    </Flex>
  );
}

export default Home;
