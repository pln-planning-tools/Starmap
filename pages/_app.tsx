import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Roadmapping | Nikas</title>
        <meta name='description' content='Roadmapping tool' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default App;
