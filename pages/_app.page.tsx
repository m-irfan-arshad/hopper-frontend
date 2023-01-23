import "../styles/globals.css";
import { createContext, useState } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../theme"
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import { UserProvider } from '@auth0/nextjs-auth0';
import AlertComponent from "../components/shared/alertComponent"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export const AlertContext = createContext<any>({open: false, title: '', status: ''});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const alertState = useState({open: false, title: '', status: ''});
  return (
    <QueryClientProvider client={queryClient}>
        <AlertContext.Provider value={alertState}>
          <UserProvider>
            <ThemeProvider theme={defaultTheme}>
              <Component {...pageProps} />
              <AlertComponent />
            </ThemeProvider>
          </UserProvider>
        </AlertContext.Provider>
    </QueryClientProvider>
  );
}

export default withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT!
})(MyApp as React.ComponentType<{}>);
