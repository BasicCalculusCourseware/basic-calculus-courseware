// TYPES
import type { SubmittedWorksheet } from 'src/interfaces';
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
} from 'firebase/firestore';
import {
    ref,
    deleteObject,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';
import axios from 'axios';
// FUNCTIONS
import { sign } from 'src/utils';
import { db, storage } from 'src/firebase/client';

export async function submitWorksheet(
    worksheetId: string,
    file: File,
    data: {
        uid: string;
        fileName: string;
    }
) {
    const docRef = await addDoc(
        collection(db, `worksheets/${worksheetId}/submitted`),
        {
            ...data,
            worksheetId,
            score: 0,
            isChecked: false,
            createdAt: Date.now(),
        }
    );
    const obj = await uploadBytes(
        ref(storage, `worksheets/submitted/${docRef.id}`),
        file,
        {
            cacheControl: 'public,max-age=86400',
        }
    );
    const downloadUrl = await getDownloadURL(obj.ref);
    await setDoc(docRef, { downloadUrl }, { merge: true });
}
export async function unsubmitWorksheet(worksheetId: string, uid: string) {
    const querySnap = await getDocs(
        query(
            collection(db, `worksheets/${worksheetId}/submitted`),
            where('uid', '==', uid)
        )
    );
    if (querySnap.empty) throw 'Submitted Worksheet was not found';
    await deleteSubmittedWorksheet(querySnap.docs[0].id, worksheetId);
}
export async function scoreSubmittedWorksheet(
    submittedWorksheetId: string,
    worksheetId: string,
    score: number
) {
    await setDoc(
        doc(db, `worksheets/${worksheetId}/submitted`, submittedWorksheetId),
        { score },
        { merge: true }
    );
}
export async function isWorksheetCompleted(worksheetId: string, uid: string) {
    const querySnap = await getDocs(
        query(
            collection(db, `worksheets/${worksheetId}/submitted`),
            where('uid', '==', uid)
        )
    );
    return !querySnap.empty;
}
export async function updateSubmittedWorksheet(
    submittedWorksheetId: string,
    worksheetId: string,
    data: Partial<{
        fileName: string;
        score: number;
    }>
) {
    await setDoc(
        doc(db, `worksheets/${worksheetId}/submitted`, submittedWorksheetId),
        data,
        { merge: true }
    );
}
export async function deleteSubmittedWorksheet(
    submittedWorksheetId: string,
    worksheetId: string
) {
    await deleteDoc(
        doc(db, `worksheets/${worksheetId}/submitted`, submittedWorksheetId)
    );
    await deleteObject(
        ref(storage, `worksheets/submitted/${submittedWorksheetId}`)
    );
}
export async function deleteAllSubmittedWorksheets(worksheetId: string) {
    const submittedWorksheets = await getAllSubmittedWorksheets(worksheetId);
    await Promise.all(
        submittedWorksheets.map(
            async ({ id }) => await deleteSubmittedWorksheet(id, worksheetId)
        )
    );
    await axios.delete('/api/collection-deleter', {
        params: {
            payloadToken: sign({
                collectionPath: `worksheets/${worksheetId}/submitted`,
            }),
        },
    });
}
export async function getSubmittedWorksheet(
    worksheetId: string,
    submittedWorksheetId: string
) {
    const docRef = await getDoc(
        doc(db, `worksheets/${worksheetId}/submitted`, submittedWorksheetId)
    );
    if (!docRef.exists()) throw 'Submitted worksheet was not found';
    return { id: docRef.id, ...docRef.data() } as SubmittedWorksheet;
}
export async function getSubmittedWorksheetByUID(
    worksheetId: string,
    uid: string
) {
    const querySnap = await getDocs(
        query(
            collection(db, `worksheets/${worksheetId}/submitted`),
            where('uid', '==', uid)
        )
    );
    if (querySnap.empty) return null;
    return {
        id: querySnap.docs[0].id,
        ...querySnap.docs[0].data(),
    } as SubmittedWorksheet;
}
export async function getAllSubmittedWorksheets(worksheetId: string) {
    const submittedWorksheets: SubmittedWorksheet[] = [];
    const querySnap = await getDocs(
        collection(db, `worksheets/${worksheetId}/submitted`)
    );
    if (querySnap.empty) return submittedWorksheets;
    querySnap.forEach((doc) =>
        submittedWorksheets.push({
            id: doc.id,
            ...doc.data(),
        } as SubmittedWorksheet)
    );
    return submittedWorksheets;
}
