// LIB-FUNCTIONS
import { useState, useEffect, useMemo } from 'react';
// FUNCTIONS
import { updateVideo } from 'src/firebase/client/utils/video';
// LIB-COMPONENTS
import { Grid, TextField, Modal, Zoom, Stack, Tooltip } from '@mui/material';
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
import { useRefreshVideos } from '../.';
import { videoPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function VideoEditorModal() {
    // RECOIL
    const { editor: isModalOpen } = useRecoilValue(videoPanelAtoms.modals);
    const selected = useRecoilValue(videoPanelAtoms.selected);
    const setModal = useSetModal();
    const refreshVideos = useRefreshVideos();
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        number: selected.number,
        src: selected.src,
    });
    const isChanged = useMemo(
        () =>
            Object.keys(form).some((key) => {
                // @ts-ignore
                return form[key] !== selected[key];
            }),
        [form, selected]
    );
    // EFFECTS
    useEffect(() => {
        setForm({ number: selected.number, src: selected.src });
    }, [selected]);
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ editor: false });
        handleReset();
    };
    const handleReset = () =>
        setForm({ number: selected.number, src: selected.src });
    const handleCreate = async () => {
        try {
            if (Object.values(form).some((v) => !v)) throw 'Incomplete fields';
            addSnackbarItem('info', 'Editing Video');
            setIsLoading(true);
            await updateVideo(selected.id, form);
            await refreshVideos();
            addSnackbarItem('success', 'Video edited successfully');
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
                            Video Editor
                        </ModalContentHeading>
                        <Tooltip title="Close">
                            <IconButtonOutlined onClick={handleClose}>
                                <CloseIcon />
                            </IconButtonOutlined>
                        </Tooltip>
                    </ModalContentHeader>
                    <ModalContentBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    label="Part Number"
                                    placeholder="Part #"
                                    value={form.number}
                                    onChange={(e) =>
                                        setForm((form) => ({
                                            ...form,
                                            number: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    label="Video Source"
                                    placeholder="https://drive.google.com/file/d/[id]/preview"
                                    value={form.src}
                                    onChange={(e) =>
                                        setForm((form) => ({
                                            ...form,
                                            src: e.target.value,
                                        }))
                                    }
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
                                        disabled={isLoading || !isChanged}
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
