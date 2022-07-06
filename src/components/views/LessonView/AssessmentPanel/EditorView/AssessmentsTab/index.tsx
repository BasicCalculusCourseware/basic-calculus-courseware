// TYPES
import type { Assessment, Modals } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import AssessmentsTab from './AssessmentsTab';

// MAIN-COMPONENTS
export default AssessmentsTab;

/* STATES START */

// ATOM TYPES
interface CustomModals extends Modals {
    questionnaire: boolean;
}

// ATOMS
const selected = atom<Assessment>({
    key: 'AT.selected' + Date.now(),
    default: initialStates.assessment,
});
const modals = atom<CustomModals>({
    key: 'AT.modals' + Date.now(),
    default: {
        ...initialStates.modals,
        questionnaire: false,
    },
});
export const ATAtoms = { selected, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(ATAtoms.modals);
    return (data: Partial<CustomModals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
