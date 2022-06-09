// LIB FUNCTIONS
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
// FUNCTIONS
import { getUser } from 'src/firebase/client/utils/user';
import { auth, db } from 'src/firebase/client';
// LIB COMPONENTS
import { Container, Grid, Typography, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Link from 'next/link';
// COMPONENTS
import { LinkTextSpan } from 'src/components/styled';
import Select from 'src/components/modules/Select';
import DatePicker from 'src/components/modules/DatePicker';
// RECOIL
import { useSetAuth } from 'src/states/auth';
import { useAddSnackbarItem } from 'src/states/snackbar';

// UTILS
const formInitState = {
    name: '',
    birthday: 0,
    gender: '',
    role: '',
    phone: '',
    fb: '',
    email: '',
    password: '',
    repassword: '',
};

// MAIN-COMPONENT
export default function SignUpView() {
    // ROUTER
    const router = useRouter();
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    const setAuth = useSetAuth();
    // STATES
    const [form, setForm] = useState(formInitState);
    const [isLoading, setIsLoading] = useState(false);
    const validator = useMemo(() => {
        console.log(form);
        if (Object.values(form).some((value: any) => !value))
            return { error: 'The form is incomplete' };
        if (form.password !== form.repassword)
            return { error: 'Password did not matched!' };
        return { error: null };
    }, [form]);
    // UTILS
    const handleReset = () => setForm(formInitState);
    const handleSubmit = async () => {
        try {
            if (validator.error) return addSnackbarItem('error', validator.error);
            addSnackbarItem('info', 'Signing up');
            setIsLoading(true);
            const { user } = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            await sendEmailVerification(user);
            // SAVE USER DATA TO DATABASE
            await setDoc(doc(db, 'users', user.uid), {
                email: form.email,
                name: form.name,
                gender: form.gender,
                role: form.role,
                phone: form.phone,
                fb: form.fb,
                birthday: form.birthday,
                uid: user.uid,
                createdAt: Date.now(),
                photoUrl: '/images/no-profile.png',
                isTeacherVerified: false,
                isEnrolled: false,
                isBanned: false,
            });
            await setAuth(await getUser(user.uid));
            addSnackbarItem('info', 'Signed up successfully');
            router.push('/auth/email-verification');
        } catch (error: any) {
            let message = '';
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        message = 'Email already in use';
                        break;
                }
            } else message = error;
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
                            <Typography>
                                Create your account by filling the form below.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                placeholder="First MI. Last"
                                value={form.name}
                                onChange={(e) =>
                                    setForm((form) => ({
                                        ...form,
                                        name: e.target.value,
                                    }))
                                }
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                label="Gender"
                                value={form.gender}
                                setValue={(value) =>
                                    setForm((form) => ({
                                        ...form,
                                        gender: value,
                                    }))
                                }
                                items={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                ]}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                label="Role"
                                value={form.role}
                                setValue={(value) =>
                                    setForm((form) => ({ ...form, role: value }))
                                }
                                items={[
                                    { label: 'Student', value: 'student' },
                                    { label: 'Teacher', value: 'teacher' },
                                ]}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Birthday"
                                value={form.birthday}
                                setValue={(value) =>
                                    setForm((form) => ({
                                        ...form,
                                        birthday: value as number,
                                    }))
                                }
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Phone"
                                placeholder="09xxxxxxxxx"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm((v) => ({ ...v, phone: e.target.value }))
                                }
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="FB Profile Link"
                                placeholder="https://www.facebook.com/example"
                                value={form.fb}
                                onChange={(e) =>
                                    setForm((v) => ({ ...v, fb: e.target.value }))
                                }
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm((v) => ({ ...v, email: e.target.value }))
                                }
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="password"
                                label="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm((v) => ({ ...v, password: e.target.value }))
                                }
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="password"
                                label="Repeat Password"
                                value={form.repassword}
                                onChange={(e) =>
                                    setForm((v) => ({ ...v, repassword: e.target.value }))
                                }
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
                                Sign Up
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
                                Already have an account?{' '}
                                <Link href="/auth/sign-in" passHref>
                                    <LinkTextSpan>Sign in</LinkTextSpan>
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
    maxWidth: 650,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
        ...styles.p(2),
    },
}));
