import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, CSSReset, theme } from '@chakra-ui/core';
import FirebaseProvider from './context/firebase';
import App from './components/App';

ReactDOM.render(
  <FirebaseProvider>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </FirebaseProvider>,
  document.getElementById('root')
);
