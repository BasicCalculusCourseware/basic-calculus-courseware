// LIB COMPONENTS
import Link from 'next/link';
import { LinkDivider } from 'src/components/styled';

// COMPONENT
export default function LinkSectionComponent() {
    return (
        <LinkSection>
            <LinkMenu>
                <Link href="/resources/terms-and-conditions" passHref>
                    <LinkItem>Terms and Conditions</LinkItem>
                </Link>
                <LinkDivider>|</LinkDivider>
                <Link href="/resources/privacy-policy" passHref>
                    <LinkItem>Privacy Policy</LinkItem>
                </Link>
            </LinkMenu>
        </LinkSection>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const LinkSection = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    ...styles.pb(1),
    [theme.breakpoints.down('md')]: {
        ...styles.flexCenter,
    },
}));
const LinkMenu = styled('p')({
    ...styles.flexStartCenter,
});
const LinkItem = styled('span')(({ theme }) => ({
    fontSize: '13px',
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
    },
}));
