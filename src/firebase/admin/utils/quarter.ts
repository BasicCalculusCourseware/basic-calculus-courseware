// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getQuarter(qid: string) {
    if (!qid) throw 'qid is missing';
    const snap = await db.collection('quarters').doc(qid).get();
    if (!snap.exists) throw 'quarter was not found';
    return { id: qid, ...snap.data() };
}
export async function getQuarters() {
    const quarters: any[] = [];
    const snap = await db.collection('quarters').orderBy('number').get();
    if (snap.empty) return quarters;
    snap.forEach((doc) => quarters.push({ id: doc.id, ...doc.data() }));
    return quarters;
}
export async function getTotalQuarters() {
    const quarters = await getQuarters();
    return quarters.length;
}
