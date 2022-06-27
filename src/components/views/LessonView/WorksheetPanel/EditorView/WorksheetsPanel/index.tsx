// TYPES
import type { Worksheet, Modals } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState, useResetRecoilState } from 'recoil';
// FUNCTIONS
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import WorksheetsPanel from './WorksheetsPanel';

// MAIN-COMPONENTS
export default WorksheetsPanel;

/* STATES START */

// ATOMS
const selected = atom<Worksheet>({
    key: 'worksheetsPanelSelected' + Date.now(),
    default: initialStates.worksheet,
});
const modals = atom<Modals>({
    key: 'worksheetsPanelModals' + Date.now(),
    default: initialStates.modals,
});
export const WPAtoms = { selected, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(WPAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};
export const useResetData = () => {
    const resetSelected = useResetRecoilState(WPAtoms.selected);
    const resetModals = useResetRecoilState(WPAtoms.modals);
    return () => {
        resetSelected();
        resetModals();
    };
};

/* STATES END */
