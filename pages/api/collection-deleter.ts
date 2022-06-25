// LIB-TYPES
import type { NextApiResponse, NextApiRequest } from 'next';
// FUNCTIONS
import { db } from 'src/firebase/admin';
import { sign, verifyAccess } from 'src/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = verifyAccess(req);
        const bulkWriter = db.bulkWriter();
        bulkWriter.onWriteError((error) => {
            if (error.failedAttempts < 100) {
                return true;
            } else {
                console.log('Failed write at document: ', error.documentRef.path);
                return false;
            }
        });
        await db.recursiveDelete(db.collection(data.collectionPath), bulkWriter);
        res.json({
            responseToken: sign({
                error: null,
                body: null,
            }),
        });
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        console.log('[api/users|error]:', message);
        const responseToken = sign({ error: message, body: null });
        res.json({ responseToken });
    }
}
