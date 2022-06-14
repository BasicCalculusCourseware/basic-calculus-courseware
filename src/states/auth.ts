// TYPES
import type { User, UserRoles } from 'src/interfaces';
// LIB-FUNCTIONS
import { signOut } from 'firebase/auth';
import Router from 'next/router';
// FUNCTIONS
import { setUserCookie, deleteUserCookie } from 'src/firebase/client/utils/user';
import { auth } from 'src/firebase/client';
import initialStates from 'src/utils/initialStates';
// RECOIL
import { atom, useSetRecoilState, useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useCloseSidebar } from 'src/states/sidebar';

// ATOMS
const user = atom<User>({
    key: 'user' + Date.now(),
    default: initialStates.user,
});
const userRoles = atom<UserRoles>({
    key: 'userRoles' + Date.now(),
    default: initialStates.userRoles,
});
const isUserSignedIn = atom<boolean>({
    key: 'isUserSingedIn' + Date.now(),
    default: false,
});
const isAuthInitialized = atom<boolean>({
    key: 'isAuthInitialized' + Date.now(),
    default: false,
});
export const authAtoms = { user, userRoles, isUserSignedIn, isAuthInitialized };

// HOOKS
export const useSetAuth = () => {
    const setUser = useSetRecoilState(authAtoms.user);
    const setUserRoles = useSetRecoilState(authAtoms.userRoles);
    const setIsUserSignedIn = useSetRecoilState(authAtoms.isUserSignedIn);
    const handleBannedStatus = useHandleBannedStatus();
    return async (user: User) => {
        if (user.isBanned) return handleBannedStatus();
        setUser(user);
        setUserRoles({
            isAdmin: user.role === 'admin',
            isTeacher: user.role === 'teacher',
            isStudent: user.role === 'student',
            isEditor: user.role === 'admin' || user.role === 'teacher',
        });
        setIsUserSignedIn(true);
        await setUserCookie(user.uid, user.role);
    };
};
export const useResetAuth = () => {
    const setUser = useSetRecoilState(authAtoms.user);
    const setUserRoles = useSetRecoilState(authAtoms.userRoles);
    const setIsUserSignedIn = useSetRecoilState(authAtoms.isUserSignedIn);
    return async () => {
        setUser(initialStates.user);
        setUserRoles(initialStates.userRoles);
        setIsUserSignedIn(false);
        await deleteUserCookie();
    };
};
export const useSignOut = () => {
    const resetAuth = useResetAuth();
    const addSnackbarItem = useAddSnackbarItem();
    const closeSidebar = useCloseSidebar();
    return async () => {
        try {
            addSnackbarItem('info', 'Signing out');
            closeSidebar();
            await signOut(auth);
            await resetAuth();
            addSnackbarItem('success', 'Signed out successfully');
            await Router.push('/');
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        }
    };
};
export const useHandleBannedStatus = () => {
    const signOut = useSignOut();
    const addSnackbarItem = useAddSnackbarItem();
    return () => {
        addSnackbarItem('error', 'Your account is banned');
        signOut();
    };
};
