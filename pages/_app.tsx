import "../styles/globals.css";
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../reference";
import { withLDProvider } from 'launchdarkly-react-client-sdk';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}


export default withLDProvider({
  // TODO: extract this into environment variable
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT!
})(MyApp as React.ComponentType<{}>);
