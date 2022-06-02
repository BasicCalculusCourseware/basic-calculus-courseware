// LIB COMPONENTS
import { Container, Typography, Divider } from '@mui/material';
import Link from 'next/link';
// COMPONENTS
import { EmailVerificationIcon } from 'src/components/icons';
import { LinkTextSpan, LinkDivider } from 'src/components/styled';

// MAIN-COMPONENT
export default function EmailVerificationView() {
    return (
        <Container maxWidth="xl">
            <MainContainer>
                <MainBody>
                    <EmailVerificationIcon />
                    <Typography variant="h5">Verify your email address</Typography>
                    <Typography>
                        To ensure your account&apos;s safety, go to your email&apos;s
                        inbox and find the verification link of your sign up.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2">
                        Proceed to{' '}
                        <Link href="/" passHref>
                            <LinkTextSpan>Home</LinkTextSpan>
                        </Link>
                        <LinkDivider> | </LinkDivider>
                        <Link href="/app/account" passHref>
                            <LinkTextSpan>Account</LinkTextSpan>
                        </Link>
                    </Typography>
                </MainBody>
            </MainContainer>
        </Container>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const MainContainer = styled('div')(({ theme }) => ({
    ...styles.flexCenter,
    minHeight: 'calc(100vh - 140px)',
    svg: {
        color: theme.palette.primary.main,
        fontSize: 150,
    },
}));
const MainBody = styled('div')({
    maxWidth: 500,
    textAlign: 'center',
});
