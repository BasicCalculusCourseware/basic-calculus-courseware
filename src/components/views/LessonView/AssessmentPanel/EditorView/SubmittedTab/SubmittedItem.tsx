// TYPES
import type { Assessment, SubmittedAssessment, User } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
// FUNCTIONS
import { initialStates } from 'src/utils';
import { getUser, doesUserExists } from 'src/firebase/client/utils/user';
import { deleteSubmittedAssessment } from 'src/firebase/client/utils/submittedAssessment';
// LIB-COMPONENTS
import {
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Zoom,
    Avatar,
} from '@mui/material';
// COMPONENTS
import { MoreVertIcon, DeleteIcon, AccessInfoIcon } from 'src/components/icons';
import SkeletonItem from './SkeletonItem';
// RECOIL
import { useSetRecoilState } from 'recoil';
import { STAtoms, useSetModal, useFetchData } from '.';

// MAIN-COMPONENT
interface Props {
    assessment: Assessment;
    sassessment: SubmittedAssessment;
}
export default function SubmittedItem({ assessment, sassessment }: Props) {
    // RECOIL SETTERS
    const setAssessment = useSetRecoilState(STAtoms.assessment);
    const setSelected = useSetRecoilState(STAtoms.selected);
    // RECOIL CUSTOM HOOKS
    const setModal = useSetModal();
    const fetchData = useFetchData();
    // STATES
    const [user, setUser] = useState<User>(initialStates.user);
    const [isLoading, setIsLoading] = useState(true);
    // MENU
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // UTILS
    const handleView = () => {
        setAssessment(assessment);
        setSelected(sassessment);
        setModal({ viewer: true });
    };
    const handleDelete = () => {
        setAnchorEl(null);
        setSelected(sassessment);
        setModal({ deleter: true });
    };
    // EFFECTS
    useEffect(() => {
        let isMounted = true;
        (async () => {
            if (!sassessment.id) return;
            const isUserExisting = await doesUserExists(sassessment.uid);
            if (isUserExisting) {
                setIsLoading(true);
                const user = await getUser(sassessment.uid);
                if (isMounted) {
                    setIsLoading(false);
                    setUser(user);
                }
            } else {
                await deleteSubmittedAssessment(sassessment.uid, assessment.id);
                await fetchData();
            }
        })();
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sassessment, assessment]);
    // RENDER
    return isLoading ? (
        <SkeletonItem />
    ) : (
        <>
            <Item>
                <ItemBody onClick={handleView}>
                    <ItemAvatar src={user.photoUrl} />
                    <ItemText>{user.name}</ItemText>
                    <ItemPoints>
                        {sassessment.score}/{assessment.items.length}
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
                        <MenuItem onClick={handleDelete}>
                            <DeleteIcon />
                            Delete
                        </MenuItem>
                        <MenuItem onClick={handleView}>
                            <AccessInfoIcon />
                            View
                        </MenuItem>
                    </Menu>
                </ItemTool>
            </Item>
        </>
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
const ItemAvatar = styled(Avatar)({
    ...styles.border(1),
    ...styles.mr(1),
    ...styles.box(40),
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
