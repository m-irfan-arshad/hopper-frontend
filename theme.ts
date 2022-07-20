import { createTheme } from "@mui/material/styles";

// const colors = {
//     red: "#EF5350",
//     yellow: "#FFA726",
//     green: "#66BB6A",
//     blue: "#42A5F5",
//     lightBlue: "#D8E4F4",
//     lightGrey: "#F1F5F9"
// };

declare module '@mui/material/styles' {
    interface PaletteOptions {
        blue?: {
            dark?: string;
            light?: string;
            main?: string;
        },
        white?: {
            main?: string;
        },
        black?: {
            main?: string;
        },
        red?: {
            main?: string;
        },
        yellow?: {
            main?: string;
        },
        green?: {
            main?: string;
        },
        gray?: {
            light?: string;
        }
    }
  }

export const defaultTheme = createTheme({
    palette: {
        blue: {
            dark: "#0277BD",
            light: "#D8E4F4",
            main: "#42A5F5"
        },
        white: {
            main: "#FFFFFF"
        },
        black: {
            main: "#37474F"
        },
        red: {
            main: "#EF5350"
        },
        yellow: {
            main: "#FFA726"
        },
        green: {
            main: "#66BB6A"
        },
        gray: {
            light: "#F1F5F9"
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                    boxShadow: "none"
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontSize: "12px",
                    fontFamily: "Roboto"
                }
            },
        }
        // MuiOutlinedInput: {
        //     styleOverrides: {
        //         root: {
        //             border: "none"
        //         }
        //     }
        // }
    }
})