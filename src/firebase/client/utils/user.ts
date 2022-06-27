// TYPES
import type { User } from 'src/interfaces';
// LIB-FUNCTIONS
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';
// FUNCTIONS
import { sign, verify, verifyResult } from 'src/utils';
import { db } from 'src/firebase/client';

export async function getUser(uid: string) {
    const { data } = await axios.get('/api/users', {
        params: { payloadToken: sign({ action: 'getUser', uid }) },
    });
    if (!data.responseToken) throw 'responseToken is missing';
    const body = verifyResult(data.responseToken);
    return body.user as User;
}
export async function getUserByEmail(email: string) {
    const { data } = await axios.get('/api/users', {
        params: { payloadToken: sign({ action: 'getUserByEmail', email }) },
    });
    if (!data.responseToken) throw 'responseToken is missing';
    const body = verifyResult(data.responseToken);
    return body.user as User;
}
export async function getUserFromAuthAPI() {
    const { data } = await axios.get('/api/auth', {
        params: { payloadToken: sign() },
    });
    if (!data.responseToken) throw 'responseToken is missing';
    const body = verifyResult(data.responseToken);
    return body.user as User;
}
export async function setUserCookie(uid: string, role: string) {
    await axios.post('/api/auth', {
        payloadToken: sign({
            authToken: sign({ uid, role }),
        }),
    });
}
export async function deleteUserCookie() {
    await axios.delete('/api/auth', {
        params: { payloadToken: sign() },
    });
}
export async function updateUser(uid: string, data: Partial<User>) {
    await updateDoc(doc(db, 'users', uid), data);
}
export async function updateUserPassword(uid: string, password: string) {
    const { data: res } = await axios.get('/api/users', {
        params: {
            payloadToken: sign({
                action: 'updateUserPassword',
                uid,
                password,
            }),
        },
    });
    if (!res.responseToken) throw 'responseToken is missing';
    const { error } = verify(res.responseToken);
    if (error) throw error;
}
export async function deleteUser(uid: string) {
    const { data: res } = await axios.get('/api/users', {
        params: {
            payloadToken: sign({
                action: 'deleteUser',
                uid,
            }),
        },
    });
    if (!res.responseToken) throw 'responseToken is missing';
    const { error } = verify(res.responseToken);
    if (error) throw error;
}
export async function doesUserExists(uid: string) {
    try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        return docSnap.exists();
    } catch {
        return false;
    }
}
