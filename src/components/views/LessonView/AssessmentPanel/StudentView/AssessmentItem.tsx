// TYPES
import type { Assessment, SubmittedAssessment } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
// FUNCTIONS
import { initialStates } from 'src/utils';
import { getSubmittedAssessment } from 'src/firebase/client/utils/submittedAssessment';
// LIB-COMPONENTS
import {
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Zoom,
    Tooltip,
} from '@mui/material';
// COMPONENTS
import {
    MoreVertIcon,
    EditIcon,
    AssessmentIcon,
    AccessInfoIcon,
} from 'src/components/icons';
import SkeletonItem from './SkeletonItem';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { SVAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    assessment: Assessment;
}
export default function AssessmentItem({ assessment }: Props) {
    // RECOIL VALUES
    const user = useRecoilValue(authAtoms.user);
    // RECOIL SETTERS
    const setSelected = useSetRecoilState(SVAtoms.selected);
    const setSelectedSubmitted = useSetRecoilState(SVAtoms.submitted);
    // RECOIL CUSTOM HOOKS
    const setModal = useSetModal();
    // STATES
    const [isLoading, setIsLoading] = useState(true);
    const [submitted, setSubmitted] = useState<SubmittedAssessment>(
        initialStates.submittedAssessment
    );
    // MENU STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // UTILS
    const handleTake = () => {
        setSelected(assessment);
        setModal({ questionnaire: true });
        setAnchorEl(null);
    };
    const handleReview = () => {
        setSelected(assessment);
        setSelectedSubmitted(submitted);
        setModal({ reviewer: true });
        setAnchorEl(null);
    };
    // EFFECTS
    useEffect(() => {
        let isMounted = true;
        (async () => {
            setIsLoading(true);
            const submitted = await getSubmittedAssessment(
                assessment.id,
                user.uid
            );
            if (isMounted) {
                setIsLoading(false);
                submitted && setSubmitted(submitted);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [assessment.id, user.uid]);

    // RENDER
    return isLoading ? (
        <SkeletonItem />
    ) : (
        <Item>
            <ItemBody onClick={submitted.id !== '' ? handleReview : handleTake}>
                <Tooltip title={submitted.id !== '' ? 'Taken' : 'Not Taken'}>
                    <ItemStatus data-is-taken={submitted.id !== ''} />
                </Tooltip>
                <ItemIcon>
                    <AssessmentIcon />
                </ItemIcon>
                <ItemText>{assessment.title}</ItemText>
                <ItemPoints>
                    {submitted.id !== '' ? submitted.score : '?'}/
                    {assessment.items.length}
                </ItemPoints>
            </ItemBody>
            <ItemTool>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    open={open}
                    anchorEl={anchorEl}
                    TransitionComponent={Zoom}
                    onClose={() => setAnchorEl(null)}
                    elevation={0}
                >
                    {submitted.id === '' && (
                        <MenuItem onClick={handleTake}>
                            <EditIcon />
                            Take
                        </MenuItem>
                    )}
                    {submitted.id !== '' && (
                        <MenuItem onClick={handleReview}>
                            <AccessInfoIcon />
                            Review
                        </MenuItem>
                    )}
                </Menu>
            </ItemTool>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Item = styled('div')({
    ...styles.flexStartCenter,
    ...styles.borderBottom(1),
    ...styles.pr(1),
    overflow: 'hidden',
    cursor: 'pointer',
    '&:last-child': {
        border: 'none',
    },
});
const ItemBody = styled('div')({
    ...styles.flexStartCenter,
    ...styles.p(1),
    ...styles.pl(1.5),
    ...styles.pr(0.5),
    flexGrow: 1,
    height: 55,
    overflow: 'hidden',
    cursor: 'pointer',
});
const ItemStatus = styled('div')(({ theme }) => ({
    ...styles.border(1),
    ...styles.borderRadius(100),
    ...styles.mr(1),
    minWidth: 10,
    minHeight: 10,
    '&[data-is-taken="true"]': {
        backgroundColor: theme.palette.success.main,
    },
    '&[data-is-taken="false"]': {
        backgroundColor: theme.palette.error.main,
    },
}));
const ItemIcon = styled('div')({
    ...styles.flexCenter,
    ...styles.mr(1),
});
const ItemText = styled(Typography)({
    flexGrow: 1,
    fontSize: 13,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
});
const ItemPoints = styled(Typography)(({ theme }) => ({
    ...styles.mx(0.5),
    fontSize: 10,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    color: theme.palette.primary.main,
}));
const ItemTool = styled('div')({});
