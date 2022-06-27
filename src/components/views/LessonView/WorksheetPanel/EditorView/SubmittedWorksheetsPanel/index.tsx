// TYPES
import type { SubmittedWorksheet, Worksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import { initialStates } from 'src/utils';
// COMPONENTS
import SubmittedWorksheetsPanel from './SubmittedWorksheetsPanel';

// MAIN-COMPONENT
export default SubmittedWorksheetsPanel;

/* STATES START */

// ATOMS
const worksheet = atom<Worksheet>({
    key: 'submittedWorksheetsPanelWorksheet' + Date.now(),
    default: initialStates.worksheet,
});
const selected = atom<SubmittedWorksheet>({
    key: 'submittedWorksheetsPanelSelected' + Date.now(),
    default: initialStates.submittedWorksheet,
});
const modals = atom<{ deleter: boolean; checker: boolean }>({
    key: 'submittedWorksheetsPanelModals' + Date.now(),
    default: {
        deleter: false,
        checker: false,
    },
});
export const sworksheetsPanelAtoms = { worksheet, selected, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(sworksheetsPanelAtoms.modals);
    return (data: Partial<{ deleter: boolean; checker: boolean }>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
