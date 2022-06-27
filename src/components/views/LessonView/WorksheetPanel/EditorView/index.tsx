// LIB-FUNCTIONS
import { atom } from 'recoil';
// FUNCTIONS
import { initialStates } from 'src/utils';
// COMPONENTS
import EditorView from './EditorView';

// MAIN-COMPONENT
export default EditorView;

/* STATES START */

// ATOMS
const tab = atom<number>({
    key: 'editorViewTab' + Date.now(),
    default: 0,
});
export const editorViewAtoms = { tab };

/* STATES END */
