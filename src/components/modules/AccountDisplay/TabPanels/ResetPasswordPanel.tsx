// LIB-FUNCTIONS
import { useState, useMemo } from 'react';
// FUNCTIONS
import { updateUserPassword } from 'src/firebase/client/utils/user';
// LIB-COMPONENTS
import { Typography, Button, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// COMPONENTS
import { TabHeader, TabBody, TabFooter } from '.';
// RECOIL
import { useAddSnackbarItem } from 'src/states/snackbar';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function ResetPasswordPanel() {
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    // CONTEXT
    const { user, refreshUser } = useAccountDisplayContext();
    // STATES
    const [form, setForm] = useState({
        password: '',
        repassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const validator = useMemo(() => {
        if (Object.values(form).some((value: any) => !value))
            return { error: 'The form is incomplete' };
        if (form.password !== form.repassword)
            return { error: 'Password did not matched!' };
        return { error: null };
    }, [form]);
    // UTILS
    const handleReset = () => {
        setForm({
            password: '',
            repassword: '',
        });
    };
    const handleSave = async () => {
        try {
            if (validator.error) return addSnackbarItem('error', validator.error);
            addSnackbarItem('info', 'Updating data');
            setIsLoading(true);
            await updateUserPassword(user.uid, form.password);
            await refreshUser();
            handleReset();
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
                <Typography variant="h6">Reset Password</Typography>
            </TabHeader>
            <TabBody>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            type="password"
                            variant="outlined"
                            label="New Password"
                            value={form.password}
                            onChange={(e) =>
                                setForm((form) => ({ ...form, password: e.target.value }))
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            type="password"
                            variant="outlined"
                            label="Confirm New Password"
                            value={form.repassword}
                            onChange={(e) =>
                                setForm((form) => ({
                                    ...form,
                                    repassword: e.target.value,
                                }))
                            }
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </TabBody>
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
                    disabled={validator.error !== null}
                >
                    Save
                </LoadingButton>
            </TabFooter>
        </div>
    );
}
