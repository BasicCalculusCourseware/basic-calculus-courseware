// TYPES
import type { Module } from 'src/interfaces';
// LIB-FUNCTIONS
import {
    collection,
    doc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    setDoc,
    addDoc,
    orderBy,
} from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
// FUNCTIONS
import { db, storage } from 'src/firebase/client';
import { getFileExtension } from 'src/utils';

export async function createModule(
    quarterid: string,
    lessonId: string,
    fileName: string,
    file: File
) {
    const docRef = await addDoc(collection(db, 'modules'), {
        quarterid,
        lessonId,
        fileName,
        createdAt: new Date().toDateString(),
    });
    const obj = await uploadBytes(
        ref(storage, `modules/${docRef.id}.${getFileExtension(fileName)})`),
        file,
        {
            cacheControl: 'public,max-age=86400',
        }
    );
    const downloadUrl = await getDownloadURL(obj.ref);
    await setDoc(docRef, { downloadUrl }, { merge: true });
}
export async function updateModule(moduleId: string, data: { fileName: string }) {
    await setDoc(doc(db, 'modules', moduleId), data, { merge: true });
}
export async function deleteModule(moduleId: string) {
    const { fileName } = await getModule(moduleId);
    await deleteDoc(doc(db, 'modules', moduleId));
    await deleteObject(ref(storage, `modules/${moduleId}.${getFileExtension(fileName)}`));
}
export async function deleteAllModules(quarterid: string, lessonId: string) {
    const modules = await getAllModules(quarterid, lessonId);
    if (modules.length)
        await Promise.all(modules.map(async ({ id }) => await deleteModule(id)));
}
export async function getModule(moduleId: string) {
    const docRef = await getDoc(doc(db, 'modules', moduleId));
    if (!docRef.exists()) throw 'module was not found';
    return { id: docRef.id, ...docRef.data() } as Module;
}
export async function getAllModules(quarterid: string, lessonId: string) {
    const modules: Module[] = [];
    const querySnap = await getDocs(
        query(
            collection(db, 'modules'),
            where('quarterid', '==', quarterid),
            where('lessonId', '==', lessonId),
            orderBy('createdAt')
        )
    );
    if (querySnap.empty) return modules;
    querySnap.forEach((doc) => modules.push({ id: doc.id, ...doc.data() } as Module));
    return modules;
}
