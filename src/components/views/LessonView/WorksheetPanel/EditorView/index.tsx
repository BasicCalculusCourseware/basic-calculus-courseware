// LIB-FUNCTIONS
import { atom, useResetRecoilState } from 'recoil';
// COMPONENTS
import EditorView from './EditorView';

// MAIN-COMPONENT
export default EditorView;

/* STATES START */

// ATOMS
const tab = atom<number>({
    key: 'EV.tab' + Date.now(),
    default: 0,
});
export const editorViewAtoms = { tab };

// HOOKS
export const useResetData = () => {
    const resetTab = useResetRecoilState(editorViewAtoms.tab);
    return () => {
        resetTab();
    };
};

/* STATES END */
