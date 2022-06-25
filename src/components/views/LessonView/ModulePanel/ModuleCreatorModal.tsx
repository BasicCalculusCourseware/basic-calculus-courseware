// LIB-TYPES
import type { ChangeEvent } from 'react';
// LIB-FUNCTIONS
import { useState, useRef } from 'react';
// FUNCTIONS
import { createModule } from 'src/firebase/client/utils/module';
import { getFileExtension } from 'src/utils';
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
import { ResetIcon, SaveIcon, CloseIcon, UploadIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { lessonViewAtoms, useRefreshModules } from '../.';
import { modulePanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function ModuleCreatorModal() {
    // RECOIL
    const { creator: isModalOpen } = useRecoilValue(modulePanelAtoms.modals);
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const setModal = useSetModal();
    const refreshModules = useRefreshModules();
    const addSnackbarItem = useAddSnackbarItem();
    // REFS
    const fileInputer = useRef<HTMLInputElement>(null);
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('No file selected');
    const [fileExtension, setFileExtension] = useState('');
    const [file, setFile] = useState<File | null>(null);
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ creator: false });
        handleReset();
    };
    const handleReset = () => {
        if (fileInputer.current) fileInputer.current.value = '';
        setFileName('No file selected');
        setFile(null);
    };
    const handleSelect = () => fileInputer.current?.click();
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!event.target.files) return;
        const file = event.target.files[0] as File;
        if (!['pdf', 'docx', 'pptx'].includes(getFileExtension(file.name)))
            addSnackbarItem('error', 'File type is not allowed');
        const fileNameMap = file.name.split('.');
        const fileExtension = fileNameMap.pop() || '';
        const fileName = fileNameMap.join('.');
        setFile(file);
        setFileName(fileName);
        setFileExtension(fileExtension);
    };
    const handleCreate = async () => {
        try {
            if (!fileName || !file) throw 'Incomplete fields';
            addSnackbarItem('info', 'Creating Module');
            setIsLoading(true);
            await createModule(quarter.id, lesson.id, { fileName, fileExtension, file });
            await refreshModules();
            addSnackbarItem('success', 'Module created successfully');
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
                <ModalContent>
                    <ModalContentHeader>
                        <ModalContentHeading variant="h6" color="primary">
                            Module Creator
                        </ModalContentHeading>
                        <Tooltip title="Close">
                            <IconButtonOutlined onClick={handleClose}>
                                <CloseIcon />
                            </IconButtonOutlined>
                        </Tooltip>
                    </ModalContentHeader>
                    <ModalContentBody>
                        {/* INPUT FILE PLACEHOLDER START */}
                        <input
                            ref={fileInputer}
                            type="file"
                            accept=".pdf, .docx, .pptx"
                            onChange={handleChange}
                            hidden
                        />
                        {/* INPUT FILE PLACEHOLDER END */}
                        <TextField
                            variant="outlined"
                            label="File Name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            disabled={!file}
                            fullWidth
                        />
                    </ModalContentBody>
                    <ModalContentFooter>
                        <Stack spacing={1} direction="row-reverse">
                            <Tooltip title="Create">
                                <IconButtonOutlined
                                    onClick={handleCreate}
                                    disabled={isLoading || !fileName || !file}
                                >
                                    <SaveIcon />
                                </IconButtonOutlined>
                            </Tooltip>
                            <Tooltip title="Upload">
                                <IconButtonOutlined onClick={handleSelect}>
                                    <UploadIcon />
                                </IconButtonOutlined>
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
