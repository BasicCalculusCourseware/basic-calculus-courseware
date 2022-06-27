// LIB-FUNCTIONS
import { atom } from 'recoil';
// COMPONENTS
import StudentView from './StudentView';

// MAIN-COMPONENT
export default StudentView;

/* STATES START */

// ATOMS
const tab = atom<number>({
    key: 'studentViewTab' + Date.now(),
    default: 0,
});
export const studentViewAtoms = { tab };

/* STATES END */
