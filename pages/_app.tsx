import Head from 'next/head'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { noSSR } from 'next/dynamic'
import React, { useEffect } from 'react'
import { onCLS, onFID, onLCP } from 'web-vitals'

import { setTelemetry, useTelemetry } from '../hooks/useTelemetry'

import './style.css'
import type { BrowserMetricsProvider } from '../lib/types'

const theme = extendTheme({
  semanticTokens: {
    colors: {
      background: {
        default: '#FFFFFF'
      },
      inactive: {
        // darkGray: '#D7D7D7',
        default: '#D7D7D7'
      },
      inactiveAccent: {
        // lightGray: '#EFEFEF',
        default: '#EFEFEF'
      },
      progressGreen: {
        // progressGreen: '#7DE087',
        default: '#7DE087'
      },
      progressGreenAccent: {
        // progressGreenAccent: 'rgba(125, 224, 135, 0.28)',
        // default: 'rgba(125, 224, 135, 0.28)',
        default: '#7de08747'
      },
      spotLightBlue: {
        default: '#1FA5FF'
      },
      linkBlue: {
        default: '#4987BD'
      },
      text: {
        default: '#313239'
      },
      textMuted: {
        default: '#a3a3a3'
      },
      textHeader: {
        default: '#FFFFFF'
      },
      orangeAccent: {
        default: '#F39106'
      }
    }
  }
})

/**
 * We have to do funky imports here to satisfy nextjs since this package is cjs and ignite-metrics is esm
 *
 * Also, Next.js expects all dynamic imports to return react components, but we're not getting react components from
 * ignite-metrics here; hence the 'ts-expect-error'.
 */
// @ts-expect-error
const igniteMetricsModulePromise: Promise<{BrowserMetricsProvider: BrowserMetricsProvider}> = noSSR(() => import('@ipfs-shipyard/ignite-metrics/browser-vanilla'), {})

function logDelta ({ name, id, delta, value, rating }) {
  console.log(`${name} (${rating}): ID ${id}: ${value} - changed by ${delta}`)
}
let webVitalsRegistered = false
function App ({ Component, pageProps }) {
  const telemetry = useTelemetry()
  useEffect(() => {
    if (webVitalsRegistered) return
    webVitalsRegistered = true
    onCLS(logDelta, { reportAllChanges: true })
    onFID(logDelta, { reportAllChanges: true })
    onLCP(logDelta, { reportAllChanges: true })
  }, [])

  useEffect(() => {
    // read from the localStorage and send a message to the service worker to call debug.enable(<debugString>)
    async function setupSWDebug () {
      const registration = await navigator.serviceWorker.ready
      const debugString = localStorage.getItem('debug')
      if (debugString) {
        registration.active?.postMessage({
          type: 'DEBUG_JS_ENABLE',
          debugString
        })
      }
    }
    setupSWDebug()
  }, [])

  useEffect(() => {
    (async () => {
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
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}

export default App
