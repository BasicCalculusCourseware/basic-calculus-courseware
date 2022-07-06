// TYPES
import { Assessment, SubmittedAssessment } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import StudentView from './StudentView';

// MAIN-COMPONENTS
export default StudentView;

/* STATES START */

// ATOM TYPES
interface Modals {
    questionnaire: boolean;
    reviewer: boolean;
}

// ATOMS
const selected = atom<Assessment>({
    key: 'SV.selected' + Date.now(),
    default: initialStates.assessment,
});
const submitted = atom<SubmittedAssessment>({
    key: 'SV.submitted' + Date.now(),
    default: initialStates.submittedAssessment,
});
const modals = atom<Modals>({
    key: 'SV.modals' + Date.now(),
    default: {
        questionnaire: false,
        reviewer: false,
    },
});
export const SVAtoms = { selected, submitted, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(SVAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
