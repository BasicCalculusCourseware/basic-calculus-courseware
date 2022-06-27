// TYPES
import type { Worksheet, Modals } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
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
export const worksheetsPanelAtoms = { selected, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(worksheetsPanelAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
