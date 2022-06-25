// TYPES
import type { Quarter } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getQuarter(quarterId: string) {
    const querySnap = await db.collection('quarters').doc(quarterId).get();
    return querySnap.exists ? ({ id: quarterId, ...querySnap.data() } as Quarter) : null;
}
export async function getAllQuarters() {
    const quarters: Quarter[] = [];
    const querySnap = await db.collection('quarters').orderBy('number').get();
    if (querySnap.empty) return quarters;
    querySnap.forEach((doc) => quarters.push({ id: doc.id, ...doc.data() } as Quarter));
    return quarters;
}
export async function getTotalQuarters() {
    const quarters = await getAllQuarters();
    return quarters.length;
}
