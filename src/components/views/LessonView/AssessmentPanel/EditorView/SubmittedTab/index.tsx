// TYPES
import type { Assessment, SubmittedAssessment } from 'src/interfaces';
// LIB-FUNCTIONS
import {
    atom,
    useSetRecoilState,
    useRecoilValue,
    useResetRecoilState,
} from 'recoil';
// FUNCTIONS
import { getAllSubmittedAssessment } from 'src/firebase/client/utils/submittedAssessment';
import { initialStates } from 'src/utils';
// COMPONENTS
import SubmittedTab from './SubmittedTab';

// MAIN-COMPONENT
export default SubmittedTab;

/* STATES START */

// ATOMS
const assessment = atom<Assessment>({
    key: 'ST.assessment' + Date.now(),
    default: initialStates.assessment,
});
const sassessments = atom<SubmittedAssessment[]>({
    key: 'ST.sassessments' + Date.now(),
    default: [],
});
const isLoading = atom<boolean>({
    key: 'ST.isLoading' + Date.now(),
    default: false,
});
const selected = atom<SubmittedAssessment>({
    key: 'ST.selected' + Date.now(),
    default: initialStates.submittedAssessment,
});
const modals = atom<{ deleter: boolean; viewer: boolean }>({
    key: 'ST.modals' + Date.now(),
    default: {
        deleter: false,
        viewer: false,
    },
});
export const STAtoms = {
    assessment,
    sassessments,
    isLoading,
    selected,
    modals,
};

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(STAtoms.modals);
    return (data: Partial<{ deleter: boolean; viewer: boolean }>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};
export const useFetchData = () => {
    const assessment = useRecoilValue(STAtoms.assessment);
    const setSAssessments = useSetRecoilState(STAtoms.sassessments);
    const setIsLoading = useSetRecoilState(STAtoms.isLoading);
    return async () => {
        if (!assessment.id) return;
        setIsLoading(true);
        const submitted = await getAllSubmittedAssessment(assessment.id);
        setSAssessments(submitted);
        setIsLoading(false);
    };
};
export const useResetData = () => {
    const resetAssessment = useResetRecoilState(STAtoms.assessment);
    const resetSAssessments = useResetRecoilState(STAtoms.sassessments);
    const resetIsLoading = useResetRecoilState(STAtoms.isLoading);
    const resetSelected = useResetRecoilState(STAtoms.selected);
    const resetModals = useResetRecoilState(STAtoms.modals);
    return () => {
        resetAssessment();
        resetSAssessments();
        resetIsLoading();
        resetSelected();
        resetModals();
    };
};

/* STATES END */
