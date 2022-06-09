// LIB-FUNCTIONS
import { useState, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
// FUNCTIONS
import { db } from 'src/firebase/client';
// LIB-COMPONENTS
import { Typography, Button, Grid, TextField, Hidden } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// COMPONENTS
import { TabHeader, TabBody, TabFooter } from '.';
import Select from 'src/components/modules/Select';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { authAtoms } from 'src/states/auth';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function AccessInfoPanel() {
    // RECOIL
    const authUser = useRecoilValue(authAtoms.user);
    const addSnackbarItem = useAddSnackbarItem();
    // CONTEXT
    const { user, refreshUser } = useAccountDisplayContext();
    // STATES
    const [form, setForm] = useState({
        role: user.role,
        isBanned: user.isBanned,
        isEnrolled: user.isEnrolled,
        isTeacherVerified: user.isTeacherVerified,
    });
    const [isLoading, setIsLoading] = useState(false);
    const isChanged = useMemo(() => {
        return Object.keys(form).some((key) => {
            // @ts-ignore
            return form[key] !== user[key];
        });
    }, [form, user]);
    // FB-UTILS
    const updateDatabase = async () => {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, form);
    };
    // UTILS
    const handleReset = () => {
        const { role, isBanned, isEnrolled, isTeacherVerified } = user;
        setForm({ role, isBanned, isEnrolled, isTeacherVerified });
    };
    const handleSave = async () => {
        try {
            if (!isChanged) return;
            addSnackbarItem('info', 'Updating data');
            setIsLoading(true);
            await updateDatabase();
            await refreshUser();
            addSnackbarItem('success', 'Data updated successfully');
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // RENDER
    return (
        <div>
            <TabHeader>
                <Typography variant="h6">Access Info</Typography>
            </TabHeader>
            <TabBody>
                <Grid container spacing={2}>
                    {authUser.uid === user.uid ? (
                        <>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    variant="outlined"
                                    label="Role"
                                    value={user.role}
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            {user.role === 'student' && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Is Enrolled"
                                        value={
                                            user.isEnrolled ? 'Enrolled' : 'Not Enrolled'
                                        }
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                            )}
                            {user.role === 'teacher' && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Is Teacher Verified"
                                        value={
                                            user.isTeacherVerified
                                                ? 'Teacher Verified'
                                                : 'Waiting for verification'
                                        }
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                            )}
                            {user.role !== 'admin' && (
                                <Hidden mdDown>
                                    <Grid item md={3} />
                                </Hidden>
                            )}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    variant="outlined"
                                    label="Is Email Verified"
                                    value={
                                        user.isEmailVerified
                                            ? 'Email Verified'
                                            : 'Waiting for verification'
                                    }
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} md={6}>
                                <Select
                                    label="Role"
                                    value={form.role}
                                    setValue={(val) =>
                                        setForm((form) => ({ ...form, phone: val }))
                                    }
                                    items={[
                                        { label: 'Student', value: 'student' },
                                        { label: 'Teacher', value: 'teacher' },
                                    ]}
                                    disabled={authUser.role === 'teacher'}
                                    required
                                />
                            </Grid>
                            {user.role === 'student' && (
                                <Grid item xs={12} md={6}>
                                    <Select
                                        label="Is Enrolled"
                                        value={form.isEnrolled}
                                        setValue={(val) =>
                                            setForm((form) => ({
                                                ...form,
                                                isEnrolled: val,
                                            }))
                                        }
                                        items={[
                                            { label: 'Enrolled', value: true },
                                            { label: 'Not Enrolled', value: false },
                                        ]}
                                        required
                                    />
                                </Grid>
                            )}
                            {user.role === 'teacher' && (
                                <Grid item xs={12} md={6}>
                                    <Select
                                        label="Is Teacher Verified"
                                        value={form.isTeacherVerified}
                                        setValue={(val) =>
                                            setForm((form) => ({
                                                ...form,
                                                isTeacherVerified: val,
                                            }))
                                        }
                                        items={[
                                            { label: 'Verified', value: true },
                                            { label: 'Not Verified', value: false },
                                        ]}
                                        required
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} md={6}>
                                <Select
                                    label="Is Banned"
                                    value={form.isBanned}
                                    setValue={(val) =>
                                        setForm((form) => ({ ...form, isBanned: val }))
                                    }
                                    items={[
                                        { label: 'Banned', value: true },
                                        { label: 'Not Banned', value: false },
                                    ]}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    variant="outlined"
                                    label="Is Email Verified"
                                    value={
                                        user.isEmailVerified
                                            ? 'Email Verified'
                                            : 'Waiting for verification'
                                    }
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </TabBody>
            {authUser.uid !== user.uid && (
                <TabFooter>
                    <Button
                        size="large"
                        variant="text"
                        color="secondary"
                        onClick={handleReset}
                    >
                        RESET
                    </Button>
                    <LoadingButton
                        size="large"
                        variant="contained"
                        loading={isLoading}
                        onClick={handleSave}
                        disabled={!isChanged}
                    >
                        Save
                    </LoadingButton>
                </TabFooter>
            )}
        </div>
    );
}
