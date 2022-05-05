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
        fontFamily: "sans-serif",
      },
    },
    "MuiCardHeader-avatar": {
      styleOverrides: {
        margin: 0,
      },
    },
  },
});

export const caseCardSubFields = [
  {
    label: "Procedure Date",
    id: "procedureDate",
  },
  {
    label: "Procedure Location",
    id: "procedureLocation",
  },
  {
    label: "Case ID",
    id: "caseID",
  },
  {
    label: "MRN",
    id: "mrn",
  },
  {
    label: "Proceduralist",
    id: "proceduralist",
  },
  {
    label: "Quick Actions",
    id: "quickActions",
  },
];
