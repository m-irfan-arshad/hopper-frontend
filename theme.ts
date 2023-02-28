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
        orange: {
            main: string
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
        orange?: {
            main?: string;
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
            light: "#1DAFED",
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
            main: "#D8E4F4",
            dark: "#607D8B"
        },
        orange: {
            main: "#EF6C00"
        },
        success: {
            main: "#4CAF50",
            dark: "#43A047"
        }
    },
    typography: {
        allVariants: {
          WebkitFontSmoothing: "antialiased",
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
        MuiPagination: {
            styleOverrides: {
                root: {
                    "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "#0277BD",
                        color: "white"
                      }
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
                            "&::placeholder": {
                                fontStyle: "italic",
                                color: "#78909C"
                            }
                        },
                    },
                },
            ],
            styleOverrides: {
                root: {
                    color: 'black.main',
                    "& .MuiOutlinedInput-input": {
                        fontSize: ".875rem",
                        height: "1.25rem",
                        paddingTop: "0.75rem",
                        paddingBottom: "0.75rem",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D8E4F4"
                     },
                     width: "220px",
                     '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#0000003B',
                        },
                        '&:hover fieldset': {
                            borderColor: '#0000003B',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976D2',
                        },
                      },
                    "& .MuiInputLabel-outlined": {
                        color: "#00000099",
                        backgroundColor: 'white',
                        paddingRight: '.4rem',
                        '&.Mui-focused fieldset': {
                            color: '#1976D2'
                          },
                    },
                    "& .MuiInputBase-formControl": {
                        fontSize: ".875rem"
                    },
                    marginTop: "0.313rem"
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        padding: "0px 2.438rem 0px 0.563rem",
                        height: "2.938rem",
                    },
                }
            } 
        }
    }
})