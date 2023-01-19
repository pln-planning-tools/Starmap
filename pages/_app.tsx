import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { noSSR } from 'next/dynamic';
import React, { useEffect } from 'react';

import { setTelemetry, useTelemetry } from '../hooks/useTelemetry';

import './style.css';
import { BrowserMetricsProvider } from '../lib/types';

function App({ Component, pageProps }) {
  const telemetry: BrowserMetricsProvider|null = useTelemetry()
  /**
   * We have to do funky imports here to satisfy nextjs since this package is cjs and ignite-metrics is esm
   */
  useEffect(() => {
    (async() => {
      // @ts-expect-error
      const { BrowserMetricsProvider } = await noSSR(() => import('@ipfs-shipyard/ignite-metrics/browser-vanilla'), {})

      setTelemetry(new BrowserMetricsProvider({ appKey: '294089175b8268e44bc4e4fab572fe250d57b968' }))
    })()
  }, [])

  useEffect(() => {
    if (telemetry != null) {
      // @ts-expect-error
      window.telemetry = telemetry
      // @ts-expect-error
      window.removeMetricsConsent = () => telemetry.removeConsent(['minimal'])
      // @ts-expect-error
      window.addMetricsConsent = () => telemetry.addConsent(['minimal'])
    }
  }, [telemetry])

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
