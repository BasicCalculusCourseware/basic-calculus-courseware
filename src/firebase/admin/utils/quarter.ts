// TYPES
import type { Quarter } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getQuarter(id: string) {
    const querySnap = await db.collection('quarters').doc(id).get();
    return querySnap.exists ? ({ id, ...querySnap.data() } as Quarter) : null;
}
export async function getQuarters() {
    const quarters: Quarter[] = [];
    const querySnap = await db.collection('quarters').orderBy('number').get();
    if (querySnap.empty) return quarters;
    querySnap.forEach((doc) => quarters.push({ id: doc.id, ...doc.data() } as Quarter));
    return quarters;
}
export async function getTotalQuarters() {
    const quarters = await getQuarters();
    return quarters.length;
}
