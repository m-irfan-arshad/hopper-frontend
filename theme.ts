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
            main? : string;
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
            light: "#F1F5F9",
            main: "#37474F"
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
        MuiInputLabel: {
            variants: [
                {
                    props: { variant: 'standard' },
                    style: {
                        fontStyle: "italic",
                        fontSize: "0.75rem",
                        fontWeight: "400",
                        color: "#37474F"
                    }
                }
            ]
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
                        fontWeight: "400"
                    }
                },
                {
                    props: { variant: 'h3' },
                    style: {
                        fontSize: "0.875rem",
                        fontWeight: "700"
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
        },
        MuiTextField: {
            variants: [
                {
                    props: { variant: 'outlined' },
                    style: {
                        "& .MuiOutlinedInput-input": {
                            fontSize: "0.688rem",
                            "&::placeholder": {
                                fontStyle: "italic"
                            }
                        },
                        marginTop: "0.313rem"
                    }
                },
            ],
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D8E4F4"
                     },
                     width: "220px",
                     "& .MuiOutlinedInput-input": {
                        paddingTop: "12px",
                        paddingBottom: "12px",
                     },
                }
            }
        },
    }
})