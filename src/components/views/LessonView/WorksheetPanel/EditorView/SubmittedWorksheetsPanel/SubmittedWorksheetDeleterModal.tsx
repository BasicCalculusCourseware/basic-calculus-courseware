// LIB-FUNCTIONS
import { useState } from 'react';
// FUNCTIONS
import { unsubmitWorksheet } from 'src/firebase/client/utils/submitedWorksheet';
// LIB-COMPONENTS
import { Modal, Zoom, Stack, Button, Alert, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// COMPONENTS
import { ModalContent } from 'src/components/styled';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { sworksheetsPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    fetchData: () => Promise<void>;
}
export default function SubmittedWorksheetDeleterModal({ fetchData }: Props) {
    // RECOIL
    const { deleter: isModalOpen } = useRecoilValue(
        sworksheetsPanelAtoms.modals
    );
    const worksheet = useRecoilValue(sworksheetsPanelAtoms.worksheet);
    const selected = useRecoilValue(sworksheetsPanelAtoms.selected);
    const setModal = useSetModal();
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    // UTILS
    const handleClose = () => !isLoading && setModal({ deleter: false });
    const handleDelete = async () => {
        try {
            addSnackbarItem('info', 'Deleting Worksheet');
            setIsLoading(true);
            await unsubmitWorksheet(worksheet.id, selected.uid);
            await fetchData();
            addSnackbarItem('success', 'Worksheet deleted successfully');
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
                            Do you really want to delete this student&apos;s
                            worksheet[{selected.fileName}]? This process cannot
                            be undone.
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
