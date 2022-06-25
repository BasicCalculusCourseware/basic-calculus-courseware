// TYPES
import type { Module } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getAllModules(quarterId: string, lessonId: string) {
    const modules: Module[] = [];
    const querySnap = await db
        .collection('modules')
        .where('quarterId', '==', quarterId)
        .where('lessonId', '==', lessonId)
        .orderBy('createdAt')
        .get();
    if (querySnap.empty) return modules;
    querySnap.forEach((doc) => modules.push({ id: doc.id, ...doc.data() } as Module));
    return modules;
}
