// LIB-TYPES
import { Dispatch, SetStateAction } from 'react';
// TYPES
import type { AssessmentItem } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
// FUNCTIONS
import {
    updateAssessment,
    uploadAssessmentItemImage,
    deleteAssessmentItemImage,
} from 'src/firebase/client/utils/assessment';
import { initialStates } from 'src/utils';
// LIB-COMPONENTS
import {
    Container,
    TextField,
    Modal,
    Zoom,
    Stack,
    Tooltip,
    Fab,
    Radio,
    IconButton,
} from '@mui/material';
// COMPONENTS
import {
    SaveIcon,
    BackIcon,
    AddIcon,
    ImageIcon,
    DeleteIcon,
    UpIcon,
    DownIcon,
    CloseIcon,
    RemoveImageIcon,
} from 'src/components/icons';
import { IconButtonOutlined } from 'src/components/styled';
// RECOIL
import { useRecoilValue, useRecoilState } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useRefreshAssessments } from '../../..';
import { ATAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function AsssessmentEditorModal() {
    // RECOIL VALUES
    const { editor: isModalOpen } = useRecoilValue(ATAtoms.modals);
    const [selected, setSelected] = useRecoilState(ATAtoms.selected);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    const refreshAssessments = useRefreshAssessments();
    const setModal = useSetModal();
    // STATES
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState<AssessmentItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // UTILS
    const addItem = () => {
        const choiceId = Date.now().toString();
        const item = {
            ...initialStates.assessmentItem,
            id: Date.now().toString(),
            choices: [{ id: choiceId, label: '' }],
            correctChoice: choiceId,
        } as AssessmentItem;
        setItems((items) => [...items, item]);
    };
    const handleClose = () => {
        setSelected(initialStates.assessment);
        !isLoading && setModal({ editor: false });
    };
    const handleSave = async () => {
        try {
            addSnackbarItem('info', 'Editing Assessment');
            setIsLoading(true);
            await updateAssessment(selected.id, { title, description, items });
            await refreshAssessments();
            addSnackbarItem('success', 'Assessment edited successfully');
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
        setTitle(selected.title);
        setDescription(selected.description);
        setItems(selected.items);
    }, [selected]);
    // RENDER
    return (
        <Modal open={isModalOpen}>
            <Zoom in={isModalOpen}>
                <MainContainer>
                    <Container maxWidth="md">
                        <Stack spacing={2}>
                            <HeaderItem>
                                <Stack spacing={2}>
                                    <TextField
                                        variant="standard"
                                        label="Title"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        variant="standard"
                                        label="Description"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        fullWidth
                                        multiline
                                    />
                                </Stack>
                            </HeaderItem>
                            {items.map((item, index) => (
                                <AssessmentItem
                                    key={item.id}
                                    {...{ index, item, items, setItems }}
                                />
                            ))}
                        </Stack>
                    </Container>
                    {/* TOOLS */}
                    <Tooltip title="Save">
                        <FabContainer sx={{ bottom: 24, right: 24 }}>
                            <Fab
                                color="primary"
                                disabled={isLoading || !title || !description}
                                onClick={handleSave}
                                data-translucent
                            >
                                <SaveIcon />
                            </Fab>
                        </FabContainer>
                    </Tooltip>
                    <Tooltip title="Add Item">
                        <FabContainer sx={{ right: 88, bottom: 24 }}>
                            <Fab
                                color="primary"
                                disabled={isLoading}
                                onClick={addItem}
                                data-translucent
                            >
                                <AddIcon />
                            </Fab>
                        </FabContainer>
                    </Tooltip>
                    <Tooltip title="Back">
                        <FabContainer sx={{ right: 152, bottom: 24 }}>
                            <Fab
                                color="primary"
                                disabled={isLoading}
                                onClick={handleClose}
                                data-translucent
                            >
                                <BackIcon />
                            </Fab>
                        </FabContainer>
                    </Tooltip>
                </MainContainer>
            </Zoom>
        </Modal>
    );
}

// SUB-COMPONENT
interface AIProps {
    index: number;
    item: AssessmentItem;
    items: AssessmentItem[];
    setItems: Dispatch<SetStateAction<AssessmentItem[]>>;
}
function AssessmentItem({ index, item, items, setItems }: AIProps) {
    // HELPERS
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    // UTILS
    const setQuestion = (question: string) => {
        setItems((items) =>
            items.map((value) =>
                value.id === item.id ? { ...item, question } : value
            )
        );
    };
    const deleteItem = () => {
        setItems((items) => items.filter((value) => value.id !== item.id));
    };
    const moveItemUp = () => {
        if (index > 0) {
            const filtered = items.filter((value) => value.id !== item.id);
            filtered.splice(index - 1, 0, item);
            setItems(filtered);
        }
    };
    const moveItemDown = () => {
        if (index < items.length) {
            const filtered = items.filter((value) => value.id !== item.id);
            filtered.splice(index + 1, 0, item);
            setItems(filtered);
        }
    };
    const addChoice = () => {
        const choiceId = Date.now().toString();
        setItems((items) =>
            items.map((value) =>
                value.id === item.id
                    ? {
                          ...value,
                          choices: [
                              ...value.choices,
                              { id: choiceId, label: '' },
                          ],
                          correctChoice: value.correctChoice || choiceId,
                      }
                    : value
            )
        );
    };
    const setCorrectChoice = (choiceId: string) => {
        setItems((items) =>
            items.map((value) =>
                value.id === item.id
                    ? { ...value, correctChoice: choiceId }
                    : value
            )
        );
    };
    const editChoiceLabel = (choiceId: string, label: string) => {
        setItems((items) =>
            items.map((value) =>
                value.id === item.id
                    ? {
                          ...value,
                          choices: value.choices.map((choice) =>
                              choice.id === choiceId
                                  ? { ...choice, label }
                                  : choice
                          ),
                      }
                    : value
            )
        );
    };
    const deleteChoice = (choiceId: string) => {
        setItems((items) =>
            items.map((value) =>
                value.id === item.id
                    ? {
                          ...value,
                          choices: value.choices.filter(
                              (choice) => choice.id !== choiceId
                          ),
                      }
                    : value
            )
        );
    };
    const insertImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.setAttribute('hidden', 'true');
        document.body.appendChild(input);
        input.addEventListener('change', async (e: any) => {
            if (!e.target.files.length) return;
            const file = e.target.files[0] as File;
            setIsLoading(true);
            const image = await uploadAssessmentItemImage(item.id, file);
            if (isMounted.current) {
                setItems((items) =>
                    items.map((value) =>
                        value.id === item.id ? { ...value, image } : value
                    )
                );
                setIsLoading(false);
            }
        });
        input.click();
    };
    const removeImage = async () => {
        setIsLoading(true);
        await deleteAssessmentItemImage(item.id);
        setItems((items) =>
            items.map((value) =>
                value.id === item.id ? { ...value, image: '' } : value
            )
        );
        setIsLoading(false);
    };
    // RENDER
    return (
        <Item>
            <ItemHeader spacing={2} direction="row">
                <TextField
                    variant="standard"
                    placeholder="Question"
                    value={item.question}
                    onChange={(e) => setQuestion(e.target.value)}
                    fullWidth
                />
                <Tooltip
                    title={item.image ? 'Remove Image' : 'Insert Image'}
                    placement="top"
                >
                    <span>
                        <IconButtonOutlined
                            onClick={item.image ? removeImage : insertImage}
                            disabled={isLoading}
                        >
                            {item.image ? <RemoveImageIcon /> : <ImageIcon />}
                        </IconButtonOutlined>
                    </span>
                </Tooltip>
                <Tooltip title="Add Choice" placement="top">
                    <IconButtonOutlined onClick={addChoice}>
                        <AddIcon />
                    </IconButtonOutlined>
                </Tooltip>
            </ItemHeader>
            <ItemBody>
                <Stack spacing={2}>
                    {item.image && (
                        <ItemImage
                            sx={{ backgroundImage: `url(${item.image})` }}
                        />
                    )}
                    <Stack spacing={2}>
                        {item.choices.map((choice, cindex) => (
                            <Stack
                                key={choice.id}
                                spacing={2}
                                direction="row"
                                alignItems="center"
                            >
                                <Radio
                                    value={choice.id}
                                    checked={item.correctChoice === choice.id}
                                    onClick={() => setCorrectChoice(choice.id)}
                                />
                                <TextField
                                    variant="standard"
                                    label={'Option ' + (cindex + 1)}
                                    value={choice.label}
                                    onChange={(e) =>
                                        editChoiceLabel(
                                            choice.id,
                                            e.target.value
                                        )
                                    }
                                    fullWidth
                                />
                                <Tooltip title="Delete" placement="left">
                                    <IconButton
                                        onClick={() => deleteChoice(choice.id)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </ItemBody>
            <ItemFooter spacing={1} direction="row-reverse">
                <Tooltip title="Delete Item">
                    <IconButtonOutlined onClick={deleteItem}>
                        <DeleteIcon />
                    </IconButtonOutlined>
                </Tooltip>
                {index - 1 >= 0 && (
                    <Tooltip title="Move Up">
                        <IconButtonOutlined onClick={moveItemUp}>
                            <UpIcon />
                        </IconButtonOutlined>
                    </Tooltip>
                )}
                {index + 1 !== items.length && (
                    <Tooltip title="Move Down" onClick={moveItemDown}>
                        <IconButtonOutlined>
                            <DownIcon />
                        </IconButtonOutlined>
                    </Tooltip>
                )}
            </ItemFooter>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const MainContainer = styled('div')(({ theme }) => ({
    ...styles.p(2),
    ...styles.pb(12),
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    backgroundColor: styles.bgColor,
    backgroundImage: styles.bgPattern,
    overflowY: 'auto',
    [theme.breakpoints.down('md')]: {
        ...styles.px(0),
    },
}));
const FabContainer = styled('div')({
    position: 'fixed',
    zIndex: 1400,
});
const HeaderItem = styled('div')(({ theme }) => ({
    ...styles.border(1),
    ...styles.borderRadius(1),
    ...styles.px(2),
    ...styles.py(3),
    backgroundColor: 'white',
    borderTop: '10px solid' + theme.palette.primary.main,
}));
const Item = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    backgroundColor: 'white',
});
const ItemHeader = styled(Stack)({
    ...styles.p(2),
    ...styles.pb(0),
});
const ItemBody = styled('div')({
    ...styles.p(2),
    ...styles.pb(4),
});
const ItemFooter = styled(Stack)({
    ...styles.borderTop(1),
    ...styles.p(1),
});
const ItemImage = styled('div')({
    width: '100%',
    maxWidth: 400,
    aspectRatio: '1/1',
    margin: 'auto',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
});
