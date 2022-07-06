// LIB-TYPES
import { Dispatch, SetStateAction } from 'react';
// TYPES
import type { AssessmentItem } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect, useMemo } from 'react';
// FUNCTIONS
import { submitAssessment } from 'src/firebase/client/utils/submittedAssessment';
import { initialStates } from 'src/utils';
// LIB-COMPONENTS
import {
    Container,
    TextField,
    Modal,
    Zoom,
    Stack,
    Radio,
    Typography,
    Button,
} from '@mui/material';
// RECOIL
import { useRecoilValue, useRecoilState } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { authAtoms } from 'src/states/auth';
import { useRefreshAssessments } from '../..';
import { SVAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function QuestionnaireModal() {
    // RECOIL STATES
    const [selected, setSelected] = useRecoilState(SVAtoms.selected);
    // RECOIL VALUES
    const user = useRecoilValue(authAtoms.user);
    const { questionnaire: isModalOpen } = useRecoilValue(SVAtoms.modals);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    const refreshAssessments = useRefreshAssessments();
    const setModal = useSetModal();
    // STATES
    const [items, setItems] = useState<AssessmentItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isCompleted = useMemo(
        () => items.every((item) => item.answer !== ''),
        [items]
    );
    // UTILS
    const handleCancel = () => {
        setSelected(initialStates.assessment);
        !isLoading && setModal({ questionnaire: false });
    };
    const handleSave = async () => {
        try {
            addSnackbarItem('info', 'Submitting Assessment');
            setIsLoading(true);
            await submitAssessment({
                assessmentId: selected.id,
                uid: user.uid,
                items,
            });
            await refreshAssessments();
            addSnackbarItem('success', 'Assessment submitted successfully');
            handleCancel();
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // EFFECTS
    useEffect(() => {
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
                                        value={selected.title}
                                        fullWidth
                                    />
                                    <TextField
                                        variant="standard"
                                        label="Description"
                                        value={selected.description}
                                        fullWidth
                                        multiline
                                    />
                                </Stack>
                            </HeaderItem>
                            {items.map((item) => (
                                <AssessmentItem
                                    key={item.id}
                                    {...{ item, setItems }}
                                />
                            ))}
                            <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="flex-end"
                            >
                                <Button
                                    color="secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={!isCompleted}
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </Stack>
                    </Container>
                </MainContainer>
            </Zoom>
        </Modal>
    );
}

// SUB-COMPONENT
interface AIProps {
    item: AssessmentItem;
    setItems: Dispatch<SetStateAction<AssessmentItem[]>>;
}
function AssessmentItem({ item, setItems }: AIProps) {
    // UTILS
    const setAnswer = (choiceId: string) => {
        setItems((items) =>
            items.map((value) =>
                value.id === item.id ? { ...value, answer: choiceId } : value
            )
        );
    };
    // RENDER
    return (
        <Item>
            <ItemHeader spacing={2} direction="row">
                <Typography>{item.question}</Typography>
            </ItemHeader>
            <ItemBody>
                <Stack spacing={2}>
                    {item.image && (
                        <ItemImage
                            sx={{ backgroundImage: `url(${item.image})` }}
                        />
                    )}
                    <Stack>
                        {item.choices.map((choice) => (
                            <Stack
                                key={choice.id}
                                direction="row"
                                alignItems="center"
                                onClick={() => setAnswer(choice.id)}
                            >
                                <Radio
                                    value={choice.id}
                                    checked={item.answer === choice.id}
                                    onClick={() => setAnswer(choice.id)}
                                />
                                <Typography>
                                    {choice.label || 'No Label'}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </ItemBody>
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
const ItemImage = styled('div')({
    width: '100%',
    maxWidth: 400,
    aspectRatio: '1/1',
    margin: 'auto',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
});
