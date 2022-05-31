// TYPES
import type { ChildrenProp } from 'src/interfaces';
// LIB FUNCTIONS
import { createTheme } from '@mui/material';
import { useMemo } from 'react';
// LIB COMPONENTS
import { CssBaseline, ThemeProvider } from '@mui/material';

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
                    main: '#37474f',
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
