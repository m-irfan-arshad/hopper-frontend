import "../styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../reference";
import { SplitFactory, withSplitFactory } from '@splitsoftware/splitio-react';

const sdkConfig = {
  core: {
    authorizationKey: 'm4b8gaq7o4j7929fis12l0003t5bppg5f1cn',
    key: 'key'
  }
};

function MyApp({ Component, pageProps }) {
  return (
    <SplitFactory config={sdkConfig} >
      <ThemeProvider theme={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SplitFactory>
  );
}

export default MyApp;
