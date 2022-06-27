// TYPES
import type { Worksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState, useResetRecoilState } from 'recoil';
// FUNCTIONS
import { initialStates } from 'src/utils';
// COMPONENTS
import WorksheetSubmitterPanel from './WorksheetSubmitterPanel';

// MAIN-COMPONENT
export default WorksheetSubmitterPanel;

/* STATES START */

// ATOMS
const worksheet = atom<Worksheet>({
    key: 'WSP.Worksheet' + Date.now(),
    default: initialStates.worksheet,
});
const modals = atom<{ submitter: boolean; unsubmitter: boolean }>({
    key: 'WSP.Modals' + Date.now(),
    default: {
        submitter: false,
        unsubmitter: false,
    },
});
export const WSPAtoms = { worksheet, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(WSPAtoms.modals);
    return (data: Partial<{ submitter: boolean; unsubmitter: boolean }>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};
export const useResetData = () => {
    const resetWorksheet = useResetRecoilState(WSPAtoms.worksheet);
    const resetModals = useResetRecoilState(WSPAtoms.modals);
    return () => {
        resetWorksheet();
        resetModals();
    };
};

/* STATES END */
