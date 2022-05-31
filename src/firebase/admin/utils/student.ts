// TYPES
import type { User } from 'src/interfaces';
// FUNCTIONS
import { db, auth } from 'src/firebase/admin';

export async function getStudents() {
    const students: User[] = [];
    const querySnap = await db
        .collection('users')
        .orderBy('name')
        .where('role', '==', 'student')
        .get();
    if (querySnap.empty) return students;
    await Promise.all(
        querySnap.docs.map(async (doc) => {
            const { emailVerified: isEmailVerified } = await auth.getUser(doc.id);
            students.push({ ...doc.data(), isEmailVerified } as User);
        })
    );
    return students;
}
export async function getTotalStudents() {
    const students = await getStudents();
    return students.length;
}
