// TYPES
import type { Worksheet } from 'src/interfaces';
// LIB FUNCTIONS
import {
    doc,
    collection,
    query,
    where,
    getDocs,
    getDoc,
    deleteDoc,
    setDoc,
    addDoc,
    orderBy,
} from 'firebase/firestore';
import {
    ref,
    deleteObject,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';
// FUNCTIONS
import { db, storage } from 'src/firebase/client';
import { deleteAllSubmittedWorksheets } from './submitedWorksheet';
import { getFileExtension } from 'src/utils';

export async function createWorksheet(
    quarterId: string,
    lessonId: string,
    data: {
        points: number;
        fileName: string;
        fileExtension: string;
        file: File;
    }
) {
    const { points, fileName, fileExtension, file } = data;
    const docRef = await addDoc(collection(db, 'worksheets'), {
        quarterId,
        lessonId,
        points,
        fileName: `${fileName}.${fileExtension}`,
        createdAt: Date.now(),
    });
    const obj = await uploadBytes(
        ref(storage, `worksheets/${docRef.id}`),
        file,
        {
            cacheControl: 'public,max-age=86400',
        }
    );
    const downloadUrl = await getDownloadURL(obj.ref);
    await setDoc(docRef, { downloadUrl }, { merge: true });
}
export async function updateWorksheet(
    worksheetId: string,
    data: Partial<{ fileName: string; points: number }>
) {
    await setDoc(doc(db, 'worksheets', worksheetId), data, { merge: true });
}
export async function getWorksheet(worksheetId: string) {
    const docRef = await getDoc(doc(db, 'worksheets', worksheetId));
    if (!docRef.exists()) throw 'Worksheet was not found';
    return { id: docRef.id, ...docRef.data() } as Worksheet;
}
export async function getAllWorksheets(quarterId: string, lessonId: string) {
    const worksheets: Worksheet[] = [];
    const querySnap = await getDocs(
        query(
            collection(db, 'worksheets'),
            where('quarterId', '==', quarterId),
            where('lessonId', '==', lessonId),
            orderBy('fileName')
        )
    );
    if (querySnap.empty) return worksheets;
    querySnap.forEach((doc) =>
        worksheets.push({ id: doc.id, ...doc.data() } as Worksheet)
    );
    return worksheets;
}
export async function deleteWorksheet(worksheetId: string) {
    const worksheet = await getWorksheet(worksheetId);
    const fileExtension = getFileExtension(worksheet.fileName);
    await deleteAllSubmittedWorksheets(worksheetId);
    await deleteDoc(doc(db, 'worksheets', worksheetId));
    await deleteObject(ref(storage, `worksheets/${worksheetId}`));
}
export async function deleteAllWorksheets(quarterId: string, lessonId: string) {
    const worksheets = await getAllWorksheets(quarterId, lessonId);
    if (worksheets.length)
        await Promise.all(
            worksheets.map(async ({ id }) => await deleteWorksheet(id))
        );
}
