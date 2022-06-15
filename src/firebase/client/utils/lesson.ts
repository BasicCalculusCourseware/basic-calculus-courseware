// TYPES
import type { Lesson } from 'src/interfaces';
// LIB-FUNCTIONS
import {
    doc,
    collection,
    query,
    getDoc,
    getDocs,
    deleteDoc,
    where,
    addDoc,
    setDoc,
    orderBy,
} from 'firebase/firestore';
import _ from 'lodash';
// FUNCTIONS
import { db } from 'src/firebase/client';
import { deleteAllVideos } from './video';
import { deleteAllModules } from './module';
import { deleteAllWorksheets } from './worksheet';
import { deleteAllAssessments } from './assessment';

export async function createLesson(data: {
    quarterId: string;
    number: string;
    title: string;
    intro: string;
    color: string;
}) {
    await addDoc(collection(db, 'lessons'), {
        data,
        createdAt: Date.now(),
    });
}
export async function editLesson(
    lessonId: string,
    data: Partial<{
        number: string;
        title: string;
        intro: string;
        color: string;
    }>
) {
    await setDoc(doc(db, 'lessons', lessonId), data, { merge: true });
}
export async function deleteLesson(lessonId: string) {
    const { quarterId } = await getLesson(lessonId);
    await deleteDoc(doc(db, 'lessons', lessonId));
    await deleteAllVideos(quarterId, lessonId);
    await deleteAllModules(quarterId, lessonId);
    await deleteAllWorksheets(quarterId, lessonId);
    await deleteAllAssessments(quarterId, lessonId);
}
export async function deleteAllLessons(quarterId: string) {
    const querySnap = await getDocs(
        query(collection(db, 'lessons'), where('quarterId', '==', quarterId))
    );
    if (!querySnap.empty)
        await Promise.all(querySnap.docs.map(async (doc) => await deleteLesson(doc.id)));
}
export async function getLesson(lessonId: string) {
    const docRef = await getDoc(doc(db, 'lessons', lessonId));
    if (!docRef.exists()) throw 'Lesson was not found';
    return { id: docRef.id, ...docRef.data() } as Lesson;
}
export async function getAllLessons(quarterId: string) {
    const lessons: Lesson[] = [];
    const querySnap = await getDocs(
        query(collection(db, 'lessons'), where('qid', '==', quarterId), orderBy('number'))
    );
    if (querySnap.empty) return lessons;
    querySnap.forEach((doc) => lessons.push({ id: doc.id, ...doc.data() } as Lesson));
    return lessons;
}
