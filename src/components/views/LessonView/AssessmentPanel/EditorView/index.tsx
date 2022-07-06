// LIB-FUNCTIONS
import { atom } from 'recoil';
// COMPONENTS
import EditorView from './EditorView';

// MAIN-COMPONENT
export default EditorView;

/* STATES START */

// ATOMS
const tab = atom<number>({
    key: 'EV.tab',
    default: 0,
});
export const EVAtoms = { tab };

/* STATES END */
