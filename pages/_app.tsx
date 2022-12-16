import Head from 'next/head';

import { ChakraProvider, Flex  } from '@chakra-ui/react';

import React, { useState, useEffect } from 'react';

import './style.css';

// metrics
import { InitCountlyMetrics, getMetricsConsent, updateMetricsConsent, acceptMetricsConsent, declineMetricsConsent } from '@ipfs-shipyard/ignite-metrics'
import { Warning, ConsentBanner, ConsentToggle } from '@ipfs-shipyard/ignite-metrics';


function App({ Component, pageProps }) {
  const [showWarning, setShowWarning] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [metricsConsent, setMetricsConsent] = useState<string | null>(null);

  const onAccept = () => {
    acceptMetricsConsent()
    setMetricsConsent(getMetricsConsent())
    setShowConsentBanner(false)
  }

  const onDecline = () => {
    declineMetricsConsent()
    setMetricsConsent(getMetricsConsent())
    setShowConsentBanner(false)
    setShowWarning(true);
  }

  const onToggleClick = () => {
    setShowConsentBanner(!showConsentBanner);
  }

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_METRICS_URL || "";
    const url= process.env.NEXT_PUBLIC_METRICS_COUNTLY_APP_KEY || "";

    InitCountlyMetrics(appKey,url);

  }, [])

  useEffect(() => {
    setMetricsConsent(metricsConsent)

    if(metricsConsent != null) {
      try {
        updateMetricsConsent(JSON.parse(metricsConsent))
        setShowConsentBanner(false)
      } catch {
        setShowConsentBanner(true)
      }
    } else {
      setShowConsentBanner(true)
    }
  },[metricsConsent])

  return (
    <>
      <Head>
        <title>StarMaps</title>
        <meta name='description' content='Roadmapping tool' />
        <meta name="viewport" content="initial-scale=1, maximum-scale=1, width=768px, user-scalable=no" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
        <Flex className="metrics-consent-container" position="fixed" w="100%" left="0" bottom="0px">
            <Warning showWarning={showWarning} onClose={() => setShowWarning(false)} showMetricInfoLink={true} />
            <ConsentBanner onAccept={() => onAccept()} onDecline={() => onDecline()} showConsentBanner={showConsentBanner} />
            <Flex position="fixed" left="8px" bottom="8px">
              <ConsentToggle onToggleClick={() => onToggleClick()}/>
            </Flex>
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;
