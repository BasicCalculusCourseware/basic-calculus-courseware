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
// RECOIL
import { useAddSnackbarItem } from 'src/states/snackbar';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function ContactInfoTab() {
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    // CONTEXT
    const { user, refreshUser } = useAccountDisplayContext();
    // STATES
    const [form, setForm] = useState({
        phone: user.phone,
        fb: user.fb,
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
        await refreshUser();
    };
    // UTILS
    const handleReset = () => {
        const { phone, fb } = user;
        setForm({ phone, fb });
    };
    const handleSave = async () => {
        try {
            if (!isChanged) return;
            addSnackbarItem('info', 'Updating data');
            setIsLoading(true);
            await updateDatabase();
            addSnackbarItem('success', 'Data updated successfully');
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    // RENDER
    return (
        <div>
            <TabHeader>
                <Typography variant="h6">Contact Info</Typography>
            </TabHeader>
            <TabBody>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            label="Email"
                            value={user.email}
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            label="Phone"
                            placeholder="09xxxxxxxxx"
                            value={form.phone}
                            onChange={(e) =>
                                setForm((form) => ({ ...form, phone: e.target.value }))
                            }
                            fullWidth
                        />
                    </Grid>
                    <Hidden mdDown>
                        <Grid item md={3} />
                    </Hidden>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            label="FB Profile Link"
                            placeholder="https://www.facebook.com/example"
                            value={form.fb}
                            onChange={(e) =>
                                setForm((form) => ({ ...form, fb: e.target.value }))
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
                    disabled={!isChanged}
                >
                    Save
                </LoadingButton>
            </TabFooter>
        </div>
    );
}
