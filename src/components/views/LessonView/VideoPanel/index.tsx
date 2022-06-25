// TYPES
import type { Video, Modals } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import VideoPanel from './VideoPanel';

// MAIN-COMPONENTS
export default VideoPanel;

/* STATES START */

// ATOMS
const selected = atom<Video>({
    key: 'selected' + Date.now(),
    default: initialStates.video,
});
const modals = atom<Modals>({
    key: 'modals' + Date.now(),
    default: initialStates.modals,
});
export const videoPanelAtoms = { selected, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(videoPanelAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
