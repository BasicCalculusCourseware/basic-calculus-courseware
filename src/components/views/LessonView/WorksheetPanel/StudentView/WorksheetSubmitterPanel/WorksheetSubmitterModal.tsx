// LIB-TYPES
import type { ChangeEvent } from 'react';
// LIB-FUNCTIONS
import { useState, useRef } from 'react';
// FUNCTIONS
import { submitWorksheet } from 'src/firebase/client/utils/submitedWorksheet';
import { getFileExtension } from 'src/utils';
// LIB-COMPONENTS
import { TextField, Modal, Zoom, Stack, Tooltip, Grid } from '@mui/material';
// COMPONENTS
import {
    ModalContent,
    ModalContentHeader,
    ModalContentHeading,
    ModalContentBody,
    ModalContentFooter,
    IconButtonOutlined,
} from 'src/components/styled';
import {
    ResetIcon,
    SaveIcon,
    CloseIcon,
    UploadIcon,
} from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { WSPAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    fetchData: () => Promise<void>;
}
export default function WorksheetSubmitterModal({ fetchData }: Props) {
    // RECOIL VALUES
    const user = useRecoilValue(authAtoms.user);
    const { submitter: isModalOpen } = useRecoilValue(WSPAtoms.modals);
    const worksheet = useRecoilValue(WSPAtoms.worksheet);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    const setModal = useSetModal();
    // REFS
    const fileInputer = useRef<HTMLInputElement>(null);
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('No file selected');
    const [fileExtension, setFileExtension] = useState('');
    const [file, setFile] = useState<File | null>(null);
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ submitter: false });
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
        if (getFileExtension(file.name) !== 'pdf')
            addSnackbarItem('error', 'File type is not allowed');
        const fileNameMap = file.name.split('.');
        const fileExtension = fileNameMap.pop() || '';
        const fileName = fileNameMap.join('.');
        setFile(file);
        setFileName(fileName);
        setFileExtension(fileExtension);
    };
    const handleSubmit = async () => {
        try {
            if (!fileName || !file) throw 'Incomplete fields';
            addSnackbarItem('info', 'Submitting Worksheet');
            setIsLoading(true);
            await submitWorksheet(worksheet.id, file, {
                uid: user.uid,
                fileName: `${fileName}.${fileExtension}`,
            });
            await fetchData();
            addSnackbarItem('success', 'Worksheet submitted successfully');
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
                            Worksheet Submitter
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
                            accept=".pdf"
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
                            <Tooltip title="Submit">
                                <span>
                                    <IconButtonOutlined
                                        onClick={handleSubmit}
                                        disabled={
                                            isLoading || !fileName || !file
                                        }
                                    >
                                        <SaveIcon />
                                    </IconButtonOutlined>
                                </span>
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
