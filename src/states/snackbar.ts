// TYPES
import { SnackbarItem, SnackbarItemVariant } from 'src/interfaces';
// LIB FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';

// ATOMS
const snackbarItems = atom<SnackbarItem[]>({
    key: 'snackbarItems',
    default: [],
});
export const snackbarAtoms = { snackbarItems };

// HOOKS
export const useAddSnackbarItem = () => {
    const setSnackbarItems = useSetRecoilState(snackbarAtoms.snackbarItems);
    return (variant: SnackbarItemVariant, message: string) => {
        const item = { id: Date.now(), variant, message };
        setSnackbarItems((items) => [...items, item]);
    };
};
export const useDeleteSnackbarItem = () => {
    const setSnackbarItems = useSetRecoilState(snackbarAtoms.snackbarItems);
    return (id: number) => {
        setSnackbarItems((items) => items.filter((item) => item.id !== id));
    };
};
