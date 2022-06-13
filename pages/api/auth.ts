// LIB TYPES
import type { NextApiResponse, NextApiRequest } from 'next';
// LIB FUNCTIONS
import Cookies from 'cookies';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { sign } from 'src/utils';
import verifyAcess from 'src/utils/verifyAccess';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    try {
        const data = verifyAcess(req);
        if (req.method === 'GET') {
            if (!req.cookies.authToken) throw 'authToken is missing';
            const { uid } = await getUserFromAuthToken(req.cookies.authToken);
            const user = await getUser(uid);
            return res.json({
                responseToken: sign({
                    error: null,
                    body: { user },
                }),
            });
        } else if (req.method === 'POST') {
            if (!data.authToken) throw 'authToken is missing';
            cookies.set('authToken', data.authToken, { sameSite: 'lax' });
            return res.json({
                responseToken: sign({
                    error: null,
                    body: null,
                }),
            });
        } else if (req.method === 'DELETE') {
            cookies.set('authToken');
            return res.json({
                responseToken: sign({
                    error: null,
                    body: null,
                }),
            });
        } else throw new Error();
    } catch (error: any) {
        let message = '';
        if (error.code) {
            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'User not found';
                    cookies.set('authToken');
                    break;
            }
        } else message = error;
        console.log('[api/auth|error]:', message);
        const responseToken = sign({ error: message, body: null });
        res.json({ responseToken });
    }
}
