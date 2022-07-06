// TYPES
import type { Assessment } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState } from 'react';
// LIB-COMPONENTS
import { Typography, IconButton, Menu, MenuItem, Zoom } from '@mui/material';
// COMPONENTS
import {
    MoreVertIcon,
    EditIcon,
    DeleteIcon,
    AssessmentIcon,
} from 'src/components/icons';
// RECOIL
import { useSetRecoilState } from 'recoil';
import { EVAtoms } from '..';
import { STAtoms } from '../SubmittedTab';
import { ATAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    assessment: Assessment;
}
export default function AssessmentItem({ assessment }: Props) {
    // RECOIL SETTERS
    const setTab = useSetRecoilState(EVAtoms.tab);
    const setAssessment = useSetRecoilState(STAtoms.assessment);
    const setSelected = useSetRecoilState(ATAtoms.selected);
    // RECOIL CUSTOM HOOKS
    const setModal = useSetModal();
    // MENU STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // RENDER
    return (
        <Item>
            <ItemBody
                onClick={() => {
                    setTab(1);
                    setAssessment(assessment);
                }}
            >
                <ItemIcon>
                    <AssessmentIcon />
                </ItemIcon>
                <ItemText>{assessment.title}</ItemText>
                <ItemPoints>
                    {assessment.items.length} Point
                    {assessment.items.length !== 1 && 's'}
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
                    <MenuItem
                        onClick={() => {
                            setSelected(assessment);
                            setModal({ editor: true });
                            setAnchorEl(null);
                        }}
                    >
                        <EditIcon />
                        Edit
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setSelected(assessment);
                            setModal({ deleter: true });
                            setAnchorEl(null);
                        }}
                    >
                        <DeleteIcon />
                        Delete
                    </MenuItem>
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
