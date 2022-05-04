import "../styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../reference";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
