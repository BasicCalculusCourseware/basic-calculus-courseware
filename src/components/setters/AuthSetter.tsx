// TYPES
import type { ChildrenProp } from 'src/interfaces';
// LIB-FUNCTIONS
import { useEffect } from 'react';
// FIREBASE
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/firebase/client';
import { getUser } from 'src/firebase/client/utils/user';
// RECOIL
import { useRecoilState, useRecoilValue } from 'recoil';
import { authAtoms, useResetAuth, useSetAuth } from 'src/states/auth';
import { gsspAtoms } from 'src/states/gssp';

// MAIN-COMPONENT
export default function AuthSetter({ children }: ChildrenProp) {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const [isAuthInitialized, setIsAuthInitialized] = useRecoilState(
        authAtoms.isAuthInitialized
    );
    const setAuth = useSetAuth();
    const resetAuth = useResetAuth();
    // IMPLEMENT GSSP
    useEffect(() => {
        if (!gssp.error && gssp.body && gssp.body.user) setAuth(gssp.body.user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    // WATCH AUTH STATE
    useEffect(() => {
        let unsubscribe: any = null;
        if (!isAuthInitialized) {
            setIsAuthInitialized(true);
            unsubscribe = onAuthStateChanged(auth, (authUser) => {
                (async () => {
                    try {
                        if (!authUser) throw new Error();
                        const user = await getUser(authUser.uid);
                        if (user) await setAuth(user);
                    } catch {
                        await resetAuth();
                    } finally {
                        document.body.setAttribute('data-is-app-loading', 'false');
                    }
                })();
            });
        }
        return () => {
            unsubscribe && unsubscribe();
        };
    }, [isAuthInitialized, setIsAuthInitialized, setAuth, resetAuth]);
    // RENDER
    return children;
}
