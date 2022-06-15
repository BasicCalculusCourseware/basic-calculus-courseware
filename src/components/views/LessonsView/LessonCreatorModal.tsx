// LIB-FUNCTIONS
import { useState } from 'react';
// FUNCTIONS
import { createLesson } from 'src/firebase/client/utils/lesson';
import { contentColorItems } from 'src/utils';
// LIB-COMPONENTS
import {
    Grid,
    TextField,
    Modal,
    Zoom,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Tooltip,
} from '@mui/material';
// COMPONENTS
import {
    ModalContent,
    ModalContentHeader,
    ModalContentHeading,
    ModalContentBody,
    ModalContentFooter,
    IconButtonOutlined,
    ColorBox,
} from 'src/components/styled';
import { ResetIcon, SaveIcon, CloseIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { lessonsViewAtoms, useSetModal, useRefreshLessons } from '.';
import { useAddSnackbarItem } from 'src/states/snackbar';

// MAIN-COMPONENT
export default function LessonCreatorModal() {
    // RECOIL
    const { creator: isModalOpen } = useRecoilValue(lessonsViewAtoms.modals);
    const quarter = useRecoilValue(lessonsViewAtoms.quarter);
    const setModal = useSetModal();
    const refreshLessons = useRefreshLessons();
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        number: '',
        title: '',
        intro: '',
        color: 'white',
    });
    // UTILS
    const handleClose = () => {
        !isLoading && setModal({ creator: false });
        handleReset();
    };
    const handleReset = () =>
        setForm({
            number: '',
            title: '',
            intro: '',
            color: 'white',
        });
    const handleCreate = async () => {
        try {
            if (Object.values(form).some((v) => !v)) throw 'Incomplete fields';
            addSnackbarItem('info', 'Creating Lesson');
            setIsLoading(true);
            await createLesson({ ...form, quarterId: quarter.id });
            await refreshLessons();
            addSnackbarItem('success', 'Lesson created successfully');
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
                            Lesson Creator
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
                                    label="Lesson Number"
                                    placeholder="Lesson #"
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
                                    label="Lesson Title"
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
                                    label="Lesson Introduction"
                                    value={form.intro}
                                    onChange={(e) =>
                                        setForm((form) => ({
                                            ...form,
                                            intro: e.target.value,
                                        }))
                                    }
                                    multiline
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Color</InputLabel>
                                    <Select
                                        label="Color"
                                        value={form.color}
                                        onChange={(e) =>
                                            setForm((form) => ({
                                                ...form,
                                                color: e.target.value,
                                            }))
                                        }
                                    >
                                        {contentColorItems.map((color, index) => (
                                            <MenuItem key={index} value={color.value}>
                                                <Stack direction="row">
                                                    <ColorBox
                                                        sx={{ bgcolor: color.hex, mr: 1 }}
                                                    />
                                                    {color.label}
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </ModalContentBody>
                    <ModalContentFooter>
                        <Stack spacing={1} direction="row-reverse">
                            <Tooltip title="Create">
                                <IconButtonOutlined
                                    onClick={handleCreate}
                                    disabled={isLoading}
                                >
                                    <SaveIcon />
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
