import "../styles/globals.css";
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../theme"
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider theme={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </UserProvider>
  );
}

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT!
})(MyApp as React.ComponentType<{}>);
