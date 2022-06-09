// LIB-FUNCTIONS
import { useState, useMemo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
// FUNCTIONS
import { db } from 'src/firebase/client';
// LIB-COMPONENTS
import { Typography, Button, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// COMPONENTS
import { TabHeader, TabBody, TabFooter } from '.';
import Select from 'src/components/modules/Select';
import DatePicker from 'src/components/modules/DatePicker';
// RECOIL
import { useAddSnackbarItem } from 'src/states/snackbar';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function BasicInfoPanel() {
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    // CONTEXT
    const { user, refreshUser } = useAccountDisplayContext();
    // STATES
    const [form, setForm] = useState({
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
    });
    const [isLoading, setIsLoading] = useState(false);
    const isChanged = useMemo(() => {
        return Object.keys(form).some((key) => {
            // @ts-ignore
            return form[key] !== user[user];
        });
    }, [form, user]);
    // FB-UTILS
    const updateDatabase = async () => {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            name: form.name,
            gender: form.gender,
            birthday: new Date(form.birthday).getTime(),
        });
    };
    // UTILS
    const handleReset = () => {
        const { name, gender, birthday } = user;
        setForm({ name, gender, birthday });
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
                <Typography variant="h6">Basic Info</Typography>
            </TabHeader>
            <TabBody>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            label="Name"
                            placeholder="First MI. Last"
                            value={form.name}
                            onChange={(e) =>
                                setForm((form) => ({ ...form, name: e.target.value }))
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Select
                            label="Gender"
                            value={form.gender}
                            setValue={(val: string) =>
                                setForm((form) => ({ ...form, gender: val }))
                            }
                            items={[
                                { label: 'Male', value: 'male' },
                                { label: 'Female', value: 'female' },
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Birthday"
                            value={form.birthday}
                            setValue={(val: any) =>
                                setForm((form) => ({
                                    ...form,
                                    birthday: val,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            variant="outlined"
                            label="Created At"
                            value={new Date(user.createdAt).toDateString()}
                            fullWidth
                            disabled
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
