import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme({
  typography: {
    poster: {
      color: "green",
    },
    h3: undefined,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "white",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: "fantasy",
      },
    },
  },
});
