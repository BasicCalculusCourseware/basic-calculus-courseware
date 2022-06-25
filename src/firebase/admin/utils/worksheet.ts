// TYPES
import type { Worksheet } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getAllWorksheets(quarterId: string, lessonId: string) {
    const worksheets: Worksheet[] = [];
    const querySnap = await db
        .collection('worksheets')
        .where('quarterId', '==', quarterId)
        .where('lessonId', '==', lessonId)
        .orderBy('createdAt')
        .get();
    if (querySnap.empty) return worksheets;
    querySnap.forEach((doc) =>
        worksheets.push({ id: doc.id, ...doc.data() } as Worksheet)
    );
    return worksheets;
}
export async function getWorksheet(worksheetId: string) {
    const doc = await db.doc(`worksheets/${worksheetId}`).get();
    if (!doc.exists) throw 'worksheet was not found';
    return { id: doc.id, ...doc.data() } as Worksheet;
}
