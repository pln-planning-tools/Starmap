import Head from 'next/head';

import { ChakraProvider } from '@chakra-ui/react';

import React from 'react';

import './style.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>StarMap</title>
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
