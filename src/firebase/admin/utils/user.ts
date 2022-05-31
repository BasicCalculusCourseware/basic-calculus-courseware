// TYPES
import type { User, AuthToken } from 'src/interfaces';
// FUNCTIONS
import { auth, db } from 'src/firebase/admin';
import { verify } from 'src/utils';

export async function getUser(uid: string) {
    const { emailVerified: isEmailVerified } = await auth.getUser(uid);
    const user = await getUserFromDB(uid);
    return { ...user, isEmailVerified } as User;
}
export async function getUserByEmail(email: string) {
    const { uid, emailVerified: isEmailVerified } = await auth.getUserByEmail(email);
    const user = await getUserFromDB(uid);
    return { ...user, isEmailVerified } as User;
}
export async function getUserFromDB(uid: string) {
    const docSnap = await db.collection('users').doc(uid).get();
    if (!docSnap.exists) throw 'user is missing';
    return docSnap.data() as Partial<User>;
}
export async function getUserFromAuthToken(authToken: string) {
    return verify(authToken) as AuthToken;
}
