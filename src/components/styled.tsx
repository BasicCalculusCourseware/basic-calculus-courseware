import { styled } from '@mui/material';
import styles from 'src/utils/styles';

export const Page = styled('div')({
    ...styles.pt(2),
    ...styles.pb(8),
    minHeight: 'calc(100vh - 66px)',
    backgroundColor: styles.bgColor,
    backgroundImage: styles.bgPattern,
});
export const PageBreadcrumbs = styled('div')(({ theme }) => ({
    overflowX: 'auto',
    userSelect: 'none',
    scrollbarWidth: 'none',
    cursor: 'default',
    '&::-webkit-scrollbar': {
        display: 'none',
    },
    '.MuiBreadcrumbs-root': {
        width: ' max-content',
        p: {
            fontSize: 15,
            "&[data-is-current='true']": {
                color: theme.palette.primary.main,
            },
            "&[data-is-link='true']": {
                cursor: 'pointer',
                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
    },
    '*': {
        backgroundColor: 'transparent',
    },
}));
export const PageHeader = styled('div')({
    ...styles.mt(1),
    ...styles.mb(2),
});
export const PageBody = styled('div')({});
export const Warning = styled('div')(({ theme }) => ({
    ...styles.flexCenter,
    ...styles.px(2),
    minHeight: 'calc(100vh - 70px)',
    flexDirection: 'column',
    textAlign: 'center',
    color: theme.palette.secondary.main,
}));
export const WarningTextIcon = styled('p')({
    fontSize: '100px',
    fontWeight: 'bold',
});
export const WarningIcon = styled('div')({
    svg: {
        fontSize: '100px',
    },
});
export const LinkTextSpan = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    },
}));
export const LinkDivider = styled('span')({
    ...styles.mx(1),
    color: '#e0e0e0',
});
