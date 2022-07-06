// LIB-FUNCTIONS
import { useState, useMemo } from 'react';
// FUNCTIONS
import { createAssessment } from 'src/firebase/client/utils/assessment';
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
import { lessonViewAtoms, useRefreshAssessments } from '../../..';
import { ATAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function AsssessmentCreatorModal() {
    // RECOIL VALUES
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const { creator: isModalOpen } = useRecoilValue(ATAtoms.modals);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    const refreshAssessments = useRefreshAssessments();
    const setModal = useSetModal();
    // STATES
    const [form, setForm] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const isCompleted = useMemo(
        () =>
            Object.keys(form).every((key) => {
                // @ts-ignore
                return form[key] !== '';
            }),
        [form]
    );
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ creator: false });
        handleReset();
    };
    const handleReset = () => setForm({ title: '', description: '' });
    const handleCreate = async () => {
        try {
            if (Object.values(form).some((v) => !v)) throw 'Incomplete fields';
            addSnackbarItem('info', 'Creating Assessment');
            setIsLoading(true);
            await createAssessment({
                ...form,
                quarterId: quarter.id,
                lessonId: lesson.id,
            });
            await refreshAssessments();
            addSnackbarItem('success', 'Assessment created successfully');
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
                            Assessment Creator
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
                                    label="Title"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((form) => ({
                                            ...form,
                                            title: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    label="Description"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((form) => ({
                                            ...form,
                                            description: e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    multiline
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
                                        disabled={isLoading || !isCompleted}
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
