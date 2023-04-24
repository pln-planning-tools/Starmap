import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name='description' content='Roadmapping tool' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='manifest' href='/manifest.webmanifest' />
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script
          src="/update-listener.js"
          strategy="beforeInteractive"
        ></Script>
      </body>
    </Html>
  )
}
