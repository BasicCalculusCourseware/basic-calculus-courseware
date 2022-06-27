// LIB-FUNCTIONS
import { atom, useResetRecoilState } from 'recoil';
// COMPONENTS
import StudentView from './StudentView';

// MAIN-COMPONENT
export default StudentView;

/* STATES START */

// ATOMS
const tab = atom<number>({
    key: 'ST.tab' + Date.now(),
    default: 0,
});
export const studentViewAtoms = { tab };

// HOOKS
export const useResetData = () => {
    const resetTab = useResetRecoilState(studentViewAtoms.tab);
    return () => {
        resetTab();
    };
};

/* STATES END */
