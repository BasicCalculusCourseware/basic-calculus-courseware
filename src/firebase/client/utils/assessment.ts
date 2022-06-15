// TYPES
import type {
    Assessment,
    AssessmentItem,
    AssessmentItemChoice,
    AssessmentResult,
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// FUNCTIONS
import { db, storage } from 'src/firebase/client';

export async function getAssessments(quarterId: string, lessonId: string) {
    const assessments: Assessment[] = [];
    const querySnap = await getDocs(
        query(
            collection(db, 'assessments'),
            where('quarterId', '==', quarterId),
            where('lessonId', '==', lessonId),
            orderBy('createdAt')
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
        createdAt: Date.now(),
    });
}
export async function updateAssessment(
    assessmentId: string,
    data: Partial<{
        title: string;
        description: string;
    }>
) {
    await setDoc(doc(db, 'assessments', assessmentId), data, { merge: true });
}
export async function deleteAssessment(assessmentId: string) {
    await deleteDoc(doc(db, 'assessments', assessmentId));
}
export async function deleteAllAssessments(quarterId: string, lessonId: string) {
    const assessments = await getAssessments(quarterId, lessonId);
    if (!assessments.length) return;
    await Promise.all(assessments.map(async ({ id }) => await deleteAssessment(id)));
}
export async function saveAssessmentItem(
    assessmentId: string,
    assessmentItemId: string,
    data: {
        question?: string;
        image?: string;
        choices?: AssessmentItemChoice[];
        correctChoice?: string;
        order?: number;
        answer?: string;
    }
) {
    await setDoc(doc(db, `assessments/${assessmentId}/items`, assessmentItemId), {
        ...data,
        answer: data?.answer || '',
    });
}
export async function saveAllAssessmentItems(
    assessmentId: string,
    assessmentItems: AssessmentItem[]
) {
    const items = await getAssessmentItems(assessmentId);
    const itemsId: string[] = items.map((item) => item.id);
    const usedItemIds: string[] = [];
    // SAVE ASSESSMENT ITEMS
    await Promise.all(
        assessmentItems.map(async (assessmentItem, index) => {
            usedItemIds.push(assessmentItem.id);
            const { question, image, choices, correctChoice } = assessmentItem;
            await saveAssessmentItem(assessmentId, assessmentItem.id, {
                question,
                image,
                choices,
                correctChoice,
                order: index,
            });
        })
    );
    // DELETE DELETED ASSESSMENT ITEMS
    await Promise.all(
        itemsId.map(async (itemId) => {
            if (!usedItemIds.includes(itemId))
                await deleteAssessmentItem(itemId, assessmentId);
        })
    );
}
export async function getAssessmentItems(assessmentId: string) {
    const assessmentItems: AssessmentItem[] = [];
    const querySnap = await getDocs(
        query(collection(db, `assessments/${assessmentId}/items`), orderBy('order'))
    );
    if (querySnap.empty) return assessmentItems;
    querySnap.forEach((doc) =>
        assessmentItems.push({ id: doc.id, ...doc.data() } as AssessmentItem)
    );
    return assessmentItems;
}
export async function deleteAssessmentItem(
    assessmentItemId: string,
    assessmentId: string
) {
    await deleteDoc(doc(db, `assessments/${assessmentId}/items`, assessmentItemId));
}
export async function updateAssessmentItem(
    assessmentId: string,
    assessmentItemId: string,
    data: Partial<{
        question: string;
        choices: AssessmentItemChoice[];
        correctChoice: string;
    }>
) {
    await setDoc(doc(db, `assessments/${assessmentId}/items`, assessmentItemId), data, {
        merge: true,
    });
}
export async function uploadAssessmentItemImage(file: File) {
    const obj = await uploadBytes(ref(storage, `assessments/${file.name}`), file, {
        cacheControl: 'public,max-age=86400',
    });
    return await getDownloadURL(obj.ref);
}
export async function getAssessmentItemsWithAnswer(assessmentId: string) {
    const assessmentItems: AssessmentItem[] = [];
    const querySnap = await getDocs(
        query(collection(db, `assessments/${assessmentId}/items`), orderBy('order'))
    );
    if (querySnap.empty) return assessmentItems;
    querySnap.forEach((doc) =>
        assessmentItems.push({
            id: doc.id,
            answer: '',
            ...doc.data(),
        } as unknown as AssessmentItem)
    );
    return assessmentItems;
}
export async function submitAssessment(data: {
    assessmentId: string;
    uid: string;
    items: AssessmentItem[];
}) {
    let score = 0;
    data.items.map((item) => {
        if (item.answer === item.correctChoice) score++;
    });
    await setDoc(doc(db, `assessments/${data.assessmentId}/results`, data.uid), {
        ...data,
        score,
    });
}
export async function getAssessmentScore(uid: string, assessmentId: string) {
    const docSnap = await getDoc(doc(db, `assessments/${assessmentId}/results`, uid));
    if (!docSnap.exists()) return null;
    const result = { id: docSnap.id, ...docSnap.data() } as AssessmentResult;
    return `${result.score}/${result.items.length}`;
}
