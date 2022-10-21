import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import PageHeader from '../components/layout/PageHeader';

function App({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider>
        <PageHeader />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default App;
