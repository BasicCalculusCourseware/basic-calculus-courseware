// LIB-FUNCTIONS
import { useState } from 'react';
import { useRouter } from 'next/router';
// FUNCTIONS
import { deleteUser } from 'src/firebase/client/utils/user';
// LIB-COMPONENTS
import {
    Typography,
    Grid,
    Modal,
    Stack,
    Button,
    Zoom,
    Alert,
    AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// COMPONENTS
import { ModalContent } from 'src/components/styled';
import { TabHeader, TabBody } from '.';
// RECOIL
import { useAddSnackbarItem } from 'src/states/snackbar';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function DangerousZonePanel() {
    // ROUTER
    const router = useRouter();
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    const { user } = useAccountDisplayContext();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    // MODAL
    const [isOpen, setIsOpen] = useState(false);
    function handleOpen() {
        setIsOpen(true);
    }
    function handleClose() {
        !isLoading && setIsOpen(false);
    }
    // UTILS
    const handleDelete = async () => {
        try {
            addSnackbarItem('info', 'Updating data');
            setIsLoading(true);
            await deleteUser(user.uid);
            addSnackbarItem('success', 'Data updated successfully');
            router.back();
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
                <Typography variant="h6">Dangerous Zone</Typography>
            </TabHeader>
            <TabBody>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <LoadingButton
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={handleOpen}
                        >
                            Delete Account
                        </LoadingButton>
                    </Grid>
                </Grid>
            </TabBody>

            <Modal open={isOpen} onClose={handleClose}>
                <Zoom in={isOpen}>
                    <ModalContent sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Alert severity="warning">
                                <AlertTitle>Warning</AlertTitle>
                                Do you really want to delete this Account? This
                                process cannot be undone.
                            </Alert>
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="flex-end"
                            >
                                <Button
                                    variant="text"
                                    color="secondary"
                                    disabled={isLoading}
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                                <LoadingButton
                                    variant="contained"
                                    color="error"
                                    loading={isLoading}
                                    onClick={handleDelete}
                                >
                                    Delete
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </ModalContent>
                </Zoom>
            </Modal>
        </div>
    );
}
