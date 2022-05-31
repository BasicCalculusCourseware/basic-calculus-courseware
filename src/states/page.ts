// LIB FUNCTIONS
import { atom } from 'recoil';

// ATOMS
const pageBase = atom<string>({
    key: 'pageBase' + Date.now(),
    default: '',
});
const isPageUsingSidebar = atom<boolean>({
    key: 'isPageUsingSidebar' + Date.now(),
    default: false,
});
export const pageAtoms = { pageBase, isPageUsingSidebar };
