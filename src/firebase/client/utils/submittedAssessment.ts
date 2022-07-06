// TYPES
import type { AssessmentItem, SubmittedAssessment } from 'src/interfaces';
// LIB-FUNCTIONS
import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import axios from 'axios';
// FUNCTIONS
import { db } from 'src/firebase/client';
import { sign } from 'src/utils';

export async function submitAssessment(data: {
    assessmentId: string;
    uid: string;
    items: AssessmentItem[];
}) {
    let score = 0;
    data.items.map((item) => {
        if (item.answer === item.correctChoice) score++;
    });
    await setDoc(
        doc(db, `assessments/${data.assessmentId}/submitted`, data.uid),
        {
            ...data,
            score,
        }
    );
}
export async function getSubmittedAssessment(
    assessmentId: string,
    uid: string
) {
    const docSnap = await getDoc(
        doc(db, `assessments/${assessmentId}/submitted`, uid)
    );
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as SubmittedAssessment;
}
export async function getAllSubmittedAssessment(assessmentId: string) {
    const submittedAssessments: SubmittedAssessment[] = [];
    const querySnap = await getDocs(
        collection(db, `assessments/${assessmentId}/submitted`)
    );
    if (querySnap.empty) return submittedAssessments;
    querySnap.forEach((doc) =>
        submittedAssessments.push({
            id: doc.id,
            ...doc.data(),
        } as SubmittedAssessment)
    );
    return submittedAssessments;
}
export async function deleteSubmittedAssessment(
    submittedAssessmentId: string,
    assessmentId: string
) {
    await deleteDoc(
        doc(db, 'assessments', assessmentId, 'submitted', submittedAssessmentId)
    );
}
export async function deleteAllSubmittedWorksheets(assessmentId: string) {
    const submittedWorksheets = await getAllSubmittedAssessment(assessmentId);
    await Promise.all(
        submittedWorksheets.map(
            async ({ id }) => await deleteSubmittedAssessment(id, assessmentId)
        )
    );
    await axios.delete('/api/collection-deleter', {
        params: {
            payloadToken: sign({
                collectionPath: `assessments/${assessmentId}/submitted`,
            }),
        },
    });
}
