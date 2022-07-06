// LIB-FUNCTIONS
import { useState } from 'react';
// FUNCTIONS
import { deleteAssessment } from 'src/firebase/client/utils/assessment';
// LIB-COMPONENTS
import { Modal, Zoom, Stack, Button, Alert, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// COMPONENTS
import { ModalContent } from 'src/components/styled';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useRefreshAssessments } from '../../..';
import { ATAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function AssessmentDeleterModal() {
    // RECOIL
    const { deleter: isModalOpen } = useRecoilValue(ATAtoms.modals);
    const selected = useRecoilValue(ATAtoms.selected);
    const setModal = useSetModal();
    const refreshAssessments = useRefreshAssessments();
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    // UTILS
    const handleClose = () => !isLoading && setModal({ deleter: false });
    const handleDelete = async () => {
        try {
            addSnackbarItem('info', 'Deleting Assessment');
            setIsLoading(true);
            await deleteAssessment(selected.id);
            await refreshAssessments();
            addSnackbarItem('success', 'Assessment deleted successfully');
            handleClose();
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // RENDER
    return (
        <Modal open={isModalOpen}>
            <Zoom in={isModalOpen}>
                <ModalContent sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Alert severity="warning">
                            <AlertTitle>Warning</AlertTitle>
                            Do you really want to delete this Assessment[
                            {selected.title}]? This process cannot be undone.
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
    );
}
