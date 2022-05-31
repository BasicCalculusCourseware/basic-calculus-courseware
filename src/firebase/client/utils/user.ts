// TYPES
import type { User } from 'src/interfaces';
// LIB FUNCTIONS
import axios from 'axios';
// FUNCTIONS
import { sign, verifyResult } from 'src/utils';

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
