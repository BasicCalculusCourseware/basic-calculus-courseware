// TYPES
import type { Assessment } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getAllAssessments(quarterId: string, lessonId: string) {
    const assessments: Assessment[] = [];
    const querySnap = await db
        .collection('assessments')
        .where('quarterId', '==', quarterId)
        .where('lessonId', '==', lessonId)
        .orderBy('createdAt')
        .get();
    if (querySnap.empty) return assessments;
    querySnap.forEach((doc) =>
        assessments.push({ id: doc.id, ...doc.data() } as Assessment)
    );
    return assessments;
}
