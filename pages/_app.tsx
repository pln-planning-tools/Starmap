import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { noSSR } from 'next/dynamic';
import React, { useEffect } from 'react';

import { setTelemetry, useTelemetry } from '../hooks/useTelemetry';

import './style.css';
import type { BrowserMetricsProvider } from '../lib/types';

/**
 * We have to do funky imports here to satisfy nextjs since this package is cjs and ignite-metrics is esm
 *
 * Also, Next.js expects all dynamic imports to return react components, but we're not getting react components from
 * ignite-metrics here; hence the 'ts-expect-error'.
 */
// @ts-expect-error
const igniteMetricsModulePromise: Promise<{BrowserMetricsProvider: BrowserMetricsProvider}> = noSSR(() => import('@ipfs-shipyard/ignite-metrics/browser-vanilla'), {})

function App({ Component, pageProps }) {
  const telemetry = useTelemetry()

  useEffect(() => {
    (async() => {
      if (telemetry == null) {
        const { BrowserMetricsProvider } = await igniteMetricsModulePromise
        const newTelemetry = new BrowserMetricsProvider({ appKey: '294089175b8268e44bc4e4fab572fe250d57b968' })
        // @ts-expect-error
        window.telemetry = newTelemetry
        // @ts-expect-error
        window.removeMetricsConsent = () => newTelemetry.removeConsent(['minimal'])
        // @ts-expect-error
        window.addMetricsConsent = () => newTelemetry.addConsent(['minimal'])
        setTelemetry(newTelemetry)
      }
    })()
  }, [telemetry])

  return (
    <>
      <Head>
        <title>Starmap</title>
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
