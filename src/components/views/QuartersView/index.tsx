// TYPES
import type { Quarter, Modals } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import { getAllQuarters } from 'src/firebase/client/utils/quarter';
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import QuartersView from './QuartersView';

// MAIN-COMPONENT
export default QuartersView;

/* STATES START */

// ATOMS
const quarters = atom<Quarter[]>({
    key: 'quarters' + Date.now(),
    default: [],
});
const selected = atom<Quarter>({
    key: 'selected' + Date.now(),
    default: initialStates.quarter,
});
const modals = atom<Modals>({
    key: 'modals' + Date.now(),
    default: initialStates.modals,
});
export const quartersViewAtoms = { quarters, selected, modals };

// HOOKS
export const useRefreshQuarters = () => {
    const setQuarters = useSetRecoilState(quartersViewAtoms.quarters);
    return async () => {
        const quarters = await getAllQuarters();
        setQuarters(quarters);
    };
};
export const useSetModal = () => {
    const setModals = useSetRecoilState(quartersViewAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
