// TYPES
import type { Lesson } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getLesson(lessonId: string) {
    const querySnap = await db.collection('lessons').doc(lessonId).get();
    return querySnap.exists ? ({ id: lessonId, ...querySnap.data() } as Lesson) : null;
}
export async function getAllLessons(quarterId: string) {
    const lessons: Lesson[] = [];
    const querySnap = await db
        .collection('lessons')
        .orderBy('number')
        .where('quarterId', '==', quarterId)
        .get();
    if (querySnap.empty) return lessons;
    querySnap.forEach((doc) => lessons.push({ id: doc.id, ...doc.data() } as Lesson));
    return lessons;
}
export async function getTotalLessons() {
    const querySnap = await db.collection('lessons').get();
    return querySnap.empty ? 0 : querySnap.docs.length;
}
