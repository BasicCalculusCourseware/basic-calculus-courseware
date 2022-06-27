// TYPES
import type { Worksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import { initialStates } from 'src/utils';
// COMPONENTS
import WorksheetSubmitterPanel from './WorksheetSubmitterPanel';

// MAIN-COMPONENT
export default WorksheetSubmitterPanel;

/* STATES START */

// ATOMS
const worksheet = atom<Worksheet>({
    key: 'worksheetSubmitterPanelWorksheet' + Date.now(),
    default: initialStates.worksheet,
});
const modals = atom<{ submitter: boolean; unsubmitter: boolean }>({
    key: 'worksheetSubmitterPanelModals' + Date.now(),
    default: {
        submitter: false,
        unsubmitter: false,
    },
});
export const worksheetSubmitterPanelAtoms = { worksheet, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(worksheetSubmitterPanelAtoms.modals);
    return (data: Partial<{ submitter: boolean; unsubmitter: boolean }>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
