import { createTheme } from '@mui/material/styles';

const themePresets = {
    'cool-light': {
        mode: 'light',
        primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
        secondary: { main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' },
        background: { default: '#f5f5f5', paper: '#ffffff' },
        text: { primary: '#212121', secondary: '#757575' },
    },
};

export const getTheme = () => {
    // strict fallback since we only have one theme now
    const preset = themePresets['cool-light'];

    return createTheme({
        palette: {
            mode: preset.mode as any,
            primary: preset.primary,
            secondary: preset.secondary,
            background: preset.background,
            text: preset.text,
            divider: 'rgba(0, 0, 0, 0.12)',
        },
        typography: {
            fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
            h6: { fontWeight: 600 },
            button: { textTransform: 'none', fontWeight: 500 },
        },
        shape: { borderRadius: 4 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                    }
                },
            },
            MuiButtonGroup: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                    },
                },
            },
            MuiTextField: { defaultProps: { size: 'small', variant: 'outlined', margin: 'dense' } },
            MuiSelect: { defaultProps: { size: 'small', margin: 'dense' } },
            MuiFormControl: { defaultProps: { size: 'small', margin: 'dense' } },
            MuiInputLabel: { defaultProps: { margin: 'dense', shrink: true } }, // Always shrink label for compactness
            MuiListItem: { styleOverrides: { root: { paddingTop: 0, paddingBottom: 0 } } }, // Remove list item padding
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                        fontSize: '0.875rem', // Ensure small font size
                    },
                    input: {
                        padding: '6px 10px', // Reduce input padding
                    }
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        minHeight: '48px !important', // Reduce toolbar height
                    }
                }
            },
            MuiTabs: {
                styleOverrides: {
                    root: {
                        minHeight: 36,
                    }
                }
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        minHeight: 36,
                        minWidth: 0,
                        fontSize: '0.75rem',
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 16,
                        paddingRight: 16,
                        flexShrink: 1,
                        whiteSpace: 'nowrap',
                    }
                }
            }
        },
    });
};
