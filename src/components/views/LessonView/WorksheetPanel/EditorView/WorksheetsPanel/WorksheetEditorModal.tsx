// LIB-FUNCTIONS
import { useState, useCallback, useEffect, useMemo } from 'react';
// FUNCTIONS
import { updateWorksheet } from 'src/firebase/client/utils/worksheet';
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
import { ResetIcon, SaveIcon, CloseIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useRefreshWorksheets } from '../../..';
import { worksheetsPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function WorksheetCreatorModal() {
    // RECOIL
    const { editor: isModalOpen } = useRecoilValue(worksheetsPanelAtoms.modals);
    const selected = useRecoilValue(worksheetsPanelAtoms.selected);
    const setModal = useSetModal();
    const refreshWorksheets = useRefreshWorksheets();
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [points, setPoints] = useState(0);
    const [fileName, setFileName] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const isChanged = useMemo(() => {
        const entry = { fileName: `${fileName}.${fileExtension}`, points };
        return Object.keys(entry).some((key) => {
            // @ts-ignore
            return entry[key] !== selected[key];
        });
    }, [selected, fileName, fileExtension, points]);
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ editor: false });
        handleReset();
    };
    const handleReset = useCallback(() => {
        const fnmap = selected.fileName.split('.');
        const fileExtension = fnmap.pop() || '';
        const fileName = fnmap.join('.');
        setFileName(fileName);
        setFileExtension(fileExtension);
        setPoints(selected.points);
    }, [selected]);
    const handleSave = async () => {
        try {
            if (!fileName) throw 'Incomplete fields';
            addSnackbarItem('info', 'Editing Worksheet');
            setIsLoading(true);
            await updateWorksheet(selected.id, {
                points,
                fileName: `${fileName}.${fileExtension}`,
            });
            await refreshWorksheets();
            addSnackbarItem('success', 'Worksheet edited successfully');
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
                            Worksheet Editor
                        </ModalContentHeading>
                        <Tooltip title="Close">
                            <IconButtonOutlined onClick={handleClose}>
                                <CloseIcon />
                            </IconButtonOutlined>
                        </Tooltip>
                    </ModalContentHeader>
                    <ModalContentBody>
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
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </ModalContentBody>
                    <ModalContentFooter>
                        <Stack spacing={1} direction="row-reverse">
                            <Tooltip title="Save">
                                <span>
                                    <IconButtonOutlined
                                        onClick={handleSave}
                                        disabled={
                                            isLoading || !fileName || !isChanged
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
