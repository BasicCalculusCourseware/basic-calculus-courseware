// LIB-FUNCTIONS
import { styled } from '@mui/material';
// FUNCTIONS
import styles from 'src/utils/styles';
// LIB-COMPONENTS
import { Fab, Typography, IconButton } from '@mui/material';

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
export const BreadcrumbsLink = styled(Typography)({
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
    },
});
export const ModalContent = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'white',
});
export const ModalContentHeader = styled('div')({
    ...styles.flexStartCenter,
    ...styles.borderBottom(1),
    ...styles.p(1),
    ...styles.pl(2),
});
export const ModalContentHeading = styled(Typography)({
    flexGrow: 1,
});
export const ModalContentBody = styled('div')({
    ...styles.p(2),
});
export const ModalContentFooter = styled('div')({
    ...styles.borderTop(1),
    ...styles.p(1),
});
export const IconButtonOutlined = styled(IconButton)({
    ...styles.border(1),
});
export const ColorBox = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    ...styles.box(20),
});
export const CreatorFab = styled(Fab)({
    position: 'fixed',
    bottom: styles.spacing(3),
    right: styles.spacing(3),
});
export const InfoText = styled(Typography)(({ theme }) => ({
    fontSize: 13,
    color: theme.palette.secondary.main,
    textAlign: 'center',
}));
