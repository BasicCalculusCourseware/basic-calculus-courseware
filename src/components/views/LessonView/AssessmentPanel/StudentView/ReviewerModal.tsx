// LIB-TYPES
// TYPES
import type { AssessmentItem } from 'src/interfaces';
// LIB-FUNCTIONS
// FUNCTIONS
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
import { SVAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function ReviewerModal() {
    // RECOIL STATES
    const [selected, setSelected] = useRecoilState(SVAtoms.selected);
    const [submitted, setSubmitted] = useRecoilState(SVAtoms.submitted);
    // RECOIL VALUES
    const { reviewer: isModalOpen } = useRecoilValue(SVAtoms.modals);
    // RECOIL CUSTOM HOOKS
    const setModal = useSetModal();
    // UTILS
    const handleClose = () => {
        setSelected(initialStates.assessment);
        setSubmitted(initialStates.submittedAssessment);
        setModal({ reviewer: false });
    };
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
                            {submitted.items.map((item) => (
                                <AssessmentItem key={item.id} {...{ item }} />
                            ))}
                            <Stack direction="row" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    onClick={handleClose}
                                >
                                    Close
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
}
function AssessmentItem({ item }: AIProps) {
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
                            >
                                <Radio
                                    value={choice.id}
                                    color={
                                        item.correctChoice === choice.id
                                            ? 'success'
                                            : 'primary' ||
                                              (item.answer === choice.id &&
                                                  item.answer !==
                                                      item.correctChoice)
                                            ? 'error'
                                            : 'primary'
                                    }
                                    checked={
                                        item.answer === choice.id ||
                                        item.correctChoice === choice.id
                                    }
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
