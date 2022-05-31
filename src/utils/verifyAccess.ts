// LIB TYPES
import type { NextApiRequest } from 'next';
// FUNCTIONS
import { verify } from 'src/utils';

export default function verifyAcess(req: NextApiRequest) {
    const payloadToken = req.body.payloadToken || req.query.payloadToken;
    if (!payloadToken) throw 'payloadToken is missing';
    return verify(payloadToken);
}
