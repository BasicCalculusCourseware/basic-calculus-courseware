// TYPES
import type { Result } from 'src/interfaces';
// LIB FUNCTION
import { atom } from 'recoil';

// ATOMS
const gssp = atom<Result>({
    key: 'gssp' + Date.now(),
    default: {
        error: null,
        body: null,
    },
});
export const gsspAtoms = { gssp };
