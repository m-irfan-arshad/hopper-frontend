import { createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
    interface Palette {
        blue: {
            dark: string;
            light: string;
            main: string;
        },
        white: {
            main: string;
        },
        black: {
            main: string;
        },
        red: {
            main: string;
        },
        yellow: {
            main: string;
        },
        green: {
            light: string;
            main: string;
            dark: string;
        },
        gray: {
            light: string;
            main: string;
        }
    }
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
            light?: string;
            main?: string;
            dark?: string;
        },
        gray?: {
            light?: string;
            main? : string;
            dark?: string;
        }
    }
    interface TypographyVariantsOptions {
        title1?: {
            fontSize?: string;
            fontWeight?: string;
            fontFamily?: string;
        },
        title2?: {
            fontSize?: string;
            fontWeight?: string;
            fontStyle?: string;
            fontFamily?: string;
        }
      }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
      title1: true;
      title2: true;
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
            light: "#81C784",
            main: "#66BB6A",
            dark: "#4DA551"
        },
        gray: {
            light: "#F1F5F9",
            main: "#37474F",
            dark: "#607D8B"
        },
        success: {
            main: "#4CAF50",
        }
    },
    typography: {
        allVariants: {
          color: "#37474F"
        },
        caption: {
            color: "#607D8B"
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                    boxShadow: "none",
                    color: "white"
                },
            }
        },
        MuiInputLabel: {
            variants: [
                {
                    props: { variant: 'standard' },
                    style: {
                        fontStyle: "normal",
                        fontSize: "0.75rem",
                        fontWeight: "400",
                        color: "#37474F"
                    }
                }
            ]
        },
        MuiTextField: {
            variants: [
                {
                    props: { variant: "outlined" },
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