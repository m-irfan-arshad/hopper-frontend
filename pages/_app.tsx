import "../styles/globals.css";
import { createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../theme"
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { UserProvider } from '@auth0/nextjs-auth0';
import AlertComponent from "../components/shared/alertComponent"

export const AlertContext = createContext<any>({open: false, title: '', status: ''});

function MyApp({ Component, pageProps }: AppProps) {
  const alertState = useState({open: false, title: '', status: ''});
  return (
    <AlertContext.Provider value={alertState}>
      <UserProvider>
        <ThemeProvider theme={defaultTheme}>
          <Component {...pageProps} />
          <AlertComponent />
        </ThemeProvider>
      </UserProvider>
    </AlertContext.Provider>
  );
}

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT!
})(MyApp as React.ComponentType<{}>);
