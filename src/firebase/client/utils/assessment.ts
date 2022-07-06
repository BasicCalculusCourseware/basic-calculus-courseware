// TYPES
import type {
    Assessment,
    AssessmentItem,
    SubmittedAssessment,
} from 'src/interfaces';
// LIB-FUNCTIONS
import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    getDocs,
    where,
    query,
    addDoc,
    setDoc,
    orderBy,
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
// FUNCTIONS
import { db, storage } from 'src/firebase/client';

export async function getAllAssessments(quarterId: string, lessonId: string) {
    const assessments: Assessment[] = [];
    const querySnap = await getDocs(
        query(
            collection(db, 'assessments'),
            where('quarterId', '==', quarterId),
            where('lessonId', '==', lessonId),
            orderBy('title')
        )
    );
    if (querySnap.empty) return assessments;
    querySnap.forEach((doc) =>
        assessments.push({ id: doc.id, ...doc.data() } as Assessment)
    );
    return assessments;
}
export async function getAssessment(assessmentId: string) {
    const docSnap = await getDoc(doc(db, 'assessments', assessmentId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Assessment;
}
export async function createAssessment(data: {
    quarterId: string;
    lessonId: string;
    title: string;
    description: string;
}) {
    await addDoc(collection(db, 'assessments'), {
        ...data,
        items: [],
        createdAt: Date.now(),
    });
}
export async function updateAssessment(
    assessmentId: string,
    data: Partial<{
        title: string;
        description: string;
        items: AssessmentItem[];
    }>
) {
    await setDoc(doc(db, 'assessments', assessmentId), data, { merge: true });
}
export async function deleteAssessment(assessmentId: string) {
    const assessment = await getAssessment(assessmentId);
    if (assessment) {
        await Promise.all(
            assessment.items.map(
                async (item) =>
                    item.image && (await deleteAssessmentItemImage(item.id))
            )
        );
    }
    await deleteDoc(doc(db, 'assessments', assessmentId));
}
export async function deleteAllAssessments(
    quarterId: string,
    lessonId: string
) {
    const assessments = await getAllAssessments(quarterId, lessonId);
    if (!assessments.length) return;
    await Promise.all(
        assessments.map(async ({ id }) => await deleteAssessment(id))
    );
}
export async function uploadAssessmentItemImage(id: string, file: File) {
    const obj = await uploadBytes(ref(storage, `assessments/${id}`), file, {
        cacheControl: 'public,max-age=86400',
    });
    return await getDownloadURL(obj.ref);
}
export async function deleteAssessmentItemImage(id: string) {
    await deleteObject(ref(storage, `assessments/${id}`));
}
