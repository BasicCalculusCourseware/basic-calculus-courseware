// LIB FUNCTIONS
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
// FUNCTIONS
import { getUserByEmail } from 'src/firebase/client/utils/user';
import { auth } from 'src/firebase/client';
// LIB COMPONENTS
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Link from 'next/link';
// COMPONENTS
import { LinkTextSpan } from 'src/components/styled';
// RECOIL
import { useSetAuth, useHandleBannedStatus } from 'src/states/auth';
import { useAddSnackbarItem } from 'src/states/snackbar';

// MAIN-COMPONENT
export default function SignInView() {
    // ROUTER
    const router = useRouter();
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    const setAuth = useSetAuth();
    const handleBannedStatus = useHandleBannedStatus();
    // STATES
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // UTILS
    const handleReset = () => {
        setEmail('');
        setPassword('');
    };
    const handleSubmit = async () => {
        try {
            if (!email || !password)
                return addSnackbarItem('error', 'The form is incomplete');
            addSnackbarItem('info', 'Signing in');
            setIsLoading(true);
            const user = await getUserByEmail(email);
            if (user.isBanned) return handleBannedStatus();
            await signInWithEmailAndPassword(auth, email, password);
            await setAuth(user);
            addSnackbarItem('success', 'Signed in successfully');
            router.push('/app/dashboard');
        } catch (error: any) {
            let message = '';
            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        message = 'User not found';
                        break;
                    case 'auth/wrong-password':
                        message = 'Wrong password';
                        break;
                    default:
                        message = error.code;
                }
            } else message = error ? error : 'Something went wrong';
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // RENDER
    return (
        <Container maxWidth="xl">
            <Main>
                <MainForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="primary.main">
                                Basic Calculus Courseware
                            </Typography>
                            <Typography>Hey, good to see you again!</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isLoading}
                                fullWidth
                            >
                                Sign In
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                type="button"
                                color="secondary"
                                variant="outlined"
                                onClick={handleReset}
                                fullWidth
                            >
                                Reset
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                Don&apos;t have an account yet?{' '}
                                <Link href="/auth/sign-up" passHref>
                                    <LinkTextSpan>Sign up</LinkTextSpan>
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </MainForm>
            </Main>
        </Container>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Main = styled('div')({
    ...styles.flexCenter,
    ...styles.pb(4),
    minHeight: 'calc(100vh - 70px)',
});
const MainForm = styled('form')(({ theme }) => ({
    ...styles.p(4),
    ...styles.border(1),
    ...styles.borderRadius(1),
    width: '100%',
    maxWidth: 500,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        ...styles.p(2),
    },
}));
