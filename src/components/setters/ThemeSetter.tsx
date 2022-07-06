// TYPES
import type { ChildrenProp } from 'src/interfaces';
// LIB-FUNCTIONS
import { createTheme } from '@mui/material';
import { useMemo } from 'react';
// FUNCTIONS
import styles from 'src/utils/styles';
// LIB-COMPONENTS
import { CssBaseline, ThemeProvider } from '@mui/material';

// MAIN-COMPONENT
export default function ThemeSetter({ children }: ChildrenProp) {
    const theme = useMemo(() => {
        return createTheme({
            typography: {
                fontFamily: 'ABeeZee',
            },
            palette: {
                mode: 'light',
                primary: {
                    main: '#2979ff',
                },
                secondary: {
                    main: '#616161',
                },
            },
            components: {
                MuiAlert: {
                    styleOverrides: {
                        root: {
                            wordBreak: 'break-all',
                        },
                    },
                },
                MuiModal: {
                    styleOverrides: {
                        root: {
                            ...styles.flexCenter,
                            ...styles.p(2),
                        },
                    },
                },
                MuiList: {
                    styleOverrides: {
                        root: {
                            ...styles.border(1),
                            ...styles.p(0),
                        },
                    },
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            ...styles.borderBottom(1),
                            ...styles.px(1.5),
                            ...styles.py(1),
                            fontSize: 13,
                            svg: {
                                ...styles.mr(1),
                                fontSize: 20,
                            },
                            ':last-child': {
                                border: 'none',
                            },
                        },
                    },
                },
                MuiFab: {
                    styleOverrides: {
                        root: {
                            '&[data-translucent="true"]': {
                                opacity: 0.5,
                                transition: '.2s',
                                '&:hover': {
                                    opacity: 1,
                                },
                            },
                        },
                    },
                },
            },
        });
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
