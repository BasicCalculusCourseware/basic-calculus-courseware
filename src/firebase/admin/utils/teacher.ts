// TYPES
import type { User } from 'src/interfaces';
// FUNCTIONS
import { db, auth } from 'src/firebase/admin';

export async function getTeachers() {
    const teachers: User[] = [];
    const querySnap = await db
        .collection('users')
        .orderBy('name')
        .where('role', '==', 'teacher')
        .get();
    if (querySnap.empty) teachers;
    await Promise.all(
        querySnap.docs.map(async (doc) => {
            const { emailVerified: isEmailVerified } = await auth.getUser(doc.id);
            teachers.push({ ...doc.data, isEmailVerified } as User);
        })
    );
    return teachers;
}
export async function getTotalTeachers() {
    const teachers = await getTeachers();
    return teachers.length;
}
