import { createTheme } from "@mui/material/styles";

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
            dark?: string;
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
            main: "#66BB6A",
            dark: "#4DA551"
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
                    boxShadow: "none",
                    fontSize: "0.625rem",
                    fontWeight: "700"
                }
            }
        },
        MuiTypography: {
            variants: [
                {
                    props: { variant: 'h1' },
                    style: {
                        fontSize: "0.625rem",
                        fontWeight: "700",
                    }
                },
                {
                    props: { variant: 'h2' },
                    style: {
                        fontSize: "1rem",
                    }
                },
                {
                    props: { variant: 'body1' },
                    style: {
                        fontSize: "0.625rem",
                        fontWeight: "400"
                    }
                },
                {
                    props: { variant: 'body2' },
                    style: {
                        fontStyle: "italic",
                        fontSize: "0.75rem",
                        fontWeight: "400"
                    }
                },
            ]
        }
    }
})