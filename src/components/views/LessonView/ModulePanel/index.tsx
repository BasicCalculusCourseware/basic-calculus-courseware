// TYPES
import type { Module, Modals } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
// FUNCTIONS
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import ModulePanel from './ModulePanel';

// MAIN-COMPONENTS
export default ModulePanel;

/* STATES START */

// ATOMS
const selected = atom<Module>({
    key: 'selected' + Date.now(),
    default: initialStates.module,
});
const modals = atom<Modals>({
    key: 'modals' + Date.now(),
    default: initialStates.modals,
});
export const modulePanelAtoms = { selected, modals };

// HOOKS
export const useSetModal = () => {
    const setModals = useSetRecoilState(modulePanelAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
