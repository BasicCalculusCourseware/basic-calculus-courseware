// LIB-COMPONENTS
import { Fab, Tooltip } from '@mui/material';
// COMPONENT
import { AddIcon } from 'src/components/icons';
// RECOIL
import { useSetModal } from '.';

// MAIN-COMPONENT
export default function LessonCreatorFab() {
    // RECOIL
    const setModal = useSetModal();
    // RENDER
    return (
        <Tooltip title="Create Lesson">
            <CreatorFab color="primary" onClick={() => setModal({ creator: true })}>
                <AddIcon />
            </CreatorFab>
        </Tooltip>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const CreatorFab = styled(Fab)({
    position: 'fixed',
    bottom: styles.spacing(3),
    right: styles.spacing(3),
});
