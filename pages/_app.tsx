import React from 'react'
import {ThemeProvider, BaseStyles} from '@primer/react'

function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <Component {...pageProps} />
      </BaseStyles>
    </ThemeProvider>
  );
}

export default App;
