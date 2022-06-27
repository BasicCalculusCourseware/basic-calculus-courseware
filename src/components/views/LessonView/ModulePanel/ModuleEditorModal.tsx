// LIB-FUNCTIONS
import { useState, useEffect, useCallback } from 'react';
// FUNCTIONS
import { updateModule } from 'src/firebase/client/utils/module';
// LIB-COMPONENTS
import { TextField, Modal, Zoom, Stack, Tooltip } from '@mui/material';
// COMPONENTS
import {
    ModalContent,
    ModalContentHeader,
    ModalContentHeading,
    ModalContentBody,
    ModalContentFooter,
    IconButtonOutlined,
} from 'src/components/styled';
import { ResetIcon, SaveIcon, CloseIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useRefreshModules } from '../.';
import { modulePanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function ModuleEditorModal() {
    // RECOIL
    const { editor: isModalOpen } = useRecoilValue(modulePanelAtoms.modals);
    const selected = useRecoilValue(modulePanelAtoms.selected);
    const setModal = useSetModal();
    const refreshModules = useRefreshModules();
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ editor: false });
        handleReset();
    };
    const handleReset = useCallback(() => {
        const fileNameMap = selected.fileName.split('.');
        setFileExtension(fileNameMap.pop() || '');
        setFileName(fileNameMap.join('.'));
    }, [selected]);
    const handleCreate = async () => {
        try {
            if (!fileName) throw 'Incomplete fields';
            addSnackbarItem('info', 'Editing Module');
            setIsLoading(true);
            await updateModule(selected.id, {
                fileName: `${fileName}.${fileExtension}`,
            });
            await refreshModules();
            addSnackbarItem('success', 'Module edited successfully');
            handleClose();
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // EFFECTS
    useEffect(() => {
        handleReset();
    }, [handleReset]);
    // RENDER
    return (
        <Modal open={isModalOpen}>
            <Zoom in={isModalOpen}>
                <ModalContent>
                    <ModalContentHeader>
                        <ModalContentHeading variant="h6" color="primary">
                            Module Editor
                        </ModalContentHeading>
                        <Tooltip title="Close">
                            <IconButtonOutlined onClick={handleClose}>
                                <CloseIcon />
                            </IconButtonOutlined>
                        </Tooltip>
                    </ModalContentHeader>
                    <ModalContentBody>
                        <TextField
                            variant="outlined"
                            label="File Name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            fullWidth
                        />
                    </ModalContentBody>
                    <ModalContentFooter>
                        <Stack spacing={1} direction="row-reverse">
                            <Tooltip title="Save">
                                <span>
                                    <IconButtonOutlined
                                        onClick={handleCreate}
                                        disabled={
                                            isLoading ||
                                            !fileName ||
                                            selected.fileName === fileName
                                        }
                                    >
                                        <SaveIcon />
                                    </IconButtonOutlined>
                                </span>
                            </Tooltip>
                            <Tooltip title="Reset">
                                <IconButtonOutlined onClick={handleReset}>
                                    <ResetIcon />
                                </IconButtonOutlined>
                            </Tooltip>
                        </Stack>
                    </ModalContentFooter>
                </ModalContent>
            </Zoom>
        </Modal>
    );
}
