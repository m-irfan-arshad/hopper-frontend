import "../styles/globals.css";

import type { AppProps } from 'next/app'

import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../reference";
import { withLDProvider } from 'launchdarkly-react-client-sdk';

function MyApp({ Component, pageProps }: AppProps ) {
  return (
      <ThemeProvider theme={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
  );
}

export default withLDProvider({
  // TODO: extract this into environment variable
  clientSideID: '627d9222b1494a150e8f76ba'
})(MyApp as React.ComponentType<{}>);
