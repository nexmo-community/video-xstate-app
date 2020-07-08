import React from 'react';
import { Box } from '@chakra-ui/core'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from './Home';
import Meeting from './Meeting';

function App() {
  return (
    <Box h="100vh" w="100vw" overflow="hidden">
      <Router>
        <Switch>
          <Route path="/meeting/:meetingId">
            <Meeting />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Box>
  );
}

export default App;