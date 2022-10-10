import React from 'react';
import { ThemeProvider, BaseStyles, SSRProvider } from '@primer/react';

function App({ Component, pageProps }) {
  return (
    <SSRProvider>
      <ThemeProvider>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </ThemeProvider>
    </SSRProvider>
  );
}

export default App;
