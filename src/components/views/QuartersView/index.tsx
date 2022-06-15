// TYPES
import type { Quarter } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import { getAllQuarters } from 'src/firebase/client/utils/quarter';
import initialState from 'src/utils/initialStates';
// COMPONENTS
import QuartersView from './QuartersView';

// MAIN-COMPONENT
export default QuartersView;

/* STATES START */

// ATOM TYPES
interface Modals {
    creator: boolean;
    editor: boolean;
    deleter: boolean;
}

// ATOMS
const quarters = atom<Quarter[]>({
    key: 'quarters' + Date.now(),
    default: [],
});
const selected = atom<Quarter>({
    key: 'selected' + Date.now(),
    default: initialState.quarter,
});
const modals = atom<Modals>({
    key: 'modals' + Date.now(),
    default: {
        creator: false,
        editor: false,
        deleter: false,
    },
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
