// TYPES
import type { Quarter } from 'src/interfaces';
// LIB-FUNCTIONS
import {
    doc,
    deleteDoc,
    getDocs,
    getDoc,
    collection,
    addDoc,
    setDoc,
    query,
    orderBy,
} from 'firebase/firestore';
// FUNCTIONS
import { deleteAllLessons } from './lesson';
import { db } from 'src/firebase/client';

export async function createQuarter(data: {
    number: string;
    title: string;
    color: string;
}) {
    await addDoc(collection(db, 'quarters'), {
        ...data,
        createdAt: Date.now(),
    });
}
export async function editQuarter(
    quarterId: string,
    data: Partial<{
        number: string;
        title: string;
        color: string;
    }>
) {
    await setDoc(doc(db, 'quarters', quarterId), data, { merge: true });
}
export async function deleteQuarter(quarterId: string) {
    await deleteDoc(doc(db, 'quarters', quarterId));
    await deleteAllLessons(quarterId);
}
export async function getQuarter(quarterId: string) {
    const docRef = await getDoc(doc(db, 'quarters', quarterId));
    if (!docRef.exists()) throw 'quarter was not found';
    return { id: docRef.id, ...docRef.data() } as Quarter;
}
export async function getAllQuarters() {
    const quarters: Quarter[] = [];
    const querySnap = await getDocs(query(collection(db, 'quarters'), orderBy('number')));
    if (querySnap.empty) return quarters;
    querySnap.forEach((doc) => quarters.push({ id: doc.id, ...doc.data() } as Quarter));
    return quarters;
}
