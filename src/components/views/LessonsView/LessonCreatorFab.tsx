// LIB-COMPONENTS
import { Tooltip } from '@mui/material';
// COMPONENT
import { CreatorFab } from 'src/components/styled';
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
