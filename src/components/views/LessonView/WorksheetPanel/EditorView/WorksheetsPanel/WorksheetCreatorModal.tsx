// LIB-TYPES
import type { ChangeEvent } from 'react';
// LIB-FUNCTIONS
import { useState, useRef } from 'react';
// FUNCTIONS
import { createWorksheet } from 'src/firebase/client/utils/worksheet';
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
import { useAddSnackbarItem } from 'src/states/snackbar';
import { lessonViewAtoms, useRefreshWorksheets } from '../../..';
import { worksheetsPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function WorksheetCreatorModal() {
    // RECOIL
    const { creator: isModalOpen } = useRecoilValue(
        worksheetsPanelAtoms.modals
    );
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const setModal = useSetModal();
    const refreshWorksheets = useRefreshWorksheets();
    const addSnackbarItem = useAddSnackbarItem();
    // REFS
    const fileInputer = useRef<HTMLInputElement>(null);
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [points, setPoints] = useState(0);
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
        setPoints(0);
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
            addSnackbarItem('info', 'Creating Worksheet');
            setIsLoading(true);
            await createWorksheet(quarter.id, lesson.id, {
                points,
                fileName,
                fileExtension,
                file,
            });
            await refreshWorksheets();
            addSnackbarItem('success', 'Worksheet created successfully');
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
                            Worksheet Creator
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    label="File Name"
                                    value={fileName}
                                    onChange={(e) =>
                                        setFileName(e.target.value)
                                    }
                                    disabled={!file}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    label="Points"
                                    value={points}
                                    onChange={(e) => {
                                        let points = 0;
                                        let value = parseInt(e.target.value);
                                        if (value < 0) points = 0;
                                        else if (value > 100) points = 100;
                                        else points = value;
                                        setPoints(points);
                                    }}
                                    disabled={!file}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </ModalContentBody>
                    <ModalContentFooter>
                        <Stack spacing={1} direction="row-reverse">
                            <Tooltip title="Create">
                                <span>
                                    <IconButtonOutlined
                                        onClick={handleCreate}
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
